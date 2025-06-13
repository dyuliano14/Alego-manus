// src/components/MarkdownEditor.tsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const MarkdownEditor: React.FC = () => {
  // ... seu estado e handlers
  const [selectedResumo] = useState<Resumo | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <div className="simple-grid simple-grid-2 gap-6">
      <Card>
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
            <Button onClick={() => setPreviewMode((p) => !p)}>
              {previewMode ? "Editar" : "Visualizar"}
            </Button>
            <Button variant="outline" onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default MarkdownEditor;
