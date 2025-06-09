import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  useEffect(() => {
    if (selectedDoc?.tipo === "markdown") {
      fetch(selectedDoc.arquivo)
        .then((res) => res.text())
        .then(setMarkdownContent)
        .catch(console.error);
    }
  }, [selectedDoc]);

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

  return (
    <div className="simple-grid" style={{ gap: "2rem" }}>
      <div className="simple-card">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="section-title">📚 Biblioteca de Documentos</h1>
            <p className="text-muted-foreground text-sm">
              Clique em um item para visualizar o conteúdo.
            </p>
          </div>
          <button className="simple-btn">Adicionar Documento</button>
        </div>
      </div>

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

      {selectedDoc && (
        <div className="simple-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Visualizando: {selectedDoc.titulo}
            </h2>
            <button
              className="simple-btn-outline"
              onClick={() => window.open(selectedDoc.arquivo, "_blank")}
            >
              Baixar
            </button>
          </div>

          {selectedDoc.tipo === "pdf" ? (
            <div className="h-[600px] border rounded overflow-hidden">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={selectedDoc.arquivo} />
              </Worker>
            </div>
          ) : (
            <div className="prose max-w-none border p-4 rounded bg-white dark:bg-gray-900 dark:text-white overflow-auto h-[600px]">
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

export default PDFViewer;      descricao: "Material adicional em Markdown",
      arquivo: "/md/exemplo.md",
      tipo: "markdown",
    },
  ];

  useEffect(() => {
    if (selected?.tipo === "markdown") {
      fetch(selected.arquivo)
        .then((res) => res.text())
        .then(setMdContent)
        .catch(console.error);
    }
  }, [selected]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Biblioteca de Documentos</h1>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pdf">PDF</TabsTrigger>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent
          value="todos"
          className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {documentos.map((doc) => (
            <Card
              key={doc.id}
              className="cursor-pointer hover:shadow"
              onClick={() => setSelected(doc)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{doc.titulo}</CardTitle>
              </CardHeader>
              <CardContent>{doc.descricao}</CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent
          value="pdf"
          className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {documentos
            .filter((d) => d.tipo === "pdf")
            .map((doc) => (
              <Card key={doc.id} onClick={() => setSelected(doc)}>
                <CardHeader>
                  <CardTitle>{doc.titulo}</CardTitle>
                </CardHeader>
                <CardContent>{doc.descricao}</CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent
          value="markdown"
          className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {documentos
            .filter((d) => d.tipo === "markdown")
            .map((doc) => (
              <Card key={doc.id} onClick={() => setSelected(doc)}>
                <CardHeader>
                  <CardTitle>{doc.titulo}</CardTitle>
                </CardHeader>
                <CardContent>{doc.descricao}</CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {selected && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Visualizando: {selected.titulo}</CardTitle>
          </CardHeader>
          <CardContent>
            {selected.tipo === "pdf" ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <div className="h-[600px] border rounded">
                  <Viewer fileUrl={selected.arquivo} />
                </div>
              </Worker>
            ) : (
              <div className="prose max-w-none border rounded-md p-4 h-[600px] overflow-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {mdContent}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PDFViewer;
