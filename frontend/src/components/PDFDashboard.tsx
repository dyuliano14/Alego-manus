import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { uploadFiles, listUploads } from "../services/uploadService";
import SimplePDFViewer from "./SimplePDFViewer";

interface PDFFile {
  id: number;
  filename: string;
  url: string;
  uploadDate: string;
  size?: number;
  processed?: boolean;
}

interface PDFConversion {
  type: 'text' | 'markdown' | 'flashcards' | 'summary';
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: string;
}

const PDFDashboard = () => {
  const [uploadedPDFs, setUploadedPDFs] = useState<PDFFile[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<PDFFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [conversions, setConversions] = useState<Record<number, PDFConversion[]>>({});
  const [currentView, setCurrentView] = useState<'library' | 'viewer' | 'converter'>('library');
  const [dragOver, setDragOver] = useState(false);

  // Carregar PDFs salvos
  useEffect(() => {
    loadPDFs();
  }, []);

  const loadPDFs = async () => {
    try {
      const data = await listUploads('pdf');
      setUploadedPDFs(data.files || []);
    } catch (error) {
      console.error('Erro ao carregar PDFs:', error);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
      
      if (pdfFiles.length === 0) {
        alert('Por favor, selecione apenas arquivos PDF');
        return;
      }

      const urls = await uploadFiles(pdfFiles);
      
      // Criar objetos PDF para o estado local
      const newPDFs: PDFFile[] = pdfFiles.map((file, index) => ({
        id: Date.now() + index,
        filename: file.name,
        url: urls[index],
        uploadDate: new Date().toISOString(),
        size: file.size,
        processed: false
      }));

      setUploadedPDFs(prev => [...prev, ...newPDFs]);
      
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload dos arquivos');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const startConversion = async (pdf: PDFFile, type: PDFConversion['type']) => {
    const newConversion: PDFConversion = {
      type,
      status: 'processing'
    };

    setConversions(prev => ({
      ...prev,
      [pdf.id]: [...(prev[pdf.id] || []), newConversion]
    }));

    try {
      // Simular conversão (aqui você implementaria a lógica real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = generateMockResult(type);
      
      setConversions(prev => ({
        ...prev,
        [pdf.id]: prev[pdf.id].map(conv => 
          conv.type === type && conv.status === 'processing'
            ? { ...conv, status: 'completed', result }
            : conv
        )
      }));

    } catch (error) {
      setConversions(prev => ({
        ...prev,
        [pdf.id]: prev[pdf.id].map(conv => 
          conv.type === type && conv.status === 'processing'
            ? { ...conv, status: 'error' }
            : conv
        )
      }));
    }
  };

  const generateMockResult = (type: PDFConversion['type']): string => {
    switch (type) {
      case 'text':
        return 'Texto extraído do PDF...';
      case 'markdown':
        return '# Conteúdo em Markdown\n\nTexto convertido...';
      case 'flashcards':
        return JSON.stringify([
          { front: 'Pergunta 1', back: 'Resposta 1' },
          { front: 'Pergunta 2', back: 'Resposta 2' }
        ]);
      case 'summary':
        return 'Resumo do documento: principais pontos...';
      default:
        return '';
    }
  };

  const renderLibraryView = () => (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload de PDFs</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {isUploading ? (
              <div className="space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600">Fazendo upload...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Arraste PDFs aqui ou clique para selecionar
                  </p>
                  <p className="text-gray-500">Formatos suportados: PDF</p>
                </div>
                <Input
                  type="file"
                  multiple
                  accept=".pdf"
                  className="hidden"
                  id="pdf-upload"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                />
                <Button 
                  onClick={() => document.getElementById('pdf-upload')?.click()}
                  className="mt-2"
                >
                  Selecionar Arquivos
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PDF Library */}
      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de PDFs ({uploadedPDFs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {uploadedPDFs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhum PDF enviado ainda. Faça upload para começar!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedPDFs.map((pdf) => (
                <div key={pdf.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm truncate flex-1">{pdf.filename}</h4>
                    <Badge variant={pdf.processed ? "default" : "secondary"}>
                      {pdf.processed ? "Processado" : "Novo"}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-3">
                    {new Date(pdf.uploadDate).toLocaleDateString('pt-BR')}
                    {pdf.size && ` • ${(pdf.size / 1024 / 1024).toFixed(1)} MB`}
                  </p>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedPDF(pdf);
                        setCurrentView('viewer');
                      }}
                    >
                      📄 Visualizar
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedPDF(pdf);
                        setCurrentView('converter');
                      }}
                    >
                      🔄 Converter
                    </Button>
                  </div>

                  {/* Conversões existentes */}
                  {conversions[pdf.id] && conversions[pdf.id].length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs font-medium text-gray-700 mb-2">Conversões:</p>
                      <div className="flex flex-wrap gap-1">
                        {conversions[pdf.id].map((conv, idx) => (
                          <Badge 
                            key={idx} 
                            variant={conv.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {conv.type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderViewerView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setCurrentView('library')}>
          ← Voltar à Biblioteca
        </Button>
        <h3 className="font-medium">{selectedPDF?.filename}</h3>
      </div>
      
      {selectedPDF && (
        <div className="border rounded-lg overflow-hidden">
          <SimplePDFViewer url={selectedPDF.url} />
        </div>
      )}
    </div>
  );

  const renderConverterView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setCurrentView('library')}>
          ← Voltar à Biblioteca
        </Button>
        <h3 className="font-medium">Converter: {selectedPDF?.filename}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Opções de Conversão */}
        <Card>
          <CardHeader>
            <CardTitle>Opções de Conversão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { type: 'text' as const, label: 'Extrair Texto', icon: '📝', desc: 'Extrai texto puro do PDF' },
              { type: 'markdown' as const, label: 'Para Markdown', icon: '📋', desc: 'Converte para formato Markdown' },
              { type: 'flashcards' as const, label: 'Gerar Flashcards', icon: '🎴', desc: 'Cria flashcards automaticamente' },
              { type: 'summary' as const, label: 'Resumo', icon: '📊', desc: 'Gera resumo do conteúdo' }
            ].map((option) => (
              <Button
                key={option.type}
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => selectedPDF && startConversion(selectedPDF, option.type)}
                disabled={conversions[selectedPDF?.id || 0]?.some(c => c.type === option.type && c.status === 'processing')}
              >
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">{option.desc}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedPDF || !conversions[selectedPDF.id] || conversions[selectedPDF.id].length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Selecione uma opção de conversão para ver os resultados
              </p>
            ) : (
              <div className="space-y-4">
                {conversions[selectedPDF.id].map((conv, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{conv.type}</Badge>
                      <Badge variant={
                        conv.status === 'completed' ? 'default' :
                        conv.status === 'processing' ? 'secondary' :
                        conv.status === 'error' ? 'destructive' : 'outline'
                      }>
                        {conv.status === 'processing' && '⏳ '}
                        {conv.status === 'completed' && '✅ '}
                        {conv.status === 'error' && '❌ '}
                        {conv.status}
                      </Badge>
                    </div>
                    
                    {conv.status === 'completed' && conv.result && (
                      <div className="bg-gray-50 rounded p-3 mt-2">
                        <pre className="text-xs whitespace-pre-wrap overflow-x-auto">
                          {conv.result.substring(0, 200)}
                          {conv.result.length > 200 && '...'}
                        </pre>
                        {conv.result.length > 200 && (
                          <Button size="sm" variant="ghost" className="mt-2 p-0 h-auto">
                            Ver completo
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciador de PDFs</h2>
        <div className="flex gap-2">
          <Button 
            variant={currentView === 'library' ? 'default' : 'outline'}
            onClick={() => setCurrentView('library')}
          >
            📚 Biblioteca
          </Button>
          {selectedPDF && (
            <>
              <Button 
                variant={currentView === 'viewer' ? 'default' : 'outline'}
                onClick={() => setCurrentView('viewer')}
              >
                👀 Visualizar
              </Button>
              <Button 
                variant={currentView === 'converter' ? 'default' : 'outline'}
                onClick={() => setCurrentView('converter')}
              >
                🔄 Converter
              </Button>
            </>
          )}
        </div>
      </div>

      {currentView === 'library' && renderLibraryView()}
      {currentView === 'viewer' && renderViewerView()}
      {currentView === 'converter' && renderConverterView()}
    </div>
  );
};

export default PDFDashboard;
