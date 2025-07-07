// src/components/ContentViewer.tsx
import React, { useEffect, useState } from "react";
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

interface Props {
  conteudo: Conteudo;
}

export const ContentViewer: React.FC<Props> = ({ conteudo }) => {
  const [mdText, setMdText] = useState("");

  // Carrega o conteúdo Markdown se necessário
  useEffect(() => {
    if (conteudo.tipo === "markdown") {
      fetch(conteudo.arquivo)
        .then((r) => r.text())
        .then(setMdText)
        .catch((err) => {
          console.error("Erro ao carregar markdown:", err);
          setMdText(
            `# Erro\n\nNão foi possível carregar o conteúdo: ${err.message}`
          );
        });
    }
  }, [conteudo]);

  // ▶️ PDF
  
  if (conteudo.tipo === "pdf") {
    return (
     <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="flex flex-col md:flex-row h-[600px] border rounded overflow-hidden">
          <div className="flex-1 overflow-auto">
            <Viewer fileUrl={conteudo.arquivo} />
          </div>
          <div className="w-full md:w-[300px] p-2 bg-gray-50">
            <PDFNotes conteudoId={conteudo.id} />
          </div>
        </div>
      </Worker>
    );
  }

  // ✍️ Markdown
  if (conteudo.tipo === "markdown") {
    return (
      <div className="prose max-w-none dark:prose-invert overflow-auto h-[600px] p-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {mdText}
        </ReactMarkdown>
      </div>
    );
  }


  // 📼 Vídeo local
  if (conteudo.tipo === "video") {
    return (
      <video
        src={conteudo.arquivo}
        controls
        className="max-w-full rounded shadow-lg"
      />
    );
  }

  // ▶️ YouTube embed
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

  // ❌ Tipo não suportado
  return <p>Tipo não suportado</p>;
};

export default ContentViewer;
