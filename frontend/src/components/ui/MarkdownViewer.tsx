// 📄 COMPONENTE MarkdownViewer - Renderizador de Markdown
//
// 🎯 OBJETIVO: Transformar texto markdown em HTML bonito (como README do GitHub)
// 💡 CONCEITO: Markdown é uma linguagem simples para formatar texto
// Exemplo: **negrito**, *itálico*, # Título, [link](url)

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";  // Biblioteca que converte markdown→HTML
import remarkGfm from "remark-gfm";          // Plugin para GitHub Flavored Markdown
import { Card, CardContent, CardHeader, CardTitle } from "./card";

// 📋 TYPESCRIPT: Define que tipos de dados o componente aceita
interface Props {
  markdown?: string;  // Texto markdown direto (opcional)
  arquivo?: string;   // URL/caminho para arquivo .md (opcional)
}

// 🎯 COMPONENTE PRINCIPAL
const MarkdownViewer: React.FC<Props> = ({ markdown, arquivo }) => {
  
  // 📊 ESTADOS: Variáveis que podem mudar durante execução
  const [conteudo, setConteudo] = useState<string>("");        // Conteúdo markdown carregado
  const [carregando, setCarregando] = useState(false);        // Está carregando arquivo?
  const [erro, setErro] = useState<string | null>(null);      // Houve algum erro?

  // 🔄 useEffect: Executa quando 'arquivo' ou 'markdown' mudam
  useEffect(() => {
    if (arquivo) {
      // 📁 CASO 1: Carregar arquivo de uma URL
      setCarregando(true);  // Mostra indicador de loading
      setErro(null);        // Limpa erros anteriores
      
      // 🌐 FETCH: Busca o arquivo (como baixar pela internet)
      fetch(arquivo)
        .then((res) => {
          // ✅ Verifica se deu certo (status 200 = OK)
          if (!res.ok) throw new Error("Arquivo não encontrado");
          return res.text();  // Converte resposta para texto
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
