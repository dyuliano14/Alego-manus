import { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const usePdfText = (url: string) => {
  const [text, setText] = useState("");
  useEffect(() => {
    const load = async () => {
      try {
        const pdf = await getDocument(url).promise;
        let allText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          allText += strings.join(" ") + "\n\n";
        }
        setText(allText);
      } catch (err) {
        console.error("Erro ao extrair texto do PDF:", err);
      }
    };
    if (url) load();
  }, [url]);
  return text;
};
