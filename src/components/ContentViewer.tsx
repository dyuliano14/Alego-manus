// src/components/ContentViewer.tsx
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface Conteudo {
  tipo: string;
  arquivo: string; // Este campo vai conter a URL, seja local, ou de YouTube/Vimeo
}

interface Props {
  conteudo: Conteudo;
}

const ContentViewer: React.FC<Props> = ({ conteudo }) => {
  const [mdText, setMdText] = useState("");

  useEffect(() => {
    if (conteudo.tipo === "markdown") {
      fetch(conteudo.arquivo)
        .then((r) => r.text())
        .then(setMdText)
        .catch((error) => {
          console.error("Erro ao carregar arquivo Markdown:", error);
          setMdText("Erro ao carregar o conteúdo Markdown: " + error.message);
        });
    }
  }, [conteudo]);

  if (conteudo.tipo === "pdf") {
    return (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={conteudo.arquivo} />
      </Worker>
    );
  } else if (conteudo.tipo === "markdown") {
    return (
      <div className="prose max-w-none dark:prose-invert">
        <ReactMarkdown>{mdText}</ReactMarkdown>
      </div>
    );
  } else if (conteudo.tipo === "video") {
    // Para vídeos locais (MP4, etc.)
    return (
      <video src={conteudo.arquivo} controls className="max-w-full h-auto" />
    );
  } else if (conteudo.tipo === "youtube") {
    // NOVO: Adicionar iframe para YouTube
    // É CRÍTICO que o 'arquivo' aqui seja a URL de EMBED do YouTube (e.g., https://www.youtube.com/embed/VIDEO_ID)
    return (
      <div className="relative" style={{ paddingBottom: "56.25%", height: 0 }}>
        {" "}
        {/* Proporção 16:9 */}
        <iframe
          src={conteudo.arquivo}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      </div>
    );
  } else {
    return <p>Tipo de conteúdo não suportado.</p>;
  }
};

export default ContentViewer;
