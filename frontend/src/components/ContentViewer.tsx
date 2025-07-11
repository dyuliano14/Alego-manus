  // src/components/ContentViewer.tsx
  import React, { useEffect, useState } from "react";
  import ReactMarkdown from "react-markdown";
  import remarkGfm from "remark-gfm";
  import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
  import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
  import "@react-pdf-viewer/core/lib/styles/index.css";
  import "@react-pdf-viewer/default-layout/lib/styles/index.css";

  import PDFNotes from "./PDFNotes";
  import { usePdfText } from "../hooks/usePdfText";


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
    const textoExtraido = usePdfText(conteudo.arquivo);
    const pdfPlugin = defaultLayoutPlugin();

    // Carrega conteúdo markdown
    useEffect(() => {
      if (conteudo.tipo === "markdown") {
        fetch(conteudo.arquivo)
          .then((r) => r.text())
          .then(setMdText)
          .catch((err) => {
            console.error("Erro ao carregar markdown:", err);
            setMdText(`# Erro\n\nNão foi possível carregar o conteúdo.`);
          });
      }
    }, [conteudo]);

    // 🧠 Lógica para PDF
    if (conteudo.tipo === "pdf") {
      return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div className="flex flex-col md:flex-row h-[600px] border rounded overflow-hidden relative">

            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              <Viewer
                fileUrl={conteudo.arquivo}
                plugins={[pdfPlugin]}
                defaultScale={SpecialZoomLevel.PageFit}
              />
            </div>

            {/* Anotações */}
            <div className="w-full md:w-[300px] bg-white border-l p-2 overflow-y-auto">
              <PDFNotes conteudoId={conteudo.id} />
            </div>

            {/* Leitura em voz alta (fixado) */}
            <div className="absolute bottom-2 left-2 bg-gray-200 px-3 py-1 text-sm rounded shadow">
              <button
                className="text-blue-700 hover:underline"
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(textoExtraido);
                  utterance.lang = "pt-BR";
                  window.speechSynthesis.speak(utterance);
                }}
              >
                🔊 Ler em voz alta
              </button>
            </div>
          </div>
        </Worker>
      );
    }

    // Markdown
    if (conteudo.tipo === "markdown") {
      return (
        <div className="prose max-w-none dark:prose-invert overflow-auto h-[600px] p-4 bg-white rounded shadow">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{mdText}</ReactMarkdown>
        </div>
      );
    }

    // Vídeo local
    if (conteudo.tipo === "video") {
      return (
        <video
          src={conteudo.arquivo}
          controls
          className="w-full max-w-full rounded shadow"
        />
      );
    }

    // Youtube
    if (conteudo.tipo === "youtube") {
      return (
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded shadow-lg">
          <iframe
            src={conteudo.arquivo}
            title="Vídeo YouTube"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      );
    }

    // Não suportado
    return <p>Tipo de conteúdo não suportado.</p>;
  };

  export default ContentViewer;
