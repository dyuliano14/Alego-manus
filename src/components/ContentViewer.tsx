import React, { useEffect, useState } from "react";
import Modal from "./ui/Modal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import '@react-pdf-viewer/core/lib/styles/index.css';

interface ContentViewerProps {
  type: "pdf" | "markdown" | "video";
  fileUrl: string;
  onClose: () => void;
  title?: string;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ type, fileUrl, onClose, title }) => {
  const [markdownContent, setMarkdownContent] = useState<string>("");

  useEffect(() => {
    if (type === "markdown") {
      fetch(fileUrl)
        .then(res => res.text())
        .then(setMarkdownContent)
        .catch(() => setMarkdownContent("Erro ao carregar conteúdo."));
    }
  }, [fileUrl, type]);

  return (
    <Modal title={title || ""} onClose={onClose}>
      <div className="h-[600px] overflow-auto rounded bg-background">
        {type === "pdf" && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={fileUrl} />
          </Worker>
        )}
        {type === "markdown" && (
          <div className="prose prose-slate dark:prose-invert p-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownContent}
            </ReactMarkdown>
          </div>
        )}
        {type === "video" && (
          <div className="flex justify-center">
            <video controls className="max-w-full max-h-[600px]">
              <source src={fileUrl} />
              Seu navegador não suporta vídeo.
            </video>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ContentViewer;