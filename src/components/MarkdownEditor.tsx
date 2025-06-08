import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

// Definindo interfaces para tipagem
interface Resumo {
  id: number;
  titulo: string;
  resolucao: string;
  ultimaEdicao: string;
}

const MarkdownEditor: React.FC = () => {
  const [selectedResumo, setSelectedResumo] = useState<Resumo | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  
  // Dados de exemplo para os resumos disponíveis
  const resumos: Resumo[] = [
    { 
      id: 1, 
      titulo: 'Organização Administrativa', 
      resolucao: 'Resolução nº 1.073',
      ultimaEdicao: '02/06/2025'
    },
    { 
      id: 2, 
      titulo: 'Regimento Interno', 
      resolucao: 'Resolução nº 1.218',
      ultimaEdicao: '02/06/2025'
    },
    { 
      id: 3, 
      titulo: 'Secretaria de Polícia Legislativa', 
      resolucao: 'Resolução nº 1.771',
      ultimaEdicao: '02/06/2025'
    },
    { 
      id: 4, 
      titulo: 'Estrutura Administrativa', 
      resolucao: 'Resolução nº 1.007',
      ultimaEdicao: '02/06/2025'
    },
  ];

  const handleResumoSelect = (resumo: Resumo) => {
    setSelectedResumo(resumo);
    // Em uma implementação real, aqui carregaríamos o conteúdo do resumo
    setEditorContent(`# ${resumo.titulo}\n\n## Resumo da ${resumo.resolucao}\n\nConteúdo do resumo será carregado na versão final.`);
  };

  const handleCreateNew = () => {
    setSelectedResumo(null);
    setEditorContent('# Novo Resumo\n\n## Tópico\n\nInsira o conteúdo do seu resumo aqui...');
  };

  const handleSave = () => {
    // Implementação do salvamento de resumos
    console.log('Salvando resumo', editorContent);
    // Aqui seria implementada a lógica de salvamento real
    alert('Resumo salvo com sucesso!');
  };

  const handleExport = () => {
    // Implementação da exportação para PDF
    console.log('Exportando resumo para PDF');
    // Aqui seria implementada a lógica de exportação real
    alert('Funcionalidade de exportação será implementada na versão final');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Resumos em Markdown</h1>
        <div className="space-x-2">
          <Button onClick={handleCreateNew}>Novo Resumo</Button>
          {selectedResumo && (
            <>
              <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                {previewMode ? 'Modo Edição' : 'Modo Visualização'}
              </Button>
              <Button variant="outline" onClick={handleExport}>Exportar PDF</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meus Resumos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input placeholder="Buscar resumos..." />
                  <Select defaultValue="todos">
                    <SelectTrigger className="w-[120px]">
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
                
                <div className="space-y-2 mt-4">
                  {resumos.map((resumo) => (
                    <div 
                      key={resumo.id} 
                      className={`p-3 rounded-md cursor-pointer hover:bg-accent transition-colors ${selectedResumo?.id === resumo.id ? 'bg-accent' : ''}`}
                      onClick={() => handleResumoSelect(resumo)}
                    >
                      <h3 className="font-medium">{resumo.titulo}</h3>
                      <p className="text-sm text-muted-foreground">{resumo.resolucao}</p>
                      <p className="text-xs text-muted-foreground mt-1">Editado em: {resumo.ultimaEdicao}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {selectedResumo || editorContent ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedResumo ? `Editando: ${selectedResumo.titulo}` : 'Novo Resumo'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {previewMode ? (
                  <div className="prose prose-slate max-w-none p-4 bg-card rounded-md border overflow-auto">
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
                    className="min-h-[500px] font-mono"
                    placeholder="Digite seu resumo em formato Markdown..."
                  />
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-[500px] bg-muted rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-medium">Nenhum resumo selecionado</h3>
                <p className="text-muted-foreground mb-4">Selecione um resumo existente ou crie um novo</p>
                <Button onClick={handleCreateNew}>Criar Novo Resumo</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
