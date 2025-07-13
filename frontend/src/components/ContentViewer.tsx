// src/components/ContentViewer.tsx
import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { usePdfText } from "@/hooks/usePDFText";

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
        </div>
      </Worker>
    );
  }

  return <p>Tipo não suportado</p>;
};

export default ContentViewer;
