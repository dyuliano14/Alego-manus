// src/components/ui/MarkdownViewer.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface Props {
    markdown: string;
  }
const MarkdownViewer: React.FC<Props> = ({ markdown }) => {
  const [searchParams] = useSearchParams();
  const arquivo = searchParams.get("arquivo");
  const [conteudo, setConteudo] = useState<string>("");
  const [erro, setErro] = useState<string | null>(null);
  <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>;

  

  useEffect(() => {
    if (arquivo) {
      fetch(`/estudos_alego/${arquivo}`)
        .then((res) => {
          if (!res.ok) throw new Error("Arquivo não encontrado");
          return res.text();
        })
        .then(setConteudo)
        .catch((err) => setErro(err.message));
    }
  }, [arquivo]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Visualização do Resumo</CardTitle>
      </CardHeader>
      <CardContent>
        {erro ? (
          <p className="text-red-600">{erro}</p>
        ) : (
          <div className="prose max-w-none prose-slate dark:prose-invert overflow-auto h-[600px]">
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
