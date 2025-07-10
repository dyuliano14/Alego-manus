import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import PDFNotes from "./PDFNotes";

interface Conteudo {
  id: number;
  tipo: string;
  arquivo: string;
}

const ContentViewer: React.FC<{ conteudo: Conteudo }> = ({ conteudo }) => {
  const [mdText, setMdText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const lerTexto = async (url: string) => {
    const r = await fetch(url);
    const blob = await r.blob();
    const reader = new FileReader();
    reader.onload = () => {
      const utterance = new SpeechSynthesisUtterance(reader.result as string);
      speechSynthesis.speak(utterance);
    };
    reader.readAsText(blob);
  };

  const fullscreen = () => {
    const el = containerRef.current;
    if (el?.requestFullscreen) el.requestFullscreen();
  };

  useEffect(() => {
    if (conteudo.tipo === "markdown") {
      fetch(conteudo.arquivo)
        .then((r) => r.text())
        .then(setMdText)
        .catch(() => setMdText("Erro ao carregar markdown"));
    }
  }, [conteudo]);

  if (conteudo.tipo === "pdf") {
    return (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div ref={containerRef} className="flex flex-col md:flex-row rounded-lg overflow-hidden border bg-white">
          <div className="flex-1 overflow-auto min-h-[400px]">
            <Viewer fileUrl={conteudo.arquivo} />
          </div>
          <div className="md:w-[280px] p-2 border-l bg-gray-50 hidden md:block">
            <PDFNotes conteudoId={conteudo.id} />
          </div>
        </div>

        <div className="mt-2 flex justify-between md:justify-start gap-2">
          <button onClick={() => lerTexto(conteudo.arquivo)} className="btn-secondary">
            🔊 Ler em voz alta
          </button>
          <button onClick={fullscreen} className="btn-secondary">
            🖥️ Tela cheia
          </button>
        </div>
      </Worker>
    );
  }

  if (conteudo.tipo === "markdown") {
    return (
      <div className="prose dark:prose-invert max-w-none bg-white p-4 rounded-lg shadow">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{mdText}</ReactMarkdown>
      </div>
    );
  }

  if (conteudo.tipo === "video") {
    return (
      <video controls src={conteudo.arquivo} className="w-full rounded-lg shadow" />
    );
  }

  return <p>Tipo de conteúdo não suportado</p>;
};

export default ContentViewer;
