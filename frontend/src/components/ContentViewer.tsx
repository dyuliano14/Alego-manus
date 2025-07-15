<<<<<<< HEAD
import React from "react";
import { Worker, Viewer, Button } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { dropPlugin } from "@react-pdf-viewer/drop";
// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { usePdfText } from "@/hooks/usePDFText";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// Use ?url para garantir compatibilidade com Vite
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";
import MarkdownViewer from "./ui/MarkdownViewer";
import PDFNotes from "./PDFNotes";
=======
// src/components/ContentViewer.tsx
import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { usePdfText } from "@/hooks/usePDFText";
>>>>>>> 70b16420e1e4a7b232ecfdbff5772fd98767a044

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
<<<<<<< HEAD
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
      <><Worker workerUrl={workerSrc}>
        <div className="relative h-[600px] border rounded overflow-hidden bg-white shadow flex flex-col">
          <div className="flex gap-2 p-2 bg-gray-100 border-b">
            <button
              className="simple-btn mt-4 mb-4"
              onClick={() => window.open(conteudo.arquivo, "_blank", "noopener,noreferrer")}
            >
              Abrir em nova aba
            </button>
            <button
              className="simple-btn mt-4 mb-4"
              onClick={() => {
                const link = document.createElement("a");
                link.href = conteudo.arquivo;
                link.download = "";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } }
            >
              Baixar PDF
            </button>
            <button onClick={handleSpeak} className="simple-btn mt-4 mb-4">
              🔊 Ler PDF
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <Viewer
              fileUrl={conteudo.arquivo}
              plugins={[defaultLayoutPluginInstance, dropPluginInstance]} />
          </div>
          {/* Opcional: mostrar o texto extraído */}
          {/* <pre className="mt-4 p-2 bg-gray-100 rounded">{textoExtraido}</pre> */}
=======

  const handleSpeak = () => {
    if (!textoExtraido) return;

    const utterance = new SpeechSynthesisUtterance(textoExtraido);
    utterance.lang = "pt-BR";
    window.speechSynthesis.cancel(); // Para não empilhar falas
    window.speechSynthesis.speak(utterance);
  };

  if (conteudo.tipo === "pdf") {
    return (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@latest/build/pdf.worker.min.js">
        <div className="relative h-[600px] border rounded overflow-hidden bg-white shadow">
          <Viewer fileUrl={conteudo.arquivo} />
          <button
            onClick={handleSpeak}
            className="absolute bottom-4 left-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            🔊 Ler PDF
          </button>
>>>>>>> 70b16420e1e4a7b232ecfdbff5772fd98767a044
        </div>
      </Worker><div className="w-80 border-l">
          <PDFNotes conteudoId={conteudo.id} />
        </div></>
    );
    
  }

<<<<<<< HEAD
  if (conteudo.tipo === "markdown") {
    return (
      <div className="prose max-w-none dark:prose-invert overflow-auto h-[600px] p-4">
        <MarkdownViewer markdown={conteudo.arquivo} />
      </div>
    );
  }

  // Vídeo local
  if (conteudo.tipo === "video") {
    return (
      <video
        src={conteudo.arquivo}
        controls
        className="max-w-full rounded shadow-lg"
        style={{ maxHeight: 600 }}
      />
    );
  }

  // YouTube embed
  if (conteudo.tipo === "youtube") {
    return (
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded shadow-lg">
        <iframe
          src={conteudo.arquivo}
          title="Vídeo YouTube"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    );
  }

  // Tipo não suportado
  return <p className="p-4 text-red-600">Tipo de conteúdo não suportado.</p>;
=======
  return <p>Tipo não suportado</p>;
>>>>>>> 70b16420e1e4a7b232ecfdbff5772fd98767a044
};

export default ContentViewer;
