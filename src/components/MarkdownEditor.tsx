// src/components/MarkdownEditor.tsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const MarkdownEditor: React.FC = () => {
  // ... seu estado e handlers
  const [selectedResumo] = useState<Resumo | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const handleSave = () => {
    console.log("Resumo salvo!");
    alert("Resumo salvo com sucesso! 🚀 (Lógica real será implementada)");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            className="section-title"
            style={{ margin: 0, border: "none", padding: 0 }}
          >
            {" "}
            📝Resumos
          </h1>
          <p style={{ color: "var(--text-secondary)", margin: "0.5rem 0 0 0" }}>
            Crie e organize seus resumos de forma simples e clara
          </p>
        </div>
      </div>

      <div className="simple-grid simple-grid-2 gap-6">
        <div className="simple-card">
          <CardHeader>
            <CardTitle>
              {selectedResumo ? selectedResumo.titulo : "Novo Resumo"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!previewMode ? (
              <textarea
                className="simple-input w-full min-h-[400px]"
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
              />
            ) : (
              <div className="prose p-4 bg-card rounded border overflow-auto max-h-[600px]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {editorContent}
                </ReactMarkdown>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <Button
                className="simple-btn"
                onClick={() => setPreviewMode((p) => !p)}
              >
                {previewMode ? "Editar" : "Visualizar"}
              </Button>
              <Button variant="outline" onClick={handleSave}>
                Salvar
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
};
export default MarkdownEditor;
