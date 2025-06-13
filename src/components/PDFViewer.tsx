// src/components/PDFViewer.tsx
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";


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
    arquivo: "/pdf/resolucao_1073.pdf",
    tipo: "pdf",
  },
  {
    id: 2,
    titulo: "Resolução 1007",
    descricao: "Estrutura Administrativa",
    arquivo: "/pdf/resolucao_1007.pdf",
    tipo: "pdf",
  },
  {
    id: 3,
    titulo: "Plano de Estudos Markdown",
    descricao: "Material complementar",
    arquivo: "/estudos_alego/plano_de_estudos.md",
    tipo: "markdown",
  },
];

const PDFViewer: React.FC = () => {
  const [selected, setSelected] = useState<Documento | null>(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [filter, setFilter] = useState<"todos" | "pdf" | "markdown">("todos");

  const documentosFiltrados = documentos.filter((doc) =>
    filter === "todos" ? true : doc.tipo === filter,
  );

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

      <div className="flex justify-between items-center gap-4">
        <Input placeholder="Buscar..." />
        <Select value={filter} onValueChange={(val) => setFilter(val as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent onClose={() => {}}>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="markdown">Markdown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {documentosFiltrados.map((doc) => (
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
