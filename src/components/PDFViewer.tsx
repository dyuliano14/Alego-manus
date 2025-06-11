import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface PDF {
  id: number;
  titulo: string;
  descricao: string;
  arquivo: string;
  tipo: "pdf" | "markdown";
}

const PDFViewer: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<PDF | null>(null);
  const [markdownContent, setMarkdownContent] = useState("");

  const documentos: PDF[] = [
    {
      id: 1,
      titulo: "Resolução nº 1.073",
      descricao: "Regulamento Administrativo da ALEGO",
      arquivo: "/pdfs/resolucao_1073.pdf",
      tipo: "pdf",
    },
    {
      id: 2,
      titulo: "Resolução nº 1.218",
      descricao: "Regimento Interno",
      arquivo: "/pdfs/resolucao_1218.pdf",
      tipo: "pdf",
    },
    {
      id: 3,
      titulo: "Resumo Markdown de Exemplo",
      descricao: "Exemplo de conteúdo markdown",
      arquivo: "/resumos/exemplo.md",
      tipo: "markdown",
    },
  ];

  useEffect(() => {
    if (selectedDoc?.tipo === "markdown") {
      fetch(selectedDoc.arquivo)
        .then((res) => res.text())
        .then(setMarkdownContent)
        .catch((err) =>
          console.error("Erro ao carregar markdown:", err)
        );
    }
  }, [selectedDoc]);

  return (
    <div className="simple-grid" style={{ gridTemplateColumns: "1fr 2fr", gap: "1.5rem" }}>
      <div className="simple-card">
        <h2>Biblioteca de Documentos</h2>
        <div className="mt-4 flex flex-col gap-3">
          {documentos.map((doc) => (
            <button
              key={doc.id}
              className={`text-left px-4 py-3 rounded border ${
                selectedDoc?.id === doc.id ? "border-blue-600 bg-blue-50" : "border-gray-300"
              } hover:bg-gray-100 transition`}
              onClick={() => setSelectedDoc(doc)}
            >
              <h3 className="font-semibold text-sm">{doc.titulo}</h3>
              <p className="text-xs text-muted-foreground">{doc.descricao}</p>
              <span
                className={`text-xs inline-block mt-1 px-2 py-0.5 rounded-full ${
                  doc.tipo === "pdf" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                }`}
              >
                {doc.tipo.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="simple-card">
        {selectedDoc ? (
          <>
            <h2 className="mb-4">{selectedDoc.titulo}</h2>
            {selectedDoc.tipo === "pdf" ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <div className="border rounded overflow-hidden h-[600px]">
                  <Viewer fileUrl={selectedDoc.arquivo} />
                </div>
              </Worker>
            ) : (
              <div className="prose max-w-none border rounded p-4 h-[600px] overflow-auto bg-muted">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownContent}
                </ReactMarkdown>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            Selecione um documento para visualizar
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
