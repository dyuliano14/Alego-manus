// src/components/CursosArea.tsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import ContentViewer from "./ContentViewer";
import Modal from "../components/ui/Modal";

// Interfaces (mantidas como estão)
interface Conteudo {
  id: number;
  titulo: string;
  tipo: string;
  arquivo: string;
}
interface Materia {
  id: number;
  nome: string;
  conteudos: Conteudo[];
}
interface Curso {
  id: number;
  nome: string;
  materias: Materia[];
}

interface Props {
  curso: Curso;
  onVoltar: () => void;
  onAtualizar: (curso: Curso) => void;
}

const CursosArea: React.FC<Props> = ({ curso, onVoltar, onAtualizar }) => {
  const [materiaSel, setMateriaSel] = useState<Materia | null>(null);
  const [contSel, setContSel] = useState<Conteudo | null>(null);
  const [modalNovoConteudo, setModalNovoConteudo] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("pdf");
  const [arquivo, setArquivo] = useState("");

  useEffect(() => {
    setMateriaSel(null);
    setContSel(null);
  }, [curso]);

  const handleAdicionaConteudo = () => {
    if (!materiaSel || !titulo.trim() || !arquivo.trim()) {
      alert("Por favor, preencha todos os campos: Título e URL/Caminho.");
      return;
    }
    const novo: Conteudo = {
      id: Date.now(),
      titulo: titulo.trim(),
      tipo,
      arquivo: arquivo.trim(),
    };
    const updatedCurso = {
      ...curso,
      materias: curso.materias.map((m) =>
        m.id === materiaSel.id
          ? { ...m, conteudos: [...m.conteudos, novo] }
          : m,
      ),
    };
    onAtualizar(updatedCurso);
    setModalNovoConteudo(false);
    setTitulo("");
    setArquivo("");
    setMateriaSel((prevMateria) => {
      if (prevMateria && prevMateria.id === materiaSel.id) {
        return (
          updatedCurso.materias.find((m) => m.id === prevMateria.id) || null
        );
      }
      return prevMateria;
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      {" "}
      {/* h-full para garantir que ocupe a altura disponível */}
      {/* Seção da Barra Lateral (Aside) para as matérias */}
      <aside className="w-full md:w-64 flex-shrink-0 border-b md:border-r md:border-b-0 pb-6 md:pb-0 pr-0 md:pr-4">
        <Button
          variant="ghost"
          onClick={onVoltar}
          className="mb-4 w-full justify-start"
        >
          ← Voltar para Cursos
        </Button>
        <h3 className="text-xl font-bold mb-4">{curso.nome}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Selecione uma matéria:
        </p>

        {curso.materias.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma matéria neste curso.</p>
        ) : (
          <div className="space-y-2">
            {curso.materias.map((m) => (
              <Button
                key={m.id}
                variant={materiaSel?.id === m.id ? "default" : "outline"}
                className="w-full justify-start text-left"
                onClick={() => {
                  setMateriaSel(m);
                  setContSel(null);
                }}
              >
                {m.nome} ({m.conteudos.length} arquivos)
              </Button>
            ))}
          </div>
        )}

        {materiaSel && (
          <Button
            size="sm"
            className="mt-6 w-full"
            onClick={() => {
              setModalNovoConteudo(true);
              setTitulo("");
              setArquivo("");
              setTipo("pdf");
            }}
          >
            + Adicionar Arquivo à {materiaSel.nome}
          </Button>
        )}
      </aside>
      {/* Seção Principal de Conteúdo */}
      <section className="flex-1 min-w-0">
        {!materiaSel ? (
          <Card className="p-6 text-center h-full flex flex-col justify-center items-center">
            <CardTitle className="mb-2">Comece a explorar!</CardTitle>
            <CardContent>
              <p className="text-muted-foreground">
                Selecione uma matéria na barra lateral para ver seus conteúdos.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="h-full flex flex-col">
            <h4 className="text-2xl font-bold mb-4">{materiaSel.nome}</h4>
            <div className="flex-1 overflow-y-auto pr-2">
              {materiaSel.conteudos.length === 0 && (
                <p className="text-muted-foreground">
                  Nenhum arquivo nesta matéria.
                </p>
              )}

              {/* Lista de Conteúdos da Matéria */}
              <div className="space-y-3 mb-6">
                {materiaSel.conteudos.map((c) => (
                  <Card
                    key={c.id}
                    className={`hover:shadow-lg cursor-pointer ${contSel?.id === c.id ? "border-blue-500 border-2" : ""}`}
                    onClick={() => setContSel(c)}
                  >
                    <CardContent className="flex items-center gap-3 py-3 px-4">
                      {c.tipo === "pdf" && "📄"}
                      {c.tipo === "markdown" && "📝"}
                      {c.tipo === "video" && "🎥"}
                      <span className="font-medium">{c.titulo}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Visualizador de Conteúdo */}
              {contSel && (
                <div className="mt-6 border rounded-lg p-4 bg-white dark:bg-zinc-800 shadow-sm">
                  <h5 className="text-xl font-semibold mb-4">
                    {contSel.titulo}
                  </h5>
                  <ContentViewer conteudo={contSel} />
                </div>
              )}
            </div>
          </div>
        )}
      </section>
      {/* Modal para adicionar novo conteúdo */}
      {modalNovoConteudo && (
        <Modal
          title={`Adicionar Arquivo à ${materiaSel?.nome || ""}`}
          onClose={() => setModalNovoConteudo(false)}
        >
          <div className="space-y-4">
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título do Arquivo"
              className="simple-input w-full p-2 border rounded"
            />
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="simple-input w-full p-2 border rounded"
            >
              <option value="pdf">PDF</option>
              <option value="markdown">Markdown</option>
              <option value="video">Vídeo</option>
            </select>
            <input
              value={arquivo}
              onChange={(e) => setArquivo(e.target.value)}
              placeholder="URL ou caminho do arquivo (ex: /conteudos/meu_arquivo.pdf)"
              className="simple-input w-full p-2 border rounded"
            />
            <Button onClick={handleAdicionaConteudo} className="w-full">
              Adicionar Arquivo
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CursosArea;
