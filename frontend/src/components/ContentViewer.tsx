import React, { useState, useRef } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { usePdfText } from "@/hooks/usePDFText";

interface Props { conteudo: { tipo: string; arquivo: string; titulo: string; }; }

const ContentViewer: React.FC<Props> = ({ conteudo }) => {
  const [full, setFull] = useState(false);
  const viewerContainer = useRef<HTMLDivElement>(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const pdfText = usePdfText(conteudo.arquivo);

  const handleFullscreen = () => {
    const el = viewerContainer.current;
    if (!el) return;
    if (!full) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setFull(!full);
  };

  const handleReadAloud = () => {
    if (!pdfText) return;
    const utter = new SpeechSynthesisUtterance(pdfText);
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  return (
    <div className="relative border rounded overflow-hidden" ref={viewerContainer}>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3/build/pdf.worker.min.js`}>
        <Viewer fileUrl={conteudo.arquivo} plugins={[defaultLayoutPluginInstance]} />
      </Worker>

      <div className="flex space-x-2 p-2 bg-gray-50 border-t">
        <button onClick={handleReadAloud} className="px-3 py-1 bg-blue-500 text-white rounded">
          🔊 Ler em voz alta
        </button>
        <button onClick={handleFullscreen} className="px-3 py-1 bg-gray-700 text-white rounded">
          {full ? "↙️ Sair da tela cheia" : "⛶ Tela cheia"}
        </button>
      </div>
    </div>
  );
};

export default ContentViewer;
