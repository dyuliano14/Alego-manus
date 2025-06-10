import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Resumo {
  id: number;
  titulo: string;
  resolucao: string;
  ultimaEdicao: string;
}

const MarkdownEditor: React.FC = () => {
  const [selectedResumo, setSelectedResumo] = useState<Resumo | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  const resumos: Resumo[] = [
    {
      id: 1,
      titulo: "Organização Administrativa",
      resolucao: "Resolução nº 1.073",
      ultimaEdicao: "02/06/2025",
    },
    {
      id: 2,
      titulo: "Regimento Interno",
      resolucao: "Resolução nº 1.218",
      ultimaEdicao: "02/06/2025",
    },
    {
      id: 3,
      titulo: "Secretaria de Polícia Legislativa",
      resolucao: "Resolução nº 1.771",
      ultimaEdicao: "02/06/2025",
    },
    {
      id: 4,
      titulo: "Estrutura Administrativa",
      resolucao: "Resolução nº 1.007",
      ultimaEdicao: "02/06/2025",
    },
  ];

  const handleResumoSelect = (resumo: Resumo) => {
    setSelectedResumo(resumo);
    setEditorContent(
      `# ${resumo.titulo}\n\n## ${resumo.resolucao}\n\nConteúdo do resumo...`,
    );
  };

  const handleCreateNew = () => {
    setSelectedResumo(null);
    setEditorContent("# Novo Resumo\n\n## Título\n\nInicie seu resumo aqui...");
  };

  return (
    <div className="simple-grid" style={{ gap: "2rem" }}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="section-title">Editor de Resumos</h1>{" "}
          {/* Adicionei a classe section-title */}
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCreateNew}>
              Novo
            </Button>
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? "Editar" : "Visualizar"}
            </Button>
          </div>
        </div>
      </div>
      <div className="simple-card">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-4 col-span-1">
            <Input placeholder="Buscar..." />
            <Select defaultValue="todos">
              <SelectTrigger>
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {resumos.map((r) => (
                  <SelectItem key={r.id} value={r.id.toString()}>
                    {r.resolucao}{" "}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            {resumos.map((r) => (
              <Card
                key={r.id}
                className={`p-3 cursor-pointer ${selectedResumo?.id === r.id ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => handleResumoSelect(r)}
              >
                <CardTitle className="text-sm">{r.titulo}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {r.ultimaEdicao}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedResumo
                  ? `Resumo: ${selectedResumo.titulo}`
                  : "Novo Resumo"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {previewMode ? (
                <div className="prose max-w-none border rounded-md p-4 bg-white dark:bg-gray-900 overflow-auto h-[500px]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {editorContent}
                  </ReactMarkdown>
                </div>
              ) : (
                <Textarea
                  className="w-full h-[500px]"
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
