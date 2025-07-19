import { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
// @ts-ignore
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";

GlobalWorkerOptions.workerSrc = workerSrc;

export const usePdfText = (url: string) => {
  const [text, setText] = useState("");
  
  useEffect(() => {
    const load = async () => {
      // Verifica se a URL é válida e não está vazia
      if (!url || url.trim() === '' || url === 'undefined') {
        setText('');
        return;
      }

      // Verifica se o arquivo é um PDF pela extensão
      const isPDF = url.toLowerCase().endsWith('.pdf');
      if (!isPDF) {
        console.log('⚠️ Arquivo não é PDF, pulando extração de texto:', url);
        setText('');
        return;
      }

      try {
        console.log('🔄 Carregando PDF:', url);
        const pdf = await getDocument(url).promise;
        let allText = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          allText += strings.join(" ") + "\n\n";
        }
        
        console.log('✅ Texto extraído do PDF:', allText.length, 'caracteres');
        setText(allText);
      } catch (err) {
        console.error("Erro ao extrair texto do PDF:", err);
        setText(''); // Limpa o texto em caso de erro
      }
    };
    
    load();
  }, [url]);
  
  return text;
};
