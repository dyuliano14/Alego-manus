import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// Definindo interfaces para tipagem
interface PDF {
  id: number;
  titulo: string;
  descricao: string;
  arquivo: string;
  tipo: string; // Adicionado o campo 'tipo'
}

const PDFViewer: React.FC = () => {
  const [selectedPDF, setSelectedPDF] = useState<PDF | null>(null);
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    if (selectedPDF && selectedPDF.tipo === 'markdown') {
      fetch(selectedPDF.arquivo)
        .then(res => res.text())
        .then(text => setMarkdownContent(text))
        .catch(err => console.error("Erro ao carregar o arquivo Markdown:", err));
    }
  }, [selectedPDF]);

  // Dados de exemplo para os PDFs disponíveis
  const pdfs: PDF[] = [
    { id: 1, titulo: 'Resolução nº 1.073', descricao: 'Regulamento Administrativo da ALEGO', arquivo: '/pdfs/RESOLUÇÃONº1.073.pdf', tipo: 'pdf' },
    { id: 2, titulo: 'Resolução nº 1.007', descricao: 'Estrutura Administrativa da ALEGO', arquivo: '/pdfs/Resoluçãonº1.007.pdf', tipo: 'pdf' },
    { id: 3, titulo: 'Resolução nº 1.218', descricao: 'Regimento Interno da ALEGO', arquivo: '/pdfs/RegimentoInternoAlego-RESOLUÇÃON°1.218.pdf', tipo: 'pdf' },
    { id: 4, titulo: 'Resolução nº 1.771', descricao: 'Secretaria de Polícia Legislativa', arquivo: '/pdfs/Resolução1771-SecretariadePolíciaLegislativa.pdf', tipo: 'pdf' },
    { id: 5, titulo: 'Exemplo Markdown', descricao: 'Arquivo Markdown de exemplo', arquivo: '/md/exemplo.md', tipo: 'markdown' }, // Adicionado um arquivo Markdown de exemplo
  ];

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Implementação do upload de novos PDFs
    console.log('Upload de novo PDF', event.target.files?.[0]);
    // Aqui seria implementada a lógica de upload real
    alert('Funcionalidade de upload será implementada na versão final');
  };

  const handlePDFSelect = (pdf: PDF) => {
    setSelectedPDF(pdf);
    // Em uma implementação real, aqui carregaríamos o PDF no visualizador
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Biblioteca de PDFs</h1>
        <div>
          <Button onClick={() => {
            const uploadElement = document.getElementById('pdf-upload');
            if (uploadElement) {
              uploadElement.click();
            }
          }}>
            Adicionar Novo PDF
          </Button>
          <input 
            id="pdf-upload" 
            type="file" 
            accept=".pdf,.md" 
            className="hidden" 
            onChange={handleUpload}
          />
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
                    Total de Documentos
                  </h3>
                  <p className="text-3xl font-bold">{pdfs.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Resoluções
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">4</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Materiais
                  </h3>
                  <p className="text-3xl font-bold text-green-600">1</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Último Acesso
                  </h3>
                  <p className="text-3xl font-bold">Hoje</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lista de documentos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Biblioteca de Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="todos">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="resolucoes">Resoluções</TabsTrigger>
                  <TabsTrigger value="materiais">Materiais</TabsTrigger>
                  <TabsTrigger value="provas">Provas</TabsTrigger>
                </TabsList>

                <TabsContent value="todos" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pdfs.map((pdf) => (
                      <Card 
                        key={pdf.id} 
                        className={`cursor-pointer hover:shadow-md transition-all ${
                          selectedPDF?.id === pdf.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => handlePDFSelect(pdf)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm">{pdf.titulo}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              pdf.tipo === 'pdf' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {pdf.tipo.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{pdf.descricao}</p>
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm">Visualizar</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="resolucoes" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pdfs.filter(pdf => pdf.titulo.includes('Resolução')).map((pdf) => (
                      <Card 
                        key={pdf.id} 
                        className={`cursor-pointer hover:shadow-md transition-all ${
                          selectedPDF?.id === pdf.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => handlePDFSelect(pdf)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm">{pdf.titulo}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                              PDF
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{pdf.descricao}</p>
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm">Visualizar</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="materiais" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pdfs.filter(pdf => pdf.tipo === 'markdown').map((pdf) => (
                      <Card 
                        key={pdf.id} 
                        className={`cursor-pointer hover:shadow-md transition-all ${
                          selectedPDF?.id === pdf.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => handlePDFSelect(pdf)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm">{pdf.titulo}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                              MD
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{pdf.descricao}</p>
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm">Visualizar</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {pdfs.filter(pdf => pdf.tipo === 'markdown').length === 0 && (
                    <p className="text-center py-8 text-muted-foreground">
                      Nenhum material adicional disponível no momento.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="provas" className="mt-4">
                  <p className="text-center py-8 text-muted-foreground">
                    Nenhuma prova anterior disponível no momento.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Painel lateral com filtros e ações */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Buscar documentos..." />
              
              <Select defaultValue="todos">
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de arquivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="pdf">Apenas PDFs</SelectItem>
                  <SelectItem value="markdown">Apenas Markdown</SelectItem>
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
                  <SelectItem value="tipo">Por Tipo</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedPDF && (
            <Card>
              <CardHeader>
                <CardTitle>Documento Selecionado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-1">{selectedPDF.titulo}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{selectedPDF.descricao}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedPDF.tipo === 'pdf' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedPDF.tipo.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Baixar Arquivo
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Criar Resumo
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Adicionar aos Favoritos
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  const uploadElement = document.getElementById('pdf-upload');
                  if (uploadElement) {
                    uploadElement.click();
                  }
                }}
              >
                Adicionar Novo PDF
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Organizar Biblioteca
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Ver Estatísticas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedPDF && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Visualizador de PDF</CardTitle>
          </CardHeader>
          <CardContent>
             {selectedPDF.tipo === 'markdown' ? (
                <div className="prose prose-slate max-w-none p-4 rounded-md border h-[500px] overflow-auto">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                  >
                    {markdownContent}
                  </ReactMarkdown>
                </div>
              ) : (
            <div className="bg-muted p-4 rounded-md text-center h-[500px] flex items-center justify-center">
              <div>
                <p className="mb-4">Visualizador de PDF será implementado na versão final</p>
                <p className="font-semibold">{selectedPDF.titulo}</p>
                <p className="text-muted-foreground">{selectedPDF.descricao}</p>
                <Button className="mt-4">Baixar PDF</Button>
              </div>
            </div>
               )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PDFViewer;