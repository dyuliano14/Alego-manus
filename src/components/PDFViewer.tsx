import React, { useState, useEffect } from "react";

// Imports do React PDF Viewer
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Imports dos estilos (essencial)
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Imports para Markdown
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Interface para o tipo de documento
interface DocumentItem {
  id: number;
  titulo: string;
  descricao: string;
  arquivo: string;
  tipo: "pdf" | "markdown";
}

const PDFViewer: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [markdownContent, setMarkdownContent] = useState("");

  // Cria a instância do plugin de layout
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Lista de documentos
  const documentos: DocumentItem[] = [
    {
      id: 1,
      titulo: "Resolução nº 1.073",
      descricao: "Regulamento Administrativo",
      arquivo: "/pdfs/resolucao_1073.pdf",
      tipo: "pdf",
    },
    {
      id: 2,
      titulo: "Resolução nº 1.007",
      descricao: "Estrutura Administrativa",
      arquivo: "/pdfs/resolucao_1007.pdf",
      tipo: "pdf",
    },
    {
      id: 3,
      titulo: "Exemplo MD",
      descricao: "Material Extra",
      arquivo: "/md/exemplo.md",
      tipo: "markdown",
    },
  ];

  // Efeito para carregar o conteúdo do arquivo Markdown
  useEffect(() => {
    if (selectedDoc?.tipo === "markdown") {
      fetch(selectedDoc.arquivo)
        .then((res) => res.text())
        .then(setMarkdownContent)
        .catch(console.error);
    }
  }, [selectedDoc]);

  return (
    <div className="simple-grid" style={{ gap: "2rem" }}>
      {/* Cabeçalho e Botão */}
      <div className="simple-card">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="section-title">📚 Biblioteca de Documentos</h1>
            <p className="text-muted-foreground text-sm">
              Clique em um item para visualizar o conteúdo.
            </p>
          </div>
          <button variant="outline" className="simple-btn">
            Adicionar Documento
          </button>
        </div>
      </div>

      {/* Lista de Arquivos */}
      <div className="simple-card">
        <h2 className="text-lg font-semibold mb-4">Meus Arquivos</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {documentos.map((doc) => (
            <div
              key={doc.id}
              className={`p-4 border rounded cursor-pointer transition-all ${
                selectedDoc?.id === doc.id
                  ? "border-blue-500 bg-blue-50"
                  : "hover:shadow"
              }`}
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{doc.titulo}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    doc.tipo === "pdf"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {doc.tipo.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {doc.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Visualizador (PDF ou Markdown) */}
      {selectedDoc && (
        <div className="simple-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Visualizando: {selectedDoc.titulo}
            </h2>
            <button
              variant="outline"
              className="simple-btn-outline"
              onClick={() => window.open(selectedDoc.arquivo, "_blank")}
            >
              Baixar
            </button>
          </div>

          {selectedDoc.tipo === "pdf" ? (
            <div className="h-[750px] border rounded overflow-hidden">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={selectedDoc.arquivo}
                  plugins={[defaultLayoutPluginInstance]} // Adiciona os controles
                />
              </Worker>
            </div>
          ) : (
            <div className="prose max-w-none border p-4 rounded bg-white dark:bg-gray-900 dark:text-white overflow-auto h-[750px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdownContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
