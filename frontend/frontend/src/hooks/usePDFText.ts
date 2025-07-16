import { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
<<<<<<< HEAD
// @ts-ignore
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";

GlobalWorkerOptions.workerSrc = workerSrc;
=======
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

GlobalWorkerOptions.workerSrc = pdfjsWorker;
>>>>>>> 70b16420e1e4a7b232ecfdbff5772fd98767a044

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
