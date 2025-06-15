// src/components/ContentViewer.tsx
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Worker, Viewer } from "@react-pdf-viewer/core";

interface Conteudo {
  id: number;
  titulo: string;
  tipo: "pdf" | "markdown" | "video";
  arquivo: string;
}

interface Props {
  conteudo: Conteudo;
  onClose: () => void;
}

const ContentViewer: React.FC<Props> = ({ conteudo, onClose }) => {
  return (
    <Card className="mt-6">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{conteudo.titulo}</CardTitle>
        <button onClick={onClose} className="text-xl">
          &times;
        </button>
      </CardHeader>
      <CardContent>
        {conteudo.tipo === "pdf" && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div className="border rounded h-[500px] overflow-auto">
              <Viewer fileUrl={conteudo.arquivo} />
            </div>
          </Worker>
        )}
        {conteudo.tipo === "markdown" && (
          <div className="prose max-w-none p-4 border rounded overflow-auto h-[500px]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {/* fetch dentro useEffect caso seja remoto */}
              {`Carregue o conteúdo aqui...`}
            </ReactMarkdown>
          </div>
        )}
        {conteudo.tipo === "video" && (
          <div className="h-[500px] flex justify-center items-center">
            <video src={conteudo.arquivo} controls className="max-h-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentViewer;
