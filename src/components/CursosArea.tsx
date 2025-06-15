// src/components/CursosArea.tsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import ContentViewer from "./ContentViewer";
import Modal from "../components/ui/Modal";

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

  const handleAdicionaConteudo = () => {
    if (!materiaSel) return;
    const novo: Conteudo = { id: Date.now(), titulo, tipo, arquivo };
    const updated = {
      ...curso,
      materias: curso.materias.map((m) =>
        m.id === materiaSel.id
          ? { ...m, conteudos: [...m.conteudos, novo] }
          : m,
      ),
    };
    onAtualizar(updated);
    setModalNovoConteudo(false);
    setTitulo("");
    setArquivo("");
  };

  return (
    <div className="flex flex-row">
      <aside className="w-64 border-r pr-4">
        <Button variant="ghost" onClick={onVoltar} className="mb-4">
          ← Voltar
        </Button>
        <h3 className="text-lg font-semibold mb-4">{curso.nome}</h3>
        {curso.materias.map((m) => (
          <Button
            key={m.id}
            variant={materiaSel?.id === m.id ? "default" : "outline"}
            className="w-full mb-2 text-left"
            onClick={() => {
              setMateriaSel(m);
              setContSel(null);
            }}
          >
            {m.nome}
          </Button>
        ))}
        {materiaSel && (
          <Button
            size="sm"
            className="mt-4 w-full"
            onClick={() => setModalNovoConteudo(true)}
          >
            + Adicionar Arquivo
          </Button>
        )}
      </aside>

      <section className="flex-1 pl-6">
        {!materiaSel ? (
          <p>Selecione uma matéria para ver os conteúdos.</p>
        ) : (
          <div>
            <h4 className="text-xl font-semibold mb-4">{materiaSel.nome}</h4>
            {materiaSel.conteudos.map((c) => (
              <Card
                key={c.id}
                className="hover:shadow-lg mb-3 cursor-pointer"
                onClick={() => setContSel(c)}
              >
                <CardContent className="flex items-center gap-3 py-2">
                  {c.tipo === "pdf" && "📄"}
                  {c.tipo === "markdown" && "📝"}
                  {c.tipo === "video" && "🎥"}
                  <span>{c.titulo}</span>
                </CardContent>
              </Card>
            ))}
            {!contSel && materiaSel.conteudos.length === 0 && (
              <p>Nenhum arquivo nessa matéria.</p>
            )}

            {contSel && (
              <div className="mt-6">
                <ContentViewer conteudo={contSel} />
              </div>
            )}
          </div>
        )}
      </section>

      {modalNovoConteudo && (
        <Modal title="Novo Arquivo" onClose={() => setModalNovoConteudo(false)}>
          <div className="space-y-4">
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título"
              className="simple-input"
            />
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="simple-input"
            >
              <option value="pdf">PDF</option>
              <option value="markdown">Markdown</option>
              <option value="video">Vídeo</option>
            </select>
            <input
              value={arquivo}
              onChange={(e) => setArquivo(e.target.value)}
              placeholder="URL ou caminho"
              className="simple-input"
            />
            <Button onClick={handleAdicionaConteudo}>Adicionar</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CursosArea;
