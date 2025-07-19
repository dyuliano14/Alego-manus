import React, { useState, useEffect } from "react";
import api from "../services/api";

interface Documento {
  id: number;
  titulo: string;
  descricao: string;
  arquivo: string;
  tipo: string;
}

const SimplePDFViewer: React.FC = () => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Carregar documentos da API
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        // Buscar todos os conteúdos da API
        const conteudos = await api.get("/api/conteudos");
        
        // Converter para o formato do documento
        const docs: Documento[] = conteudos.map((conteudo: any) => ({
          id: conteudo.id,
          titulo: conteudo.titulo || `Documento ${conteudo.id}`,
          descricao: conteudo.tipo === 'pdf' ? 'Documento PDF' : 'Documento',
          arquivo: conteudo.arquivo.replace('http://localhost:5000', ''), // Remove localhost:5000 para usar proxy
          tipo: conteudo.tipo
        }));
        
        setDocumentos(docs);
        
        // Se não houver documentos da API, usar exemplos
        if (docs.length === 0) {
          setDocumentos([
            {
              id: 1,
              titulo: "Resolução 1007",
              descricao: "Estrutura Administrativa da ALEGO",
              arquivo: "/uploads/resolucao_1007.pdf", // Usar caminho relativo para proxy
              tipo: "pdf"
            },
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
        // Fallback para documentos de exemplo
        setDocumentos([
          {
            id: 1,
            titulo: "Resolução 1007",
            descricao: "Estrutura Administrativa da ALEGO",
            arquivo: "/uploads/resolucao_1007.pdf", // Usar caminho relativo para proxy
            tipo: "pdf"
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const filteredDocs = documentos.filter(doc =>
    doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDocument = (doc: Documento) => {
    if (doc.tipo === 'pdf' || doc.arquivo.endsWith('.pdf')) {
      return (
        <div className="h-[calc(100vh-200px)] min-h-[600px]">
          <iframe
            src={doc.arquivo}
            width="100%"
            height="100%"
            style={{ border: 'none', borderRadius: '8px' }}
            title={doc.titulo}
          />
        </div>
      );
    }
    
    // Para outros tipos de arquivo
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">
          Este tipo de arquivo não pode ser visualizado diretamente.
        </p>
        <button
          onClick={() => window.open(doc.arquivo, '_blank')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Abrir em nova aba
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📚 Biblioteca de Documentos
        </h1>
        <p className="text-gray-600">
          Visualize e gerencie seus documentos de estudo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar com lista de documentos */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="🔍 Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  Carregando documentos...
                </div>
              ) : filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full text-left p-4 hover:bg-blue-50 transition-colors border-b last:border-b-0 ${
                      selectedDoc?.id === doc.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <h3 className="font-medium text-gray-800 mb-1">
                      {doc.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {doc.descricao}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      {doc.tipo === 'pdf' ? '📄 PDF' : '📝 Documento'}
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <div className="text-4xl mb-2">📄</div>
                  Nenhum documento encontrado
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Área principal de visualização */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border">
            {selectedDoc ? (
              <>
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {selectedDoc.titulo}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {selectedDoc.descricao}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(selectedDoc.arquivo, '_blank')}
                        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                      >
                        🔗 Abrir
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = selectedDoc.arquivo;
                          link.download = selectedDoc.titulo;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                      >
                        ⬇️ Baixar
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  {renderDocument(selectedDoc)}
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-medium mb-2">
                  Selecione um documento
                </h3>
                <p>
                  Escolha um documento da lista ao lado para visualizar
                </p>
                
                {filteredDocs.length === 0 && searchTerm && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-yellow-700">
                      Nenhum documento encontrado para "{searchTerm}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePDFViewer;
