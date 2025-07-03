// src/components/ContentViewer.tsx
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import PDFNotes from "./PDFNotes"; // novo import
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import remarkGfm from "remark-gfm"; // Para tabelas, checklists etc.

interface Conteudo {
  id: number;
  tipo: string;
  arquivo: string; // URL ou caminho do arquivo
}

interface Props {
  conteudo: Conteudo;
}

const ContentViewer: React.FC<Props> = ({ conteudo }) => {
  const [mdText, setMdText] = useState("");

  // Carrega conteúdo Markdown
  useEffect(() => {
    if (conteudo.tipo === "markdown") {
      fetch(conteudo.arquivo)
        .then((r) => r.text())
        .then(setMdText)
        .catch((error) => {
          console.error("Erro ao carregar markdown:", error);
          setMdText("Erro ao carregar conteúdo: " + error.message);
        });
        console.log("Conteúdo recebido:", conteudo);

    }
  }, [conteudo]);

    // Markdown Viewer
  if (conteudo.tipo === "markdown") {
    return (
      <div className="prose max-w-none dark:prose-invert overflow-auto h-[600px] p-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {mdText}
        </ReactMarkdown>
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
        ></iframe>
      </div>
    );
  }

 if (conteudo.tipo === "pdf") {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div className="flex flex-col md:flex-row h-[600px] border rounded-md overflow-hidden">
        <div className="flex-1">
          <Viewer fileUrl={conteudo.arquivo} />
        </div>
        <div className="md:w-[300px] border-t md:border-t-0 md:border-l">
          <PDFNotes conteudoId={conteudo.id} />
        </div>
      </div>
    </Worker>
  );
}

  // Tipo não suportado
  return (
    <div className="text-red-500 font-semibold mt-4">
      Tipo de conteúdo não suportado.
    </div>
  );
};


export default ContentViewer;
