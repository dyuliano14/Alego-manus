      import React, { useState } from "react";
      import { Curso, Materia, Conteudo } from "./types";
      import { criarConteudo } from "../services/conteudoService";
      import { criarMateria } from "../services/materiaService";
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

        const [mostrarModalMateria, setMostrarModalMateria] = useState(false);
        const [nomeNovaMateria, setNomeNovaMateria] = useState("");

        const [mostrarModalConteudo, setMostrarModalConteudo] = useState(false);
        const [novoTitulo, setNovoTitulo] = useState("");
        const [novoTipo, setNovoTipo] = useState<"pdf" | "markdown" | "video">("pdf");
        const [arquivos, setArquivos] = useState<File[]>([]);

        const adicionarConteudos = async () => {
          if (!materiaSelecionada || arquivos.length === 0) return;

          const novosConteudos: Conteudo[] = [];

          for (const file of arquivos) {
            const url = URL.createObjectURL(file);
            const tipoInferido = file.type.includes("pdf")
              ? "pdf"
              : file.name.endsWith(".md") || file.type.includes("markdown")
              ? "markdown"
              : file.type.includes("video")
              ? "video"
              : "pdf";

            const novo = {
              titulo: file.name,
              tipo: tipoInferido,
              arquivo: url,
              materia_id: materiaSelecionada.id,
            };

            try {
              const conteudoSalvo = await criarConteudo(novo);
              novosConteudos.push(conteudoSalvo);
            } catch (err) {
              console.error(err);
            }
          }

          const novasMaterias = curso.materias?.map((m) =>
            m.id === materiaSelecionada.id
              ? { ...m, conteudos: [...(m.conteudos || []), ...novosConteudos] }
              : m
          );

          if (novasMaterias) {
            const atualizado = { ...curso, materias: novasMaterias };
            onAtualizar(atualizado);
            setMateriaSelecionada(novasMaterias.find((m) => m.id === materiaSelecionada.id) || null);
            setConteudoSelecionado(novosConteudos[0] || null);
          }

          setMostrarModalConteudo(false);
          setArquivos([]);
          setNovoTitulo("");
        };

        const adicionarMateria = async () => {
          if (!nomeNovaMateria.trim()) return;
          try {
            const novaMateria = await criarMateria(nomeNovaMateria, curso.id);
            const nova = { ...novaMateria, conteudos: [] };
            onAtualizar({ ...curso, materias: [...(curso.materias || []), nova] });
            setMateriaSelecionada(nova);
            setNomeNovaMateria("");
            setMostrarModalMateria(false);
          } catch (err) {
            console.error(err);
          }
        };

        return (
          <div className="flex flex-col md:flex-row gap-6 p-4">
            <aside className="bg-white rounded-lg p-4 shadow w-full md:w-1/3">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">📚 {curso.nome}</h1>
              </div>

              <Button className="w-full mb-4" onClick={onVoltar}>
                ← Voltar aos Cursos
              </Button>

              <h2 className="text-lg font-semibold mb-2">📘 Matérias</h2>
              <div className="space-y-2">
                {(curso.materias ?? []).map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setMateriaSelecionada(m);
                      setConteudoSelecionado(null);
                    }}
                    className={`cursor-pointer p-3 rounded-lg shadow-sm transition ${
                      materiaSelecionada?.id === m.id ? "bg-blue-100" : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="font-medium">{m.nome}</div>
                    <div className="text-sm text-gray-500">{m.conteudos?.length ?? 0} conteúdos</div>
                  </div>
                ))}
              </div>

              <Button onClick={() => setMostrarModalMateria(true)} className="w-full mt-4">
                + Nova Matéria
              </Button>
            </aside>

            <main className="bg-white rounded-lg p-4 shadow flex-1 space-y-4">
              {materiaSelecionada ? (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">📂 {materiaSelecionada.nome}</h2>
                    <Button onClick={() => setMostrarModalConteudo(true)}>
                      + Adicionar Conteúdos
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
                <p className="text-muted-foreground text-sm">Nenhuma matéria selecionada.</p>
              )}
            </main>

            {mostrarModalMateria && (
              <Modal title="Nova Matéria" onClose={() => setMostrarModalMateria(false)}>
                <div className="space-y-4">
                  <Input
                    placeholder="Nome da matéria"
                    value={nomeNovaMateria}
                    onChange={(e) => setNomeNovaMateria(e.target.value)}
                  />
                  <Button className="w-full" onClick={adicionarMateria}>
                    Criar
                  </Button>
                </div>
              </Modal>
            )}

            {mostrarModalConteudo && (
              <Modal title="Adicionar Conteúdos" onClose={() => setMostrarModalConteudo(false)}>
                <div className="space-y-4">
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.md,video/*"
                    onChange={(e) => setArquivos(Array.from(e.target.files || []))}
                  />
                  <Button onClick={adicionarConteudos} className="w-full">
                    Salvar Conteúdos
                  </Button>
                </div>
              </Modal>
            )}
          </div>
        );
      };

      export default CursosArea;
