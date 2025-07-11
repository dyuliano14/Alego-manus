import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import PDFNotes from "./PDFNotes";
import { Button } from "./ui/button";
import { extrairTextoDoPDF } from "../hooks/usePDFText";


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

  // Leitura em voz alta
  const handleSpeak = async () => {
    let texto = "";

    if (conteudo.tipo === "markdown") {
      texto = mdText;
    } else if (conteudo.tipo === "pdf") {
      try {
        texto = await extrairTextoDoPDF(conteudo.arquivo);
      } catch (error) {
        console.error("Erro ao extrair texto do PDF:", error);
        texto = "Não foi possível extrair o texto deste PDF.";
      }
    }

    if (texto) {
      const utterance = new SpeechSynthesisUtterance(texto);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };


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
  }, [conteudo]);

  if (conteudo.tipo === "pdf") {
    return (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="relative flex flex-col md:flex-row h-[600px] border rounded overflow-hidden">
          <div className="flex-1 overflow-auto">
            <Viewer fileUrl={conteudo.arquivo} />
          </div>
          <div className="w-full md:w-[320px] p-2 bg-gray-50 border-l">
            <PDFNotes conteudoId={conteudo.id} />
          </div>
          <Button
            onClick={handleSpeak}
            className="absolute bottom-3 left-3 text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded z-20"
          >
            🔊 Ler
          </Button>
        </div>
      </Worker>
    );
  }

  if (conteudo.tipo === "markdown") {
    return (
      <div className="relative prose max-w-none dark:prose-invert overflow-auto h-[600px] p-4 border rounded bg-white">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{mdText}</ReactMarkdown>
        <Button
          onClick={handleSpeak}
          className="absolute bottom-3 left-3 text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded z-10"
        >
          🔊 Ler
        </Button>
      </div>
    );
  }

  if (conteudo.tipo === "video") {
    return (
      <div className="rounded overflow-hidden border">
        <video
          src={conteudo.arquivo}
          controls
          className="w-full max-h-[600px] object-contain"
        />
      </div>
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

  return <p>Tipo de conteúdo não suportado.</p>;
};

export default ContentViewer;
