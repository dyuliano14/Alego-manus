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
      console.log("Iniciando upload de arquivos...", arquivosSelecionados);
      const urls = await uploadFiles(arquivosSelecionados);
      console.log("URLs recebidas:", urls);
      
      const novosConteudos: Omit<Conteudo, "id">[] = [];

      if (urls && Array.isArray(urls) && urls.length > 0) {
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
      } else {
        alert("Erro: Nenhum arquivo foi enviado com sucesso.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar conteúdos.");
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Navegação Interna - Matérias e Conteúdos */}
      <div className="flex flex-col lg:flex-row gap-4 flex-shrink-0">
        {/* Aside Esquerdo - Matérias */}
        <aside className="bg-white rounded-lg p-4 shadow flex-1 lg:max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">📘 Matérias</h3>
            <Button
              onClick={() => setMostrarModalMateria(true)}
              className="text-sm bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1"
            >
              + Nova
            </Button>
          </div>
          <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-3 shadow-inner space-y-2 max-h-48 overflow-y-auto">
            {curso.materias?.map((m) => (
              <button
                key={m.id}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                  materiaSelecionada?.id === m.id
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-white hover:bg-blue-50 text-gray-700 hover:shadow-sm"
                }`}
                onClick={() => {
                  setMateriaSelecionada(m);
                  setConteudoSelecionado(null);
                }}
              >
                <div className="flex items-center gap-2">
                  <span>📘</span>
                  <span className="truncate">{m.nome}</span>
                  <span className="text-xs opacity-70 ml-auto">
                    {m.conteudos?.length || 0}
                  </span>
                </div>
              </button>
            ))}
            {!curso.materias?.length && (
              <div className="text-center text-gray-500 py-6">
                <div className="text-3xl mb-2">📚</div>
                <p className="text-sm">Nenhuma matéria</p>
                <p className="text-xs opacity-75">Clique em + Nova</p>
              </div>
            )}
          </div>
        </aside>

        {/* Aside Direito - Conteúdos */}
        <aside className="bg-white rounded-lg p-4 shadow flex-1">
          {materiaSelecionada ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span>📂</span>
                  <span className="truncate">{materiaSelecionada.nome}</span>
                </h3>
                <Button
                  className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1"
                  onClick={() => setMostrarModalConteudo(true)}
                >
                  + Conteúdo
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                {(materiaSelecionada.conteudos ?? []).map((c) => (
                  <button
                    key={c.id}
                    className={`text-left border rounded-lg p-3 transition-all duration-200 ${
                      conteudoSelecionado?.id === c.id
                        ? "ring-2 ring-blue-500 bg-blue-50 border-blue-300 shadow-md scale-105"
                        : "bg-white hover:bg-gray-50 border-gray-200 hover:shadow-sm hover:scale-102"
                    }`}
                    onClick={() => setConteudoSelecionado(c)}
                  >
                    <div className="flex items-center gap-2 font-medium text-sm mb-1">
                      {c.tipo === "pdf" && "📄"}
                      {c.tipo === "markdown" && "📝"}
                      {c.tipo === "video" && "🎥"}
                      <span className="truncate">{c.titulo}</span>
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {c.tipo}
                    </div>
                  </button>
                ))}
                
                {!materiaSelecionada.conteudos?.length && (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    <div className="text-4xl mb-3">📁</div>
                    <p className="text-sm">Sem conteúdos</p>
                    <p className="text-xs opacity-75">Adicione arquivos à matéria</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-3">👈</div>
                <p className="text-sm">Selecione uma matéria</p>
                <p className="text-xs">para ver os conteúdos</p>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Main - Visualizador de Conteúdo */}
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg shadow-inner min-h-0">
        {conteudoSelecionado ? (
          <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
              <h4 className="font-semibold flex items-center gap-2 truncate">
                {conteudoSelecionado.tipo === "pdf" && "📄"}
                {conteudoSelecionado.tipo === "markdown" && "📝"}
                {conteudoSelecionado.tipo === "video" && "🎥"}
                <span>{conteudoSelecionado.titulo}</span>
              </h4>
              <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
                <span>📘</span>
                <span>{materiaSelecionada?.nome}</span>
              </div>
            </div>
            <div className="h-full p-4 overflow-hidden">
              <ContentViewer conteudo={conteudoSelecionado} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                Selecione um conteúdo
              </h4>
              <p className="text-gray-500 mb-1">
                {materiaSelecionada 
                  ? `${materiaSelecionada.conteudos?.length || 0} conteúdo(s) em "${materiaSelecionada.nome}"`
                  : "Escolha uma matéria primeiro"
                }
              </p>
              <p className="text-gray-400 text-sm">
                PDFs, vídeos e materiais de estudo
              </p>
            </div>
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
              className="w-full"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setMostrarModalMateria(false)}
              >
                Cancelar
              </Button>
              <Button onClick={adicionarMateria} className="simple-btn">
                Criar Matéria
              </Button>
            </div>
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
                <SelectValue placeholder="Tipo de conteúdo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">📄 PDF</SelectItem>
                <SelectItem value="markdown">📝 Markdown</SelectItem>
                <SelectItem value="video">🎥 Vídeo</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <label className="block text-sm font-medium mb-2">
                Selecionar arquivos
              </label>
              <input
                type="file"
                accept=".pdf,.md,video/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setArquivosSelecionados(files);
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {arquivosSelecionados.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {arquivosSelecionados.length} arquivo(s) selecionado(s)
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setMostrarModalConteudo(false)}
              >
                Cancelar
              </Button>
              <Button onClick={adicionarConteudo} className="simple-btn">
                Adicionar Conteúdo
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CursosArea;
