// src/components/CursosArea.tsx
import React, { useState } from "react";
import ContentViewer from "./ContentViewer";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import Modal from "./ui/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Tipos de dados
interface Conteudo {
  id: number;
  titulo: string;
  tipo: "pdf" | "markdown" | "video";
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

// Props esperadas pelo componente
interface CursosAreaProps {
  curso: Curso;
  onVoltar: () => void;
  onAtualizar: (curso: Curso) => void;
}

const CursosArea: React.FC<CursosAreaProps> = ({ curso, onVoltar, onAtualizar }) => {
  const [materiaSelecionada, setMateriaSelecionada] = useState<Materia | null>(null);
  const [conteudoSelecionado, setConteudoSelecionado] = useState<Conteudo | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Campos do novo conteúdo
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoTipo, setNovoTipo] = useState<"pdf" | "markdown" | "video">("pdf");
  const [novoArquivo, setNovoArquivo] = useState("");

  // Função que adiciona novo conteúdo
  const adicionarConteudo = () => {
    if (!materiaSelecionada) return;

    const novo: Conteudo = {
      id: Date.now(),
      titulo: novoTitulo,
      tipo: novoTipo,
      arquivo: novoArquivo,
    };

    const novasMaterias = curso.materias.map((m) =>
      m.id === materiaSelecionada.id
        ? { ...m, conteudos: [...m.conteudos, novo] }
        : m
    );

    const cursoAtualizado = { ...curso, materias: novasMaterias };
    onAtualizar(cursoAtualizado);
    setMostrarModal(false);
    setNovoArquivo("");
    setNovoTitulo("");
    setConteudoSelecionado(novo);
  };

  return (
    <div className="grid md:grid-cols-[250px_1fr] gap-6">
      {/* Sidebar esquerda: lista de matérias */}
      <aside className="space-y-4">
        <h3 className="text-lg font-bold">Matérias</h3>
        {curso.materias.map((m) => (
          <div key={m.id}>
            <button
              className={`block w-full text-left px-3 py-2 rounded hover:bg-muted ${materiaSelecionada?.id === m.id ? "bg-muted font-semibold" : ""}`}
              onClick={() => {
                setMateriaSelecionada(m);
                setConteudoSelecionado(null);
              }}
            >
              📘 {m.nome}
            </button>
          </div>
        ))}

        {/* Botão adicionar conteúdo */}
        {materiaSelecionada && (
          <Button onClick={() => setMostrarModal(true)} className="simple-btn w-full mt-4">
            + Adicionar Conteúdo
          </Button>
        )}

        <Button onClick={onVoltar} className="w-full mt-4">
          ← Voltar aos Cursos
        </Button>
      </aside>

      {/* Painel direito: conteúdo */}
      <main className="space-y-4">
        {materiaSelecionada ? (
          <>
            <h2 className="text-xl font-bold">{materiaSelecionada.nome}</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {materiaSelecionada.conteudos.map((c) => (
                <Card
                  key={c.id}
                  className="cursor-pointer hover:shadow-md"
                  onClick={() => setConteudoSelecionado(c)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {c.tipo === "pdf" && "📄"}
                      {c.tipo === "markdown" && "📝"}
                      {c.tipo === "video" && "🎥"}
                      {c.titulo}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {conteudoSelecionado && (
              <ContentViewer conteudo={conteudoSelecionado} />
            )}
          </>
        ) : (
          <p className="text-muted-foreground text-sm">Nenhuma matéria selecionada.</p>
        )}
      </main>

      {/* Modal para adicionar conteúdo */}
      {mostrarModal && (
        <Modal title="Adicionar Conteúdo" onClose={() => setMostrarModal(false)}>
          <div className="space-y-4">
            <Input
              placeholder="Título"
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
            />
            <Select value={novoTipo} onValueChange={(v) => setNovoTipo(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="video">Vídeo</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="URL ou caminho do arquivo"
              value={novoArquivo}
              onChange={(e) => setNovoArquivo(e.target.value)}
            />
            <Button onClick={adicionarConteudo} className="simple-btn w-full">
              Adicionar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CursosArea;
