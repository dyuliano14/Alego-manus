import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  arquivo: string;
}

const MarkdownContentLoader: React.FC<Props> = ({ arquivo }) => {
  const [conteudo, setConteudo] = useState<string>("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setCarregando(true);
    setErro(null);
    
    fetch(arquivo)
      .then((res) => {
        if (!res.ok) throw new Error("Arquivo não encontrado");
        return res.text();
      })
      .then((text) => {
        setConteudo(text);
        setCarregando(false);
      })
      .catch((err) => {
        setErro(err.message);
        setCarregando(false);
      });
  }, [arquivo]);

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Carregando...</span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-lg font-medium">
          ⚠️ Erro ao carregar conteúdo
        </div>
        <p className="text-red-500 mt-2">{erro}</p>
      </div>
    );
  }

  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      className="markdown-content"
    >
      {conteudo}
    </ReactMarkdown>
  );
};

export default MarkdownContentLoader;
