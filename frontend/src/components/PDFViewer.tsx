// src/components/PDFViewer.tsx
import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Button } from "./ui/button";

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
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (selected?.tipo === "markdown") {
      fetch(selected.arquivo)
        .then((res) => res.text())
        .then(setMarkdownContent)
        .catch(() => setMarkdownContent("Erro ao carregar markdown."));
    }
  }, [selected]);

  const documentosFiltrados = documentos.filter(
    (doc) =>
      (filter === "todos" || doc.tipo === filter) &&
      doc.titulo.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-purple-700">
          📄 Biblioteca de Documentos
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="🔍 Buscar documentos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="sm:w-60"
          />
          <Select value={filter} onValueChange={(val) => setFilter(val as any)}>
            <SelectTrigger className="bg-purple-100 text-purple-800">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">📚 Todos</SelectItem>
              <SelectItem value="pdf">📄 PDFs</SelectItem>
              <SelectItem value="markdown">📝 Markdown</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documentosFiltrados.map((doc) => (
          <Card
            key={doc.id}
            onClick={() => setSelected(doc)}
            className="cursor-pointer bg-purple-50 hover:shadow-md transition"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800 text-lg">
                {doc.tipo === "pdf" ? "📄" : "📝"} {doc.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-purple-600">
              {doc.descricao}
            </CardContent>
          </Card>
        ))}
      </section>

      {selected && (
        <section className="mt-6 bg-white border rounded shadow">
          <CardHeader className="bg-purple-100">
            <CardTitle className="text-purple-700">
              Visualizando: {selected.titulo}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {selected.tipo === "pdf" ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <div className="h-[600px] overflow-hidden">
                  <Viewer fileUrl={selected.arquivo} />
                </div>
              </Worker>
            ) : (
              <div className="prose prose-slate max-w-none p-6 overflow-auto h-[600px] bg-white">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownContent}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </section>
      )}
    </div>
  );
};

export default PDFViewer;
