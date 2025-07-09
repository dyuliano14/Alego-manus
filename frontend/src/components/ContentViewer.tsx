import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import PDFNotes from "./PDFNotes";

interface Conteudo {
  id: number;
  tipo: string;
  arquivo: string;
}

interface Props {
  conteudo: Conteudo;
}

const ContentViewer: React.FC<Props> = ({ conteudo }) => {
  const [fullscreen, setFullscreen] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const toggleFullScreen = () => {
    setFullscreen(!fullscreen);
  };

  const lerTextoPDF = async () => {
    try {
      const pdf = await fetch(conteudo.arquivo).then((r) => r.arrayBuffer());
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
      const loadingTask = pdfjsLib.getDocument({ data: pdf });
      const pdfDoc = await loadingTask.promise;
      let fullText = "";
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        fullText += strings.join(" ") + "\n";
      }
      const utterance = new SpeechSynthesisUtterance(fullText);
      speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Erro ao ler PDF:", err);
    }
  };

 if (conteudo.tipo === "pdf") {
    return (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className={`relative ${fullscreen ? "fixed inset-0 z-50 bg-white" : "h-[600px]"} flex flex-col md:flex-row border rounded overflow-hidden`}>
          <div className="flex-1 overflow-auto">
            <Viewer fileUrl={conteudo.arquivo} plugins={[defaultLayoutPluginInstance]} />
          </div>
          <div className="w-full md:w-[300px] border-l p-2 bg-gray-50 overflow-auto">
            <PDFNotes conteudoId={conteudo.id} />
          </div>

          {/* Botões de ação */}
          <div className="absolute top-2 right-2 space-x-2 z-50">
            <button onClick={lerTextoPDF} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
              🔊 Ler PDF
            </button>
            <button onClick={toggleFullScreen} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded">
              {fullscreen ? "🔽 Sair Tela Cheia" : "🖥️ Tela Cheia"}
            </button>
          </div>
        </div>
      </Worker>
    );
  }

  if (conteudo.tipo === "markdown") {
    const mdText = conteudo.arquivo; // assuming conteudo.arquivo contains the markdown string
    return (
      <div className="prose max-w-none dark:prose-invert overflow-auto h-[600px] p-4 bg-white border rounded">
        <ReactMarkdown remarkPlugins={[remarkGfm]} children={mdText} />
      </div>
    );
  }

  if (conteudo.tipo === "video") {
    return (
      <video src={conteudo.arquivo} controls className="w-full rounded shadow-lg" />
    );
  }

  if (conteudo.tipo === "youtube") {
    return (
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded shadow-lg">
        <iframe
          src={conteudo.arquivo}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Vídeo YouTube"
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    );
  }

  return <p>Tipo não suportado</p>;
};

export default ContentViewer;
