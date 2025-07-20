import * as React from "react";
import { useEffect, useState } from "react";
import { usePdfText } from "../hooks/usePDFText";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownViewer from "./ui/MarkdownViewer";
import PDFNotes from "./PDFNotes";

interface Conteudo {
  id: number;
  tipo: string;
  arquivo: string;
}

interface Props {
  conteudo: Conteudo;
}

const ContentViewer: React.FC<Props> = ({ conteudo }) => {
  const [pdfError, setPdfError] = useState<string | null>(null);
  
  // Verificar se o conteúdo tem arquivo válido
  if (!conteudo || !conteudo.arquivo) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Erro: Arquivo não encontrado ou não carregado corretamente.</p>
        <p className="text-sm mt-2">
          Detalhes: {JSON.stringify(conteudo, null, 2)}
        </p>
      </div>
    );
  }
  
  // Normalizar URL para usar proxy quando necessário
  const normalizeUrl = (url: string | undefined) => {
    if (!url) {
      console.error('URL do arquivo não definida:', conteudo);
      return '';
    }
    if (url.startsWith('http://localhost:5000')) {
      return url.replace('http://localhost:5000', '');
    }
    return url;
  };
  
  const normalizedUrl = normalizeUrl(conteudo.arquivo);
  const textoExtraido = usePdfText(normalizedUrl);
  
  // Hook personalizado para Text-to-Speech
  const { isSupported: ttsSupported, isSpeaking, speak, stop } = useTextToSpeech({
    lang: 'pt-BR',
    rate: 0.9,
    maxLength: 2000 // Texto mais longo para PDFs
  });

  // Carrega vozes quando componente monta (importante para dispositivos móveis)
  useEffect(() => {
    console.log('🎤 Text-to-Speech suportado:', ttsSupported);
  }, [ttsSupported]);

  const handleSpeak = async () => {
    if (!textoExtraido) {
      alert('📄 Nenhum texto disponível para reproduzir');
      return;
    }

    if (!ttsSupported) {
      alert('🚫 Text-to-Speech não é suportado neste dispositivo');
      return;
    }

    const success = await speak(textoExtraido);
    if (!success) {
      alert('❌ Erro ao reproduzir áudio. Tente novamente.');
    }
  };

  // PDF
  if (conteudo.tipo === "pdf") {
    return (
      <div className="space-y-4">
        {/* Toolbar fixo no topo */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-xl shadow-sm">
          <button
            className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 touch-manipulation min-h-[44px]"
            onClick={() => window.open(normalizedUrl, "_blank", "noopener,noreferrer")}
          >
            🖥️ <span className="hidden sm:inline">Abrir</span>
          </button>
          
          <button
            className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 touch-manipulation min-h-[44px]"
            onClick={() => {
              const link = document.createElement("a");
              link.href = normalizedUrl;
              link.download = "";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            🔽 <span className="hidden sm:inline">Baixar</span>
          </button>
          
          <button 
            onClick={handleSpeak} 
            disabled={!ttsSupported || isSpeaking || !textoExtraido}
            className={`flex items-center gap-2 px-5 py-3 text-white rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 touch-manipulation min-h-[44px] ${
              isSpeaking 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-purple-500 hover:bg-purple-600'
            } ${
              !ttsSupported || !textoExtraido ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={
              !ttsSupported ? 'Text-to-Speech não suportado' :
              !textoExtraido ? 'Nenhum texto disponível' :
              isSpeaking ? 'Reproduzindo...' : 'Ouvir conteúdo'
            }
          >
            {isSpeaking ? '🔊' : '🎵'} 
            <span className="hidden sm:inline">
              {isSpeaking ? 'Falando...' : 'Ouvir'}
            </span>
          </button>
          
          <button 
            onClick={stop}
            disabled={!isSpeaking}
            className={`flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 touch-manipulation min-h-[44px] ${
              !isSpeaking ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={isSpeaking ? 'Parar reprodução' : 'Nenhuma reprodução ativa'}
          >
            🔇 <span className="hidden sm:inline">Parar</span>
          </button>
        </div>

        {/* PDF Embed nativo do navegador */}
        <div className="relative">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="h-[calc(100vh-250px)] min-h-[600px] overflow-hidden">
              <iframe
                src={normalizedUrl}
                width="100%"
                height="100%"
                style={{ border: 'none', borderRadius: '12px' }}
                title="PDF Viewer"
                className="w-full h-full"
              />
            </div>
          </div>
          
          {/* PDFNotes como balão flutuante (corrigido com CSS inline) */}
          <PDFNotes conteudoId={conteudo.id} />
        </div>
      </div>
    );
    
  }

  if (conteudo.tipo === "markdown") {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <MarkdownViewer arquivo={normalizedUrl} />
          </div>
        </div>
      </div>
    );
  }

  // Vídeo local
  if (conteudo.tipo === "video") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <video
          src={normalizedUrl}
          controls
          className="w-full rounded-lg shadow-md"
          style={{ maxHeight: '70vh' }}
        />
      </div>
    );
  }

  // YouTube embed
  if (conteudo.tipo === "youtube") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-md">
          <iframe
            src={normalizedUrl}
            title="Vídeo YouTube"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-lg"
          />
        </div>
      </div>
    );
  }

  // Tipo não suportado
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <div className="text-red-600 text-lg font-medium">
        ⚠️ Tipo de conteúdo não suportado
      </div>
      <p className="text-red-500 mt-2">
        O formato "{conteudo.tipo}" ainda não é suportado pela plataforma.
      </p>
    </div>
  );
};

export default ContentViewer;
