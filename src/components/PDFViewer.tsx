import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface DocItem {
  id: number;
  titulo: string;
  descricao: string;
  arquivo: string;
  tipo: "pdf" | "markdown";
}

const PDFViewer: React.FC = () => {
  const [selected, setSelected] = useState<DocItem | null>(null);
  const [mdContent, setMdContent] = useState("");

  const documentos: DocItem[] = [
    {
      id: 1,
      titulo: "Resolução nº 1.073",
      descricao: "Regulamento Administrativo da ALEGO",
      arquivo: "/pdfs/resolucao_1073.pdf",
      tipo: "pdf",
    },
    {
      id: 2,
      titulo: "Exemplo Markdown",
      descricao: "Material adicional em Markdown",
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
