// src/components/CursosArea.tsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Curso, Materia, Conteudo } from "./Cursos";

interface CursosAreaProps {
  curso: Curso;
  onVoltar: () => void;
  onAtualizar: (curso: Curso) => void;
}

const CursosArea: React.FC<CursosAreaProps> = ({
  curso,
  onVoltar,
  onAtualizar,
}) => {
  const [materiaOpen, setMateriaOpen] = useState<Materia | null>(null);
  const [novoContTitulo, setNovoContTitulo] = useState("");
  const [novoContTipo, setNovoContTipo] = useState<
    "pdf" | "markdown" | "video"
  >("pdf");
  const [novoContArquivo, setNovoContArquivo] = useState("");

  const handleAddConteudo = () => {
    if (!materiaOpen) return;
    const novo: Conteudo = {
      id: Date.now(),
      titulo: novoContTitulo,
      tipo: novoContTipo,
      arquivo: novoContArquivo,
    };
    const atualizado = {
      ...curso,
      materias: curso.materias.map((m) =>
        m.id === materiaOpen.id
          ? { ...m, conteudos: [...m.conteudos, novo] }
          : m,
      ),
    };
    onAtualizar(atualizado);
    setNovoContTitulo("");
    setNovoContArquivo("");
  };

  return (
    <div className="flex gap-6">
      <aside className="w-64 border-r pr-4">
        <h3 className="text-lg font-semibold mb-4">{curso.nome}</h3>
        {curso.materias.map((m) => (
          <button
            key={m.id}
            className={`w-full text-left px-3 py-2 rounded ${
              materiaOpen?.id === m.id ? "bg-accent/20" : "hover:bg-muted"
            }`}
            onClick={() => setMateriaOpen(m)}
          >
            📘 {m.nome}
          </button>
        ))}
        <Button size="sm" className="mt-4 w-full" onClick={onVoltar}>
          ⬅ Voltar
        </Button>
      </aside>

      <div className="flex-1">
        {!materiaOpen ? (
          <p>
            Selecione uma matéria para ver os conteúdos e adicionar arquivos.
          </p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{materiaOpen.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc ml-6 space-y-2">
                {materiaOpen.conteudos.map((cont) => (
                  <li key={cont.id} className="flex items-center gap-2">
                    {cont.tipo === "pdf" && "📄"}
                    {cont.tipo === "markdown" && "📝"}
                    {cont.tipo === "video" && "🎥"}
                    <span>{cont.titulo}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(cont.arquivo, "_blank")}
                    >
                      Abrir
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2">
                <input
                  className="w-full border px-2 py-1 rounded"
                  placeholder="Título do conteúdo"
                  value={novoContTitulo}
                  onChange={(e) => setNovoContTitulo(e.target.value)}
                />
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={novoContTipo}
                  onChange={(e) => setNovoContTipo(e.target.value as any)}
                >
                  <option value="pdf">PDF</option>
                  <option value="markdown">Markdown</option>
                  <option value="video">Vídeo</option>
                </select>
                <input
                  className="w-full border px-2 py-1 rounded"
                  placeholder="URL ou caminho"
                  value={novoContArquivo}
                  onChange={(e) => setNovoContArquivo(e.target.value)}
                />
                <Button size="sm" onClick={handleAddConteudo}>
                  + Adicionar Arquivo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CursosArea;
