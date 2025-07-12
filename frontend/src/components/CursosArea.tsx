// src/components/CursosArea.tsx
import React, { useState, useRef } from "react";
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

interface CursosAreaProps {
  curso: Curso;
  onVoltar: () => void;
  onAtualizar: (curso: Curso) => void;
}
const fileInputRef = useRef<HTMLInputElement | null>(null); 
const CursosArea: React.FC<CursosAreaProps> = ({
  curso,
  onVoltar,
  onAtualizar,
}) => {
  const [materiaSelecionada, setMateriaSelecionada] = useState<Materia | null>(null);
  const [conteudoSelecionado, setConteudoSelecionado] = useState<Conteudo | null>(null);

  const [mostrarModalMateria, setMostrarModalMateria] = useState(false);
  const [mostrarModalConteudo, setMostrarModalConteudo] = useState(false);

  const [nomeNovaMateria, setNomeNovaMateria] = useState("");
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoTipo, setNovoTipo] = useState<"pdf" | "markdown" | "video">("pdf");
  const [novoArquivo, setNovoArquivo] = useState("");

  const adicionarMateria = async () => {
    if (!nomeNovaMateria.trim()) return;
    try {
      const novaMateria = await criarMateria(nomeNovaMateria, curso.id);
      const nova = { ...novaMateria, conteudos: [] };
      const atualizadas = [...(curso.materias || []), nova];
      onAtualizar({ ...curso, materias: atualizadas });
      setMateriaSelecionada(nova);
      setNomeNovaMateria("");
      setMostrarModalMateria(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar matéria.");
    }
  };

    const adicionarConteudo = async () => {
      if (!materiaSelecionada || !fileInputRef.current?.files?.length) return;

      try {
        const uploadedUrls = await uploadFiles(fileInputRef.current.files);

        const novosConteudos = uploadedUrls.map((url) => ({
          titulo: extractFileName(url),
          tipo: inferTypeFromUrl(url),
          arquivo: url,
          materia_id: materiaSelecionada.id,
        }));

        const adicionados = await Promise.all(
          novosConteudos.map((nc) => criarConteudo(nc))
        );

        const novasMaterias = curso.materias?.map((m) =>
          m.id === materiaSelecionada.id
            ? { ...m, conteudos: [...(m.conteudos || []), ...adicionados] }
            : m
        );

        if (novasMaterias) {
          onAtualizar({ ...curso, materias: novasMaterias });
          setMateriaSelecionada(
            novasMaterias.find((m) => m.id === materiaSelecionada.id) || null
          );
          setMostrarModalConteudo(false);
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao adicionar conteúdo.");
      }
    };

    // 👇 utilitários
    const extractFileName = (url: string) =>
      decodeURIComponent(url.split("/").pop() || "Arquivo");

    const inferTypeFromUrl = (url: string): "pdf" | "markdown" | "video" => {
      if (url.endsWith(".pdf")) return "pdf";
      if (url.endsWith(".md")) return "markdown";
      if (url.match(/\.(mp4|mov|webm)$/)) return "video";
      return "pdf";
    };

  return (
    <><>
          <div className="flex flex-col md:flex-row gap-6 p-4">
              {/* Sidebar */}
              <aside className="bg-white rounded-lg p-4 shadow w-full md:w-1/3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                      <h1 className="text-2xl font-bold">📚 {curso.nome}</h1>
                      <Button className="simple-btn mt-4 mb-4" onClick={onVoltar}>
                          ← Voltar aos Cursos
                      </Button>
                  </div>

                  <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                          <h2 className="text-lg font-semibold">📘 Matérias</h2>
                          <Button onClick={() => setMostrarModalMateria(true)} className="simple-btn mt-4 mb-4">
                              + Nova
                          </Button>
                      </div>
                      <div className="grid gap-2">
                          {curso.materias?.map((m) => (
                              <button
                                  key={m.id}
                                  className={`flex items-center gap-4 w-full px-4 py-2 rounded-lg transition ${materiaSelecionada?.id === m.id ? "bg-blue-200 font-semibold" : "bg-gray-100 hover:bg-gray-200"}`}
                                  onClick={() => {
                                      setMateriaSelecionada(m);
                                      setConteudoSelecionado(null);
                                  } }
                              >
                                  <span>📘</span>
                                  <span className="truncate">{m.nome}</span>
                              </button>
                          ))}
                      </div>
                  </div>
              </aside>
          </div>
          <div className="flex flex-col md:flex-row gap-6 p-4">
              {/* Main */}
                <main className="flex-1 bg-white p-4 shadow rounded">
                  {materiaSelecionada ? (
                      <>
                          <div className="flex justify-between items-center mb-4 gap-6">
                              <h2 className="text-xl font-semibold">📂 {materiaSelecionada.nome}</h2>
                              <Button
                                  onClick={() => setMostrarModalConteudo(true)}
                                  className="simple-btn mt-4 mb-4">
                                  + Adicionar Conteúdo
                              </Button>
                          </div>

                          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                              {(materiaSelecionada.conteudos ?? []).map((c) => (
                                  <div
                                      key={c.id}
                                      className="cursor-pointer border rounded-lg p-4 hover:shadow"
                                      onClick={() => setConteudoSelecionado(c)}
                                  >
                                      <div className="flex items-center gap-2 font-medium">
                                          {c.tipo === "pdf" && "📄"}
                                          {c.tipo === "markdown" && "📝"}
                                          {c.tipo === "video" && "🎥"}
                                          {c.titulo}
                                      </div>
                                  </div>
                              ))}
                          </div>

                          {conteudoSelecionado && (
                              <div className="simple-btn mt-4 mb-4">
                                  <ContentViewer conteudo={conteudoSelecionado} />
                              </div>
                          )}
                      </>
                  ) : (
                      <p className="text-muted-foreground">Selecione uma matéria para ver os conteúdos</p>
                  )}
              </main>
          </div>
      </><>
              {/* Modal: Nova Matéria */}
              {mostrarModalMateria && (
                  <Modal title="Nova Matéria" onClose={() => setMostrarModalMateria(false)}>
                      <div className="space-y-4">
                          <Input
                              placeholder="Nome da matéria"
                              value={nomeNovaMateria}
                              onChange={(e) => setNomeNovaMateria(e.target.value)} />
                          <Button onClick={adicionarMateria} className="simple-btn mt-4 mb-4 gap-4">
                              Criar
                          </Button>
                      </div>
                  </Modal>
              )}
          </><>
              {/* Modal: Novo Conteúdo */}
              {mostrarModalConteudo && (
                  <Modal title="Adicionar Conteúdo" onClose={() => setMostrarModalConteudo(false)}>
                      <div className="space-y-4">
                          <Input
                              placeholder="Título"
                              value={novoTitulo}
                              onChange={(e) => setNovoTitulo(e.target.value)} />
                          <Select value={novoTipo} onValueChange={(v) => setNovoTipo(v as any)}>
                              <SelectTrigger>
                                  <SelectValue placeholder="Tipo de conteúdo" />
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
                              onChange={(e) => setNovoArquivo(e.target.value)} />
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
                              } } />
                          <Button onClick={adicionarConteudo} className="simple-btn mt-4 mb-4">
                              Adicionar
                          </Button>
                      </div>
                  </Modal>
              )}
          </></>
  );
};  
 

export default CursosArea;
