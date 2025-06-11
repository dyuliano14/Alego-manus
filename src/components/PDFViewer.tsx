// src/components/PDFViewer.tsx
import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Documento {
  id: number;
  titulo: string;
  descricao: string;
  arquivo: string;
  tipo: "pdf" | "markdown";
}

const documentos: Documento[] = [
  { id: 1, titulo: "Resolução 1073", descricao: "Organização Administrativa", arquivo: "/pdfs/resolucao_1073.pdf", tipo: "pdf" },
  { id: 2, titulo: "Resolução 1007", descricao: "Estrutura Administrativa", arquivo: "/pdfs/resolucao_1007.pdf", tipo: "pdf" },
  { id: 3, titulo: "Exemplo Markdown", descricao: "Material complementar", arquivo: "/md/exemplo.md", tipo: "markdown" },
];

const PDFViewer: React.FC = () => {
  const [selected, setSelected] = useState<Documento | null>(null);
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    if (selected?.tipo === "markdown") {
      fetch(selected.arquivo)
        .then((res) => res.text())
        .then(setMarkdownContent)
        .catch(() => setMarkdownContent("Erro ao carregar markdown."));
    }
  }, [selected]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Biblioteca de Documentos</h1>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pdf">PDF</TabsTrigger>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <div className="grid md:grid-cols-2 gap-4">
            {documentos.map((doc) => (
              <Card key={doc.id} onClick={() => setSelected(doc)} className="cursor-pointer hover:shadow-md">
                <CardHeader>
                  <CardTitle>{doc.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{doc.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pdf">
          <div className="grid md:grid-cols-2 gap-4">
            {documentos.filter((d) => d.tipo === "pdf").map((doc) => (
              <Card key={doc.id} onClick={() => setSelected(doc)} className="cursor-pointer hover:shadow-md">
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
            {documentos.filter((d) => d.tipo === "markdown").map((doc) => (
              <Card key={doc.id} onClick={() => setSelected(doc)} className="cursor-pointer hover:shadow-md">
                <CardHeader>
                  <CardTitle>{doc.titulo}</CardTitle>
                </CardHeader>
                <CardContent>{doc.descricao}</CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selected && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Visualizando: {selected.titulo}</CardTitle>
          </CardHeader>
          <CardContent>
            {selected.tipo === "pdf" ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <div className="border rounded h-[600px] overflow-hidden">
                  <Viewer fileUrl={selected.arquivo} />
                </div>
              </Worker>
            ) : (
              <div className="prose prose-slate max-w-none p-4 border rounded overflow-auto h-[600px]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownContent}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PDFViewer;      descricao: "Exemplo de conteúdo markdown",
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
