import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Worker, Viewer, SpecialZoomLevel, Button } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { extrairTextoDoPDF } from "../hooks/usePDFText";
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
  const [mdText, setMdText] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [isMdReading, setIsMdReading] = useState(false);

  const pdfPlugin = defaultLayoutPlugin();

  useEffect(() => {
    if (conteudo.tipo === "markdown") {
      fetch(conteudo.arquivo)
        .then((r) => r.text())
        .then(setMdText)
        .catch((err) => {
          console.error("Erro ao carregar markdown:", err);
          setMdText(`# Erro\n\nNão foi possível carregar o conteúdo: ${err.message}`);
        });
    }

    if (conteudo.tipo === "pdf") {
      extrairTextoDoPDF(conteudo.arquivo).then(setPdfText);
    }
  }, [conteudo]);

  const iniciarLeitura = () => {
    if (!pdfText) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(pdfText);
    utterance.lang = "pt-BR";
    utterance.onend = () => setIsReading(false);

    setIsReading(true);
    synth.speak(utterance);
  };

  const pararLeitura = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
  };

  const handleSpeak = () => {
        const synth = window.speechSynthesis;
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(mdText);
        utterance.lang = "pt-BR";
        utterance.onend = () => setIsMdReading(false);

        setIsMdReading(true);
        synth.speak(utterance);
  };

  const handleStopSpeak = () => {
      window.speechSynthesis.cancel();
      setIsMdReading(false);
  }

  if (conteudo.tipo === "pdf") {
    return (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="relative border rounded overflow-hidden h-[600px] bg-white shadow">
          <Viewer
            fileUrl={conteudo.arquivo}
            plugins={[pdfPlugin]}
            defaultScale={SpecialZoomLevel.PageFit}
          />
          <div className="absolute bottom-4 left-4 z-20">
            <button
              onClick={isReading ? pararLeitura : iniciarLeitura}
              className="px-3 py-1 rounded bg-blue-600 text-white shadow hover:bg-blue-700 text-sm"
            >
              {isReading ? "🔇 Parar Leitura" : "🔊 Ler em voz alta"}
            </button>
          </div>
          <div className="absolute top-0 right-0 h-full">
            <PDFNotes conteudoId={conteudo.id} />
          </div>
        </div>
      </Worker>
    );
  }

  if (conteudo.tipo === "markdown") {
    return (
      <div className="prose max-w-none dark:prose-invert overflow-auto h-[600px] p-4 bg-white rounded shadow">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {mdText}
        </ReactMarkdown>
        <button
          onClick={isMdReading ? handleStopSpeak : handleSpeak}
          className="absolute bottom-3 left-3 text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded z-10"
        >
          {isMdReading ? "🔇 Parar Leitura" : "🔊 Ler em voz alta"}
        </button>
      </div>
    );
  }

  if (conteudo.tipo === "video") {
    return (
      <video
        src={conteudo.arquivo}
        controls
        className="max-w-full rounded shadow-lg"
      />
    );
  }

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

  return <p>❌ Tipo de conteúdo não suportado</p>;
};

export default ContentViewer;