// src/components/MarkdownEditor.tsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const MarkdownEditor: React.FC = () => {
  const [editorContent, setEditorContent] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  const handleSave = () => {
    alert("Resumo salvo com sucesso! 🚀");
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
        <h1 className="section-title" style={{ margin: 0 }}>
          📝 Resumos
        </h1>
        <Button className="simple-btn" onClick={handleSave}>
          Salvar Resumo
        </Button>
      </div>

      <div className="simple-grid" style={{ gap: "1.5rem" }}>
        <Card>
          <CardHeader>
            <CardTitle>
              {previewMode ? "Visualização" : "Editor de Resumo"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {previewMode ? (
              <div className="prose p-4 bg-card rounded border overflow-auto max-h-[600px]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {editorContent}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                className="simple-input w-full min-h-[300px]"
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
              />
            )}
            <div className="mt-4 flex gap-2">
              <Button
                className="simple-btn"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? "Editar" : "Visualizar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarkdownEditor;
