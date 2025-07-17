import * as React from "react";
import { Worker, Viewer, Button } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { dropPlugin } from "@react-pdf-viewer/drop";
// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { usePdfText } from "../hooks/usePDFText";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// Use ?url para garantir compatibilidade com Vite
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";
import MarkdownViewer from "./ui/MarkdownViewer";
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
  const textoExtraido = usePdfText(conteudo.arquivo);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const dropPluginInstance = dropPlugin();

  const handleSpeak = () => {
    if (!textoExtraido) return;
    const utterance = new SpeechSynthesisUtterance(textoExtraido);
    utterance.lang = "pt-BR";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // PDF
  if (conteudo.tipo === "pdf") {
    return (
      <div className="relative flex flex-col lg:flex-row gap-4">
        <Worker workerUrl={workerSrc}>
          <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <button
                className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 touch-manipulation min-h-[44px]"
                onClick={() => window.open(conteudo.arquivo, "_blank", "noopener,noreferrer")}
              >
                🖥️ <span className="hidden sm:inline">Abrir</span>
              </button>
              
              <button
                className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 touch-manipulation min-h-[44px]"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = conteudo.arquivo;
                  link.download = "";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                🔽 <span className="hidden sm:inline">Baixar</span>
              </button>
              
              <button 
                onClick={handleSpeak} 
                className="flex items-center gap-2 px-5 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 touch-manipulation min-h-[44px]"
              >
                🔊 <span className="hidden sm:inline">Ouvir</span>
              </button>
              
              <button 
                onClick={() => window.speechSynthesis.cancel()} 
                className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 touch-manipulation min-h-[44px]"
              >
                🔇 <span className="hidden sm:inline">Parar</span>
              </button>
            </div>
            
            {/* PDF Viewer */}
            <div className="h-[calc(100vh-200px)] min-h-[500px] overflow-auto">
              <Viewer
                fileUrl={conteudo.arquivo}
                plugins={[defaultLayoutPluginInstance, dropPluginInstance]} 
              />
            </div>
          </div>
        </Worker>
        
        {/* PDFNotes como overlay em mobile, sidebar em desktop */}
        <PDFNotes conteudoId={conteudo.id} />
      </div>
    );
    
  }

  if (conteudo.tipo === "markdown") {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <MarkdownViewer markdown={conteudo.arquivo} />
          </div>
        </div>
      </div>
    );
  }

  // Vídeo local
  if (conteudo.tipo === "video") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <video
          src={conteudo.arquivo}
          controls
          className="w-full rounded-lg shadow-md"
          style={{ maxHeight: '70vh' }}
        />
      </div>
    );
  }

  // YouTube embed
  if (conteudo.tipo === "youtube") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-md">
          <iframe
            src={conteudo.arquivo}
            title="Vídeo YouTube"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-lg"
          />
        </div>
      </div>
    );
  }

  // Tipo não suportado
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <div className="text-red-600 text-lg font-medium">
        ⚠️ Tipo de conteúdo não suportado
      </div>
      <p className="text-red-500 mt-2">
        O formato "{conteudo.tipo}" ainda não é suportado pela plataforma.
      </p>
    </div>
  );
};

export default ContentViewer;
