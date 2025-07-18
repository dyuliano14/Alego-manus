import React, { useState } from "react";
import { Curso, Materia, Conteudo } from "./types";
import ContentViewer from "./ContentViewer";
import Modal from "./ui/Modal";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { criarConteudo } from "../services/conteudoService";
import { criarMateria } from "../services/materiaService";
import { uploadFiles } from "../services/uploadService";

interface Props {
  curso: Curso;
  onVoltar(): void;
  onAtualizar(c: Curso): void;
}

const CursosArea: React.FC<Props> = ({
  curso,
  onVoltar,
  onAtualizar,
}) => {
  const [materiaSelecionada, setMateriaSelecionada] = useState<Materia | null>(
    null
  );
  const [conteudoSelecionado, setConteudoSelecionado] =
    useState<Conteudo | null>(null);
  const [mostrarModalMateria, setMostrarModalMateria] = useState(false);
  const [mostrarModalConteudo, setMostrarModalConteudo] = useState(false);
  const [nomeNovaMateria, setNomeNovaMateria] = useState("");
  const [novoTipo, setNovoTipo] = useState<"pdf" | "markdown" | "video">("pdf");
  const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([]);

  const adicionarMateria = async () => {
    if (!nomeNovaMateria.trim()) return;
    try {
      const novaMateria = await criarMateria(nomeNovaMateria, curso.id);
      const atualizadas = [
        ...(curso.materias || []),
        { ...novaMateria, conteudos: [] },
      ];
      onAtualizar({ ...curso, materias: atualizadas });
      setMateriaSelecionada(novaMateria);
      setMostrarModalMateria(false);
      setNomeNovaMateria("");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar matéria.");
    }
  };

  const adicionarConteudo = async () => {
    if (!materiaSelecionada || arquivosSelecionados.length === 0) {
      alert("Selecione ao menos um arquivo.");
      return;
    }

    try {
      const urls = await uploadFiles(arquivosSelecionados);
      const novosConteudos: Omit<Conteudo, "id">[] = [];

      urls.forEach((url, i) => {
        const file = arquivosSelecionados[i];
        const tipoInferido = file.type.includes("pdf")
          ? "pdf"
          : file.name.endsWith(".md") || file.type.includes("markdown")
          ? "markdown"
          : file.type.includes("video")
          ? "video"
          : "pdf";

        const conteudo: Omit<Conteudo, "id"> = {
          titulo: file.name,
          tipo: tipoInferido,
          arquivo: url,
          materia_id: materiaSelecionada.id,
        };

        novosConteudos.push(conteudo);
      });

      const salvos = await Promise.all(
        novosConteudos.map((c) => criarConteudo(c))
      );

      const atualizadas = curso.materias?.map((m) =>
        m.id === materiaSelecionada.id
          ? { ...m, conteudos: [...(m.conteudos || []), ...salvos] }
          : m
      );

      onAtualizar({ ...curso, materias: atualizadas || [] });
      setMateriaSelecionada(
        atualizadas?.find((m) => m.id === materiaSelecionada.id) || null
      );
      setMostrarModalConteudo(false);
      setArquivosSelecionados([]);
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar conteúdos.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Sidebar */}
      <aside className="bg-white rounded-lg p-4 shadow w-full lg:w-80 flex-shrink-0">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">📚 {curso.nome}</h1>
          <Button className="simple-btn" onClick={onVoltar}>
            ← Voltar
          </Button>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">📘 Matérias</h2>
            <Button
              onClick={() => setMostrarModalMateria(true)}
              className="simple-btn text-sm"
            >
              + Nova
            </Button>
          </div>
          <div className="bg-[#b8eaff] rounded-lg p-3 shadow space-y-2 max-h-64 overflow-y-auto">
            {curso.materias?.map((m) => (
              <button
                key={m.id}
                className={`w-full text-left px-3 py-2 rounded-lg transition touch-manipulation text-sm ${
                  materiaSelecionada?.id === m.id
                    ? "bg-black text-white font-semibold"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
                onClick={() => {
                  setMateriaSelecionada(m);
                  setConteudoSelecionado(null);
                }}
              >
                📘 {m.nome}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-[#ecf2fa] rounded-lg p-4 shadow min-h-0">
        {materiaSelecionada ? (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h2 className="text-xl font-semibold">
                📂 {materiaSelecionada.nome}
              </h2>
              <Button
                className="simple-btn"
                onClick={() => setMostrarModalConteudo(true)}
              >
                + Adicionar Conteúdo
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4 flex-shrink-0">
              {(materiaSelecionada.conteudos ?? []).map((c) => (
                <div
                  key={c.id}
                  className={`cursor-pointer border rounded-lg p-4 hover:shadow transition-all ${
                    conteudoSelecionado?.id === c.id
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => setConteudoSelecionado(c)}
                >
                  <div className="flex items-center gap-2 font-medium">
                    {c.tipo === "pdf" && "📄"}
                    {c.tipo === "markdown" && "📝"}
                    {c.tipo === "video" && "🎥"}
                    <span className="truncate">{c.titulo}</span>
                  </div>
                </div>
              ))}
            </div>

            {conteudoSelecionado && (
              <div className="flex-1 min-h-0 overflow-hidden">
                <ContentViewer conteudo={conteudoSelecionado} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-lg">
              Selecione uma matéria para ver os conteúdos.
            </p>
          </div>
        )}
      </main>

      {/* Modais */}
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
            <Button onClick={adicionarMateria} className="simple-btn mt-4 mb-4">
              Criar
            </Button>
          </div>
        </Modal>
      )}

      {mostrarModalConteudo && (
        <Modal
          title="Adicionar Conteúdo"
          onClose={() => setMostrarModalConteudo(false)}
        >
          <div className="space-y-4">
            <Select
              value={novoTipo}
              onValueChange={(v) => setNovoTipo(v as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="video">Vídeo</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="file"
              accept=".pdf,.md,video/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setArquivosSelecionados(files);
              }}
            />
            <Button
              onClick={adicionarConteudo}
              className="simple-btn mt-4 mb-4"
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
