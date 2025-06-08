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

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="resolucoes">Resoluções</TabsTrigger>
          <TabsTrigger value="materiais">Materiais de Estudo</TabsTrigger>
          <TabsTrigger value="provas">Provas Anteriores</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pdfs.map((pdf) => (
              <Card 
                key={pdf.id} 
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handlePDFSelect(pdf)}
              >
                <CardHeader className="pb-2">
                  <CardTitle>{pdf.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{pdf.descricao}</p>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">Visualizar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resolucoes" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pdfs.map((pdf) => (
              <Card 
                key={pdf.id} 
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handlePDFSelect(pdf)}
              >
                <CardHeader className="pb-2">
                  <CardTitle>{pdf.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{pdf.descricao}</p>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">Visualizar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="materiais" className="mt-4">
          <p className="text-center py-8 text-muted-foreground">Nenhum material adicional disponível no momento.</p>
        </TabsContent>

        <TabsContent value="provas" className="mt-4">
          <p className="text-center py-8 text-muted-foreground">Nenhuma prova anterior disponível no momento.</p>
        </TabsContent>
      </Tabs>

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