// src/components/PDFViewer.tsx
import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PDFViewer: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const documentos = [
    /* sua lista */
  ];

  return (
    <div className="simple-grid simple-grid-2 gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Documentos</h2>
        <div className="space-y-4">
          {documentos.map((doc) => (
            <Card
              key={doc.id}
              className="hover:shadow-lg cursor-pointer"
              onClick={() => setSelectedDoc(doc)}
            >
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{doc.titulo}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.descricao}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full ${doc.tipo === "pdf" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                >
                  {doc.tipo.toUpperCase()}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        {selectedDoc && (
          <Card>
            <CardHeader>
              <CardTitle>Visualização: {selectedDoc.titulo}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDoc.tipo === "pdf" ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <div className="border rounded max-h-[600px] overflow-auto">
                    <Viewer fileUrl={selectedDoc.arquivo} />
                  </div>
                </Worker>
              ) : (
                <div className="prose p-4 border rounded max-h-[600px] overflow-auto">
                  {/* Markdown fallback */}
                </div>
              )}
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedDoc.arquivo, "_blank")}
                >
                  Baixar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
