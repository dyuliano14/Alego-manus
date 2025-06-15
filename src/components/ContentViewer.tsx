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
        .then(setMdText)
        .catch((error) => {
          // Adicionar tratamento de erro
          console.error("Erro ao carregar arquivo Markdown:", error);
          setMdText("Erro ao carregar o conteúdo Markdown.");
        });
    }
  }, [conteudo]);

  if (!conteudo || !conteudo.tipo || !conteudo.arquivo) {
    // Adicionar verificação de conteúdo
    return <p>Conteúdo inválido ou não selecionado.</p>;
  }

  if (conteudo.tipo === "pdf") {
    return (
      <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        {" "}
        {/* Adicionado altura e fundo */}
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer fileUrl={conteudo.arquivo} />
        </Worker>
      </div>
    );
  } else if (conteudo.tipo === "markdown") {
    return (
      <div className="prose max-w-none dark:prose-invert p-4">
        {" "}
        {/* Adicionado padding */}
        <ReactMarkdown>{mdText}</ReactMarkdown>
      </div>
    );
  } else if (conteudo.tipo === "video") {
    return (
      <div className="flex justify-center items-center bg-black rounded-lg overflow-hidden">
        <video
          src={conteudo.arquivo}
          controls
          className="max-w-full h-auto max-h-[600px]"
        />{" "}
        {/* Ajustado para altura máxima */}
      </div>
    );
  } else {
    return (
      <p className="text-red-500">
        Tipo de conteúdo não suportado: {conteudo.tipo}
      </p>
    );
  }
};

export default ContentViewer;
