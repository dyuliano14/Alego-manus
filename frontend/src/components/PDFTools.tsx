import React, { useState, useRef } from 'react';
import { 
  Upload, Download, FileText, Image, FileSpreadsheet, 
  Presentation, Scissors, Merge, RotateCw, Trash2, 
  Archive, ArrowRight, CheckCircle, AlertCircle, 
  Loader2, Settings
} from 'lucide-react';

interface ConversionTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  inputFormats: string[];
  outputFormat: string;
  category: 'convert-from-pdf' | 'convert-to-pdf' | 'pdf-tools';
}

const PDFTools: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; downloadUrl?: string } | null>(null);
  const [selectedTool, setSelectedTool] = useState<ConversionTool | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conversionTools: ConversionTool[] = [
    // Conversões de PDF
    {
      id: 'pdf-to-word',
      name: 'PDF para Word',
      description: 'Converte PDF para documento Word editável (.docx)',
      icon: <FileText className="w-6 h-6" />,
      inputFormats: ['pdf'],
      outputFormat: 'docx',
      category: 'convert-from-pdf'
    },
    {
      id: 'pdf-to-excel',
      name: 'PDF para Excel',
      description: 'Extrai tabelas de PDF para planilha Excel (.xlsx)',
      icon: <FileSpreadsheet className="w-6 h-6" />,
      inputFormats: ['pdf'],
      outputFormat: 'xlsx',
      category: 'convert-from-pdf'
    },
    {
      id: 'pdf-to-powerpoint',
      name: 'PDF para PowerPoint',
      description: 'Converte PDF para apresentação PowerPoint (.pptx)',
      icon: <Presentation className="w-6 h-6" />,
      inputFormats: ['pdf'],
      outputFormat: 'pptx',
      category: 'convert-from-pdf'
    },
    {
      id: 'pdf-to-images',
      name: 'PDF para Imagens',
      description: 'Converte páginas do PDF para imagens (.jpg, .png)',
      icon: <Image className="w-6 h-6" />,
      inputFormats: ['pdf'],
      outputFormat: 'jpg/png',
      category: 'convert-from-pdf'
    },
    {
      id: 'pdf-to-text',
      name: 'PDF para Texto',
      description: 'Extrai todo o texto do PDF (.txt)',
      icon: <FileText className="w-6 h-6" />,
      inputFormats: ['pdf'],
      outputFormat: 'txt',
      category: 'convert-from-pdf'
    },

    // Conversões para PDF
    {
      id: 'word-to-pdf',
      name: 'Word para PDF',
      description: 'Converte documentos Word para PDF',
      icon: <FileText className="w-6 h-6" />,
      inputFormats: ['doc', 'docx'],
      outputFormat: 'pdf',
      category: 'convert-to-pdf'
    },
    {
      id: 'excel-to-pdf',
      name: 'Excel para PDF',
      description: 'Converte planilhas Excel para PDF',
      icon: <FileSpreadsheet className="w-6 h-6" />,
      inputFormats: ['xls', 'xlsx'],
      outputFormat: 'pdf',
      category: 'convert-to-pdf'
    },
    {
      id: 'powerpoint-to-pdf',
      name: 'PowerPoint para PDF',
      description: 'Converte apresentações para PDF',
      icon: <Presentation className="w-6 h-6" />,
      inputFormats: ['ppt', 'pptx'],
      outputFormat: 'pdf',
      category: 'convert-to-pdf'
    },
    {
      id: 'images-to-pdf',
      name: 'Imagens para PDF',
      description: 'Combina múltiplas imagens em um PDF',
      icon: <Image className="w-6 h-6" />,
      inputFormats: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
      outputFormat: 'pdf',
      category: 'convert-to-pdf'
    },

    // Ferramentas de PDF
    {
      id: 'compress-pdf',
      name: 'Comprimir PDF',
      description: 'Reduz o tamanho do arquivo PDF',
      icon: <Archive className="w-6 h-6" />,
      inputFormats: ['pdf'],
      outputFormat: 'pdf',
      category: 'pdf-tools'
    },
    {
      id: 'split-pdf',
      name: 'Dividir PDF',
      description: 'Separa páginas do PDF em arquivos individuais',
      icon: <Scissors className="w-6 h-6" />,
      inputFormats: ['pdf'],
      outputFormat: 'pdf',
      category: 'pdf-tools'
    },
    {
      id: 'merge-pdf',
      name: 'Unir PDFs',
      description: 'Combina múltiplos PDFs em um único arquivo',
      icon: <Merge className="w-6 h-6" />,
      inputFormats: ['pdf'],
      outputFormat: 'pdf',
      category: 'pdf-tools'
    },
    {
      id: 'rotate-pdf',
      name: 'Rotacionar PDF',
      description: 'Rotaciona páginas do PDF (90°, 180°, 270°)',
      icon: <RotateCw className="w-6 h-6" />,
      inputFormats: ['pdf'],
      outputFormat: 'pdf',
      category: 'pdf-tools'
    }
  ];

  const categories = [
    {
      id: 'convert-from-pdf',
      name: 'Converter de PDF',
      description: 'Transforme PDFs em outros formatos',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'convert-to-pdf',
      name: 'Converter para PDF',
      description: 'Transforme documentos em PDF',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'pdf-tools',
      name: 'Ferramentas PDF',
      description: 'Edite e processe seus PDFs',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleToolSelect = (tool: ConversionTool) => {
    setSelectedTool(tool);
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.accept = tool.inputFormats.map(format => `.${format}`).join(',');
    }
  };

  const handleConversion = async () => {
    if (!selectedFile || !selectedTool) return;
    setIsProcessing(true);
    setResult(null);

    // Apenas PDF para Word (id: 'pdf-to-word') usa backend real por enquanto
    if (selectedTool.id === 'pdf-to-word') {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('output_format', 'docx');

        const response = await fetch('/api/pdf/convert', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          setResult({
            success: false,
            message: err.error || 'Erro ao converter PDF.'
          });
          setIsProcessing(false);
          return;
        }

        // Recebe o arquivo convertido (blob)
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setResult({
          success: true,
          message: '✅ Conversão concluída! Clique para baixar o arquivo.',
          downloadUrl: url
        });
      } catch (error) {
        setResult({
          success: false,
          message: '❌ Erro interno. Tente novamente mais tarde.'
        });
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Para as demais ferramentas, simulação
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setResult({
        success: true,
        message: `✅ Conversão simulada (${selectedTool.outputFormat.toUpperCase()})`,
        downloadUrl: '#'
      });
    } catch (error) {
      setResult({
        success: false,
        message: '❌ Erro interno. Tente novamente mais tarde.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetProcess = () => {
    setSelectedTool(null);
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          🔧 Ferramentas PDF
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Converta, edite e processe seus documentos PDF com facilidade. 
          Ferramentas profissionais para todas suas necessidades.
        </p>
      </div>

      {/* Categorias */}
      {!selectedTool && (
        <div className="space-y-8">
          {categories.map(category => (
            <div key={category.id} className="space-y-4">
              <div className={`bg-gradient-to-r ${category.color} text-white p-6 rounded-xl`}>
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <p className="text-white/90">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {conversionTools
                  .filter(tool => tool.category === category.id)
                  .map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolSelect(tool)}
                      className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-xl p-6 text-left transition-all hover:shadow-lg hover:scale-105 group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-blue-600 group-hover:text-blue-700">
                          {tool.icon}
                        </div>
                        <h3 className="font-semibold text-gray-800">{tool.name}</h3>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {tool.inputFormats.join(', ').toUpperCase()}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                          {tool.outputFormat.toUpperCase()}
                        </span>
                      </div>
                    </button>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Processo de Conversão */}
      {selectedTool && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header da Ferramenta */}
          <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-blue-600">
                {selectedTool.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedTool.name}</h2>
                <p className="text-gray-600">{selectedTool.description}</p>
              </div>
            </div>
            
            <button
              onClick={resetProcess}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Voltar às ferramentas
            </button>
          </div>

          {/* Upload de Arquivo */}
          {!selectedFile && (
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Selecione seu arquivo
              </h3>
              <p className="text-gray-500 mb-4">
                Formatos aceitos: {selectedTool.inputFormats.map(f => f.toUpperCase()).join(', ')}
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept={selectedTool.inputFormats.map(format => `.${format}`).join(',')}
                className="hidden"
                aria-label="Selecionar arquivo para conversão"
                title="Selecionar arquivo para conversão"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Escolher Arquivo
              </button>
            </div>
          )}

          {/* Arquivo Selecionado */}
          {selectedFile && !result && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedFile.name}</h3>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Remover arquivo selecionado"
                  title="Remover arquivo selecionado"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={handleConversion}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Settings className="w-5 h-5" />
                    Converter para {selectedTool.outputFormat.toUpperCase()}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Resultado */}
          {result && (
            <div className={`border rounded-xl p-6 ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {result.success ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
                <p className={`font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.message}
                </p>
              </div>
              
              {result.success && result.downloadUrl && (
                <div className="flex gap-3">
                  <button
                    onClick={() => window.open(result.downloadUrl, '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    aria-label="Baixar arquivo convertido"
                    title="Baixar arquivo convertido"
                  >
                    <Download className="w-4 h-4" />
                    Baixar Arquivo
                  </button>
                  
                  <button
                    onClick={resetProcess}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    aria-label="Iniciar nova conversão"
                    title="Iniciar nova conversão"
                  >
                    Nova Conversão
                  </button>
                </div>
              )}
              
              {!result.success && (
                <button
                  onClick={() => setResult(null)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  aria-label="Tentar conversão novamente"
                  title="Tentar conversão novamente"
                >
                  Tentar Novamente
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFTools;
