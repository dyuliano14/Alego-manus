// src/components/ui/MarkdownViewer.tsx
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface Props {
  markdown?: string;
  arquivo?: string;
}

const MarkdownViewer: React.FC<Props> = ({ markdown, arquivo }) => {
  const [conteudo, setConteudo] = useState<string>("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (arquivo) {
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
    } else if (markdown) {
      // Se markdown foi passado como prop, usar ele diretamente
      setConteudo(markdown);
    }
  }, [arquivo, markdown]);

  if (carregando) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Carregando...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>📄 Visualização do Conteúdo</CardTitle>
      </CardHeader>
      <CardContent>
        {erro ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 font-medium">⚠️ Erro ao carregar</p>
            <p className="text-red-500 text-sm mt-1">{erro}</p>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none prose-slate dark:prose-invert overflow-auto max-h-[600px] markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {conteudo}
            </ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarkdownViewer;
