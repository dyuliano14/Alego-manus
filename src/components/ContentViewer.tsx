// src/components/ContentViewer.tsx
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface Conteudo {
  tipo: string;
  arquivo: string;
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
        .then(setMdText);
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
    return <video src={conteudo.arquivo} controls className="max-w-full" />;
  } else {
    return <p>Tipo não suportado</p>;
  }
};

export default ContentViewer;
