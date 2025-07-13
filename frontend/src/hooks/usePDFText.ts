import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?worker"; // ✅ note o ?worker no final

// Configure o worker corretamente
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker as any;

export const usePdfText = (url: string) => {
  const [text, setText] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        let extracted = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          extracted += strings.join(" ") + "\n\n";
        }

        setText(extracted);
      } catch (err) {
        console.error("Erro ao extrair texto do PDF:", err);
      }
    };

    if (url) load();
  }, [url]);

  return text;
};
