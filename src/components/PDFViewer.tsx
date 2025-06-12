// src/components/PDFViewer.tsx
import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/core/lib/styles/custom.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

interface Documento {
  id: number;
  titulo: string;
  descricao: string;
  arquivo: string;
  tipo: "pdf" | "markdown";
}

const documentos: Documento[] = [
  {
    id: 1,
    titulo: "Resolução 1073",
    descricao: "Organização Administrativa",
    arquivo: "/pdfs/resolucao_1073.pdf",
    tipo: "pdf",
  },
  {
    id: 2,
    titulo: "Resolução 1007",
    descricao: "Estrutura Administrativa",
    arquivo: "/pdfs/resolucao_1007.pdf",
    tipo: "pdf",
  },
  {
    id: 3,
    titulo: "Exemplo Markdown",
    descricao: "Material complementar",
    arquivo: "/md/exemplo.md",
    tipo: "markdown",
  },
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
              <Card
                key={doc.id}
                onClick={() => setSelected(doc)}
                className="cursor-pointer hover:shadow-md"
              >
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
            {documentos
              .filter((d) => d.tipo === "pdf")
              .map((doc) => (
                <Card
                  key={doc.id}
                  onClick={() => setSelected(doc)}
                  className="cursor-pointer hover:shadow-md"
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
                  onClick={() => setSelected(doc)}
                  className="cursor-pointer hover:shadow-md"
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

export default PDFViewer;
