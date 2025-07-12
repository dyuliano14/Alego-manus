// src/hooks/usePdfText.ts
import { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist";

// Corrige a configuração do worker
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`;

export const usePdfText = (url: string) => {
  const [text, setText] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const pdf = await getDocument(url).promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          fullText += strings.join(" ") + "\n\n";
        }

        setText(fullText);
      } catch (err) {
        console.error("Erro ao extrair texto:", err);
      }
    };

    if (url) load();
  }, [url]);

  return text;
};
