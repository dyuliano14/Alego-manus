import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

// Definindo interfaces para tipagem
interface Resumo {
  id: number;
  titulo: string;
  resolucao: string;
  ultimaEdicao: string;
}

const MarkdownEditor: React.FC = () => {
  const [selectedResumo, setSelectedResumo] = useState<Resumo | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Dados de exemplo para os resumos disponíveis
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
    // Em uma implementação real, aqui carregaríamos o conteúdo do resumo
    setEditorContent(
      `# ${resumo.titulo}\n\n## Resumo da ${resumo.resolucao}\n\nConteúdo do resumo será carregado na versão final.`,
    );
  };

  const handleCreateNew = () => {
    setSelectedResumo(null);
    setEditorContent(
      "# Novo Resumo\n\n## Tópico\n\nInsira o conteúdo do seu resumo aqui...",
    );
  };

  const handleSave = () => {
    // Implementação do salvamento de resumos
    console.log("Salvando resumo", editorContent);
    // Aqui seria implementada a lógica de salvamento real
    alert("Resumo salvo com sucesso!");
  };

  const handleExport = () => {
    // Implementação da exportação para PDF
    console.log("Exportando resumo para PDF");
    // Aqui seria implementada a lógica de exportação real
    alert("Funcionalidade de exportação será implementada na versão final");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Resumos em Markdown</h1>
        <div className="space-x-2">
          <Button onClick={handleCreateNew}>Novo Resumo</Button>
          {selectedResumo && (
            <>
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? "Modo Edição" : "Modo Visualização"}
              </Button>
              <Button variant="outline" onClick={handleExport}>
                Exportar PDF
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cards de estatísticas */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Total de Resumos
                  </h3>
                  <p className="text-3xl font-bold">{resumos.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Palavras Escritas
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">2.5k</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Resoluções Cobertas
                  </h3>
                  <p className="text-3xl font-bold text-green-600">4</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Última Edição
                  </h3>
                  <p className="text-3xl font-bold">Hoje</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lista de resumos */}
        <div className="lg:col-span-2">
          {selectedResumo || editorContent ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {selectedResumo
                    ? `Editando: ${selectedResumo.titulo}`
                    : "Novo Resumo"}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    {previewMode ? "Editar" : "Preview"}
                  </Button>
                  {selectedResumo && (
                    <Button variant="outline" size="sm" onClick={handleExport}>
                      Exportar PDF
                    </Button>
                  )}
                  <Button size="sm" onClick={handleSave}>
                    Salvar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {previewMode ? (
                  <div className="prose prose-slate max-w-none p-4 bg-card rounded-md border h-[600px] overflow-auto">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {editorContent}
  </ReactMarkdown>

                    <div className="prose">
                      <ReactMarkdown>{editorContent}</ReactMarkdown>
                    </div>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className="markdown-content"
                    >
                      {editorContent}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <Textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className="min-h-[600px] font-mono text-sm"
                    placeholder="Digite seu resumo em formato Markdown..."
                  />
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Meus Resumos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input placeholder="Buscar resumos..." />
                    <Select defaultValue="todos">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filtrar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="1073">Res. 1.073</SelectItem>
                        <SelectItem value="1007">Res. 1.007</SelectItem>
                        <SelectItem value="1218">Res. 1.218</SelectItem>
                        <SelectItem value="1771">Res. 1.771</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resumos.map((resumo) => (
                      <Card
                        key={resumo.id}
                        className={`cursor-pointer hover:shadow-md transition-all ${
                          selectedResumo?.id === resumo.id
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() => handleResumoSelect(resumo)}
                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1">
                            {resumo.titulo}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {resumo.resolucao}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Editado em: {resumo.ultimaEdicao}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">
                        Começar a Escrever
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Selecione um resumo existente ou crie um novo
                      </p>
                      <Button onClick={handleCreateNew}>
                        Criar Novo Resumo
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Painel lateral com ferramentas e informações */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas do Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <h4 className="font-medium mb-2">Formatação Rápida</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>**negrito** ou __negrito__</div>
                  <div>*itálico* ou _itálico_</div>
                  <div># Título 1</div>
                  <div>## Título 2</div>
                  <div>- Lista</div>
                  <div>1. Lista numerada</div>
                  <div>[link](url)</div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <h4 className="font-medium mb-2 text-sm">Estatísticas</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Caracteres:</span>
                    <span className="font-medium">{editorContent.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Palavras:</span>
                    <span className="font-medium">
                      {
                        editorContent
                          .split(" ")
                          .filter((word) => word.length > 0).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Linhas:</span>
                    <span className="font-medium">
                      {editorContent.split("\n").length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Select defaultValue="todos">
                  <SelectTrigger>
                    <SelectValue placeholder="Por Resolução" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as Resoluções</SelectItem>
                    <SelectItem value="1073">Resolução 1.073</SelectItem>
                    <SelectItem value="1007">Resolução 1.007</SelectItem>
                    <SelectItem value="1218">Resolução 1.218</SelectItem>
                    <SelectItem value="1771">Resolução 1.771</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="recente">
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recente">Mais Recente</SelectItem>
                    <SelectItem value="antigo">Mais Antigo</SelectItem>
                    <SelectItem value="alfabetico">A-Z</SelectItem>
                    <SelectItem value="tamanho">Tamanho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
