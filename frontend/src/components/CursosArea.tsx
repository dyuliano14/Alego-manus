// src/components/CursosArea.tsx
import React, { useState } from "react";
import { Curso, Materia, Conteudo } from "./types";
import { criarMateria } from "../services/materiaService";
import { criarConteudo } from "../services/conteudoService";
import ContentViewer from "./ContentViewer";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Modal from "./ui/Modal";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  const [materiaSelecionada, setMateriaSelecionada] = useState<Materia | null>(null);
  const [conteudoSelecionado, setConteudoSelecionado] = useState<Conteudo | null>(null);
  const [mostrarModalConteudo, setMostrarModalConteudo] = useState(false);
  const [mostrarModalMateria, setMostrarModalMateria] = useState(false);
  const [nomeNovaMateria, setNomeNovaMateria] = useState("");
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoTipo, setNovoTipo] = useState<"pdf" | "markdown" | "video">("pdf");
  const [novoArquivo, setNovoArquivo] = useState("");

  const adicionarConteudo = async () => {
    if (!materiaSelecionada) return;
    try {
      const novo = {
        titulo: novoTitulo,
        tipo: novoTipo,
        arquivo: novoArquivo,
        materia_id: materiaSelecionada.id,
      };
      const conteudoSalvo = await criarConteudo(novo);
      const novasMaterias = curso.materias?.map((m) =>
        m.id === materiaSelecionada.id
          ? { ...m, conteudos: [...(m.conteudos || []), conteudoSalvo] }
          : m
      );
      if (novasMaterias) {
        const cursoAtualizado = { ...curso, materias: novasMaterias };
        onAtualizar(cursoAtualizado);
        setMateriaSelecionada(
          novasMaterias.find((m) => m.id === materiaSelecionada.id) || null
        );
        setConteudoSelecionado(conteudoSalvo);
      }
      setMostrarModalConteudo(false);
      setNovoTitulo("");
      setNovoArquivo("");
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar conteúdo.");
    }
  };

  const adicionarMateria = async () => {
    if (!nomeNovaMateria.trim()) return;
    try {
      const novaMateria = await criarMateria(nomeNovaMateria, curso.id);
      const nova = { ...novaMateria, conteudos: [] };
      const atualizado = { ...curso, materias: [...(curso.materias || []), nova] };
      onAtualizar(atualizado);
      setMateriaSelecionada(nova);
      setMostrarModalMateria(false);
      setNomeNovaMateria("");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar matéria.");
    }
  };

  return (
  <div className="flex flex-col md:flex-row gap-6 p-4">
    {/* LATERAL */}
    <aside className="bg-white rounded-lg p-4 shadow w-full md:w-1/3 space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-2xl font-bold">📚 {curso.nome}</h1>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          onClick={onVoltar}
        >
          ← Voltar aos Cursos
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">📘 Matérias</h2>
        <Button
          onClick={() => setMostrarModalMateria(true)}
          className="simple-btn"
        >
          + Nova Matéria
        </Button>
      </div>

      <div className="space-y-2">
        {curso.materias?.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMateriaSelecionada(m);
              setConteudoSelecionado(null);
            }}
            className={`w-full text-left px-4 py-2 rounded-lg transition flex flex-col 
              ${materiaSelecionada?.id === m.id
                ? "bg-blue-200 font-semibold"
                : "bg-gray-100 hover:bg-gray-200"}`}
          >
            <span>📘 {m.nome}</span>
            <span className="text-sm text-muted-foreground">
              {m.conteudos?.length ?? 0} conteúdos
            </span>
          </button>
        ))}
      </div>
    </aside>

    {/* PRINCIPAL */}
    <main className="bg-white rounded-lg p-4 shadow flex-1 space-y-6">
      {materiaSelecionada ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              📂 {materiaSelecionada.nome}
            </h2>
            <Button
              onClick={() => setMostrarModalConteudo(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              + Adicionar Conteúdo
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(materiaSelecionada.conteudos ?? []).map((c) => (
              <Card
                key={c.id}
                onClick={() => setConteudoSelecionado(c)}
                className="cursor-pointer transition hover:shadow-md"
              >
                <CardHeader>
                  <CardTitle className="flex gap-2 items-center">
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
            <div className="mt-4">
              <ContentViewer conteudo={conteudoSelecionado} />
            </div>
          )}
        </>
      ) : (
        <p className="text-muted-foreground text-sm">
          Nenhuma matéria selecionada.
        </p>
      )}
    </main>

    {/* MODAL - NOVA MATÉRIA */}
    {mostrarModalMateria && (
      <Modal
        title="Nova Matéria"
        onClose={() => setMostrarModalMateria(false)}
      >
        <div className="space-y-4">
          <Input
            placeholder="Nome da matéria"
            value={nomeNovaMateria}
            onChange={(e) => setNomeNovaMateria(e.target.value)}
          />
          <Button
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            onClick={async () => {
              if (!nomeNovaMateria.trim()) return;
              try {
                const novaMateria = await criarMateria(
                  nomeNovaMateria,
                  curso.id
                );
                const nova = { ...novaMateria, conteudos: [] };
                onAtualizar({
                  ...curso,
                  materias: [...(curso.materias || []), nova],
                });
                setMateriaSelecionada(nova);
                setMostrarModalMateria(false);
                setNomeNovaMateria("");
              } catch (err) {
                console.error(err);
                alert("Erro ao criar matéria.");
              }
            }}
          >
            Criar
          </Button>
        </div>
      </Modal>
    )}

    {/* MODAL - NOVO CONTEÚDO */}
    {mostrarModalConteudo && (
      <Modal
        title="Adicionar Conteúdo"
        onClose={() => setMostrarModalConteudo(false)}
      >
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
          <input
            type="file"
            accept=".pdf,.md,video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setNovoArquivo(url);
                setNovoTitulo(file.name);
                const tipoInferido = file.type.includes("pdf")
                  ? "pdf"
                  : file.name.endsWith(".md") || file.type.includes("markdown")
                  ? "markdown"
                  : file.type.includes("video")
                  ? "video"
                  : "pdf";
                setNovoTipo(tipoInferido as any);
              }
            }}
          />
          <Button
            onClick={adicionarConteudo}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Adicionar
          </Button>
        </div>
      </Modal>
    )}
  </div>
);
};

export default CursosArea;
