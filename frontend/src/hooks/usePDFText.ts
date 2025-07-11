// src/hooks/usePdfText.ts
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?worker";

// 📌 Configura o worker do PDF.js
GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const extrairTextoDoPDF = async (url: string): Promise<string> => {
  try {
    const pdf = await getDocument(url).promise;
    let textoCompleto = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const pagina = await pdf.getPage(i);
      const conteudo = await pagina.getTextContent();
      const strings = conteudo.items.map((item: any) => item.str);
      textoCompleto += strings.join(" ") + "\n\n";
    }

    return textoCompleto;
  } catch (err) {
    console.error("Erro ao extrair texto do PDF:", err);
    return "Erro ao processar o PDF.";
  }
};
