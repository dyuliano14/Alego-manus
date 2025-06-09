import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Worker, Viewer } from "@react‑pdf‑viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css"; // se usar default layout plugin
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

// Interface PDF/MD
interface DocumentItem {
  id: number;
  titulo: string;
  descricao: string;
  arquivo: string;
  tipo: "pdf" | "markdown";
}

const DocumentLibrary: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [markdownContent, setMarkdownContent] = useState("");

  // Load Markdown
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
      titulo: "Resolução nº 1.073",
      descricao: "Regulamento Administrativo",
      arquivo: "/pdfs/resolucao_1073.pdf",
      tipo: "pdf",
    },
    {
      id: 2,
      titulo: "Resolução nº 1.007",
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
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Biblioteca de Documentos</h1>
          <Button
            onClick={() => document.getElementById("doc-upload")?.click()}
          >
            Adicionar Novo
          </Button>
          <input
            id="doc-upload"
            type="file"
            accept=".pdf,.md"
            className="hidden"
          />
        </div>

        <Tabs defaultValue="todos">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="pdf">PDFs</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
          </TabsList>

          <TabsContent value="todos">
            <div className="grid md:grid-cols-2 gap-4">
              {documentos.map((doc) => (
                <Card
                  key={doc.id}
                  className="hover:shadow-lg cursor-pointer"
                  onClick={() => setSelectedDoc(doc)}
                >
                  <CardHeader>
                    <CardTitle>{doc.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>{doc.descricao}</CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pdf">
            <div className="grid md:grid-cols-2 gap-4">
              {documentos
                .filter((d) => d.tipo === "pdf")
                .map((doc) => (
                  <Card
                    key={doc.id}
                    className="hover:shadow-lg cursor-pointer"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <CardHeader>
                      <CardTitle>{doc.titulo}</CardTitle>
                    </CardHeader>
                    <CardContent>{doc.descricao}</CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="markdown">
            <div className="grid md:grid-cols-2 gap-4">
              {documentos
                .filter((d) => d.tipo === "markdown")
                .map((doc) => (
                  <Card
                    key={doc.id}
                    className="hover:shadow-lg cursor-pointer"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <CardHeader>
                      <CardTitle>{doc.titulo}</CardTitle>
                    </CardHeader>
                    <CardContent>{doc.descricao}</CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {selectedDoc && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Visualização: {selectedDoc.titulo}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDoc.tipo === "pdf" ? (
                <div className="border rounded h-[600px]">
                  <Viewer fileUrl={selectedDoc.arquivo} />
                </div>
              ) : (
                <div className="prose max-w-none border rounded p-4 h-[600px] overflow-auto">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdownContent}
                  </ReactMarkdown>
                </div>
              )}
            </CardContent>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(selectedDoc.arquivo, "_blank")}
              >
                Baixar
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Worker>
  );
};

export default DocumentLibrary;
