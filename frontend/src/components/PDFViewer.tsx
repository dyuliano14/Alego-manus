// src/components/PDFViewer.tsx
import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configurar worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfFile, setPdfFile] = useState<string>("/sample.pdf");
  const [scale, setScale] = useState<number>(1.0);

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

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

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

      {/* Layout adaptativo baseado na seleção */}
      {!selected ? (
        /* Lista de documentos - layout de grid quando nenhum está selecionado */
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documentosFiltrados.map((doc) => (
            <Card
              key={doc.id}
              onClick={() => setSelected(doc)}
              className="cursor-pointer bg-purple-50 hover:shadow-md transition hover:scale-105"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-purple-800 text-sm">
                  {doc.tipo === "pdf" ? "📄" : "📝"} {doc.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-purple-600">{doc.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : (
        /* Layout otimizado quando documento está selecionado */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar compacta com lista de documentos */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-800">Documentos</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelected(null)}
                className="text-purple-600 hover:bg-purple-100"
              >
                Ver Todos
              </Button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {documentosFiltrados.map((doc) => (
                <Card
                  key={doc.id}
                  onClick={() => setSelected(doc)}
                  className={`cursor-pointer transition-all duration-200 ${
                    selected?.id === doc.id 
                      ? 'ring-2 ring-purple-500 bg-purple-100 shadow-md' 
                      : 'bg-purple-50 hover:bg-purple-100 hover:shadow-sm'
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {doc.tipo === "pdf" ? "📄" : "📝"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-purple-800 text-sm truncate">
                          {doc.titulo}
                        </p>
                        <p className="text-xs text-purple-600 truncate">
                          {doc.descricao}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </aside>

          {/* Visualizador principal - ocupa 3 colunas */}
          <main className="lg:col-span-3 bg-white border rounded-lg shadow-lg">
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-purple-800">
                  📖 {selected.titulo}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected(null)}
                  className="text-purple-600 hover:bg-purple-200 h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>
              <p className="text-sm text-purple-600 mt-1">{selected.descricao}</p>
            </div>
            
            <div className="p-0">
              {selected.tipo === "pdf" ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <div className="h-[80vh] overflow-hidden rounded-b-lg">
                    <Viewer fileUrl={selected.arquivo} />
                  </div>
                </Worker>
              ) : (
                <div className="prose prose-slate max-w-none p-6 overflow-auto h-[80vh] bg-white rounded-b-lg">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdownContent}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
      {/* Mensagem quando nenhum documento está selecionado */}
      {!selected && (
        <div className="text-center py-12 text-purple-600">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-lg">Selecione um documento acima para visualizar</p>
        </div>
      )}

      {/* Visualizador de PDF - Novo componente */}
      <div className="w-full max-w-full">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Visualizador de PDF</h2>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                Diminuir
              </button>
              <span className="px-3 py-1 bg-gray-50 rounded text-sm">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale(Math.min(2.0, scale + 0.1))}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                Aumentar
              </button>
            </div>
          </div>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPdfFile(URL.createObjectURL(file));
                setPageNumber(1);
              }
            }}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
        </div>

        {/* Container do PDF - Responsivo */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="flex flex-col lg:flex-row">
            {/* Área do PDF - Ocupa mais espaço em telas grandes */}
            <div className="flex-1 lg:w-3/4">
              <div className="p-4 border-b">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                      disabled={pageNumber <= 1}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded text-sm transition-colors"
                    >
                      ← Anterior
                    </button>
                    <span className="text-sm text-gray-600">
                      Página {pageNumber} de {numPages}
                    </span>
                    <button
                      onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                      disabled={pageNumber >= numPages}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded text-sm transition-colors"
                    >
                      Próxima →
                    </button>
                  </div>
                </div>
              </div>

              {/* Visualizador do PDF */}
              <div className="p-4 bg-gray-50 min-h-[600px] flex justify-center overflow-auto">
                <Document
                  file={pdfFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex items-center justify-center h-96">
                      <div className="text-gray-500">Carregando PDF...</div>
                    </div>
                  }
                  error={
                    <div className="flex items-center justify-center h-96">
                      <div className="text-red-500">Erro ao carregar PDF</div>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    className="shadow-lg"
                  />
                </Document>
              </div>
            </div>

            {/* Sidebar - Menor em telas grandes, oculta em mobile */}
            <div className="lg:w-1/4 border-l border-gray-200 hidden lg:block">
              <div className="p-4">
                <h3 className="font-medium text-gray-800 mb-3">Navegação Rápida</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Total de páginas: {numPages}
                  </div>
                  <div className="text-sm text-gray-600">
                    Página atual: {pageNumber}
                  </div>
                  
                  {/* Lista de páginas */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Ir para página:</h4>
                    <div className="grid grid-cols-5 gap-1 max-h-48 overflow-y-auto">
                      {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setPageNumber(page)}
                          className={`text-xs p-1 rounded transition-colors ${
                            page === pageNumber
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controles mobile (visível apenas em telas pequenas) */}
          <div className="block lg:hidden border-t p-4">
            <div className="flex justify-center gap-4">
              <input
                type="number"
                min={1}
                max={numPages}
                value={pageNumber}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= numPages) {
                    setPageNumber(page);
                  }
                }}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                placeholder="Página"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
