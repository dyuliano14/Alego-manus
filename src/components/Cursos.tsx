// src/components/Cursos.tsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import Modal from "../components/ui/Modal";

// Tipagens
interface Conteudo {
  id: number;
  nome: string;
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

const Cursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoSelecionado, setCursoSelecionado] = useState<Curso | null>(null);
  const [materiaSelecionada, setMateriaSelecionada] = useState<Materia | null>(
    null,
  );

  // Modais
  const [modalNovoCurso, setModalNovoCurso] = useState(false);
  const [modalNovaMateria, setModalNovaMateria] = useState(false);
  const [modalNovoConteudo, setModalNovoConteudo] = useState(false);

  // Campos
  const [novoCursoNome, setNovoCursoNome] = useState("");
  const [novaMateriaNome, setNovaMateriaNome] = useState("");
  const [novoContNome, setNovoContNome] = useState("");
  const [novoContTipo, setNovoContTipo] = useState<
    "pdf" | "markdown" | "video"
  >("pdf");
  const [novoContArquivo, setNovoContArquivo] = useState("");

  // Criação
  const criarCurso = () => {
    const novo: Curso = {
      id: Date.now(),
      nome: novoCursoNome,
      materias: [],
    };
    setCursos([...cursos, novo]);
    setNovoCursoNome("");
    setModalNovoCurso(false);
  };

  const criarMateria = () => {
    if (!cursoSelecionado) return;
    const materia: Materia = {
      id: Date.now(),
      nome: novaMateriaNome,
      conteudos: [],
    };
    setCursos(
      cursos.map((c) =>
        c.id === cursoSelecionado.id
          ? { ...c, materias: [...c.materias, materia] }
          : c,
      ),
    );
    setNovaMateriaNome("");
    setModalNovaMateria(false);
  };

  const criarConteudo = () => {
    if (!materiaSelecionada || !cursoSelecionado) return;
    const conteudo: Conteudo = {
      id: Date.now(),
      nome: novoContNome,
      tipo: novoContTipo,
      arquivo: novoContArquivo,
    };
    setCursos(
      cursos.map((c) =>
        c.id === cursoSelecionado.id
          ? {
              ...c,
              materias: c.materias.map((m) =>
                m.id === materiaSelecionada.id
                  ? { ...m, conteudos: [...m.conteudos, conteudo] }
                  : m,
              ),
            }
          : c,
      ),
    );
    setNovoContNome("");
    setNovoContArquivo("");
    setModalNovoConteudo(false);
  };

  const abrirCurso = (curso: Curso) => {
    setCursoSelecionado(curso);
    setMateriaSelecionada(null);
  };

  return (
    <div className="space-y-6">
      {/* Lista de Cursos */}
      {!cursoSelecionado && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Meus Cursos</h2>
            <Button onClick={() => setModalNovoCurso(true)}>
              + Novo Curso
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cursos.map((c) => (
              <Card key={c.id} className="hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{c.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{c.materias.length} matérias</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => abrirCurso(c)}
                  >
                    Ver Curso
                  </Button>
                </CardContent>
              </Card>
            ))}
            {cursos.length === 0 && <p>Nenhum curso criado ainda.</p>}
          </div>
        </div>
      )}

      {/* Interface do Curso Selecionado */}
      {cursoSelecionado && (
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Sidebar de Matérias */}
          <div className="w-full lg:w-1/4 border-r pr-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Matérias</h3>
              <Button size="sm" onClick={() => setModalNovaMateria(true)}>
                + Matéria
              </Button>
            </div>
            {cursoSelecionado.materias.map((m) => (
              <button
                key={m.id}
                className={`block w-full text-left px-3 py-2 rounded ${
                  materiaSelecionada?.id === m.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                }`}
                onClick={() => setMateriaSelecionada(m)}
              >
                📘 {m.nome}
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => {
                setCursoSelecionado(null);
                setMateriaSelecionada(null);
              }}
            >
              ← Voltar
            </Button>
          </div>

          {/* Área de Conteúdos */}
          <div className="flex-1 pl-4">
            {materiaSelecionada ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">
                    {materiaSelecionada.nome}
                  </h3>
                  <Button onClick={() => setModalNovoConteudo(true)}>
                    + Conteúdo
                  </Button>
                </div>
                {materiaSelecionada.conteudos.map((ct) => (
                  <Card
                    key={ct.id}
                    className="flex items-center gap-3 mb-2 hover:shadow"
                  >
                    <CardContent className="flex items-center py-4">
                      {ct.tipo === "pdf" && "📄"}
                      {ct.tipo === "markdown" && "📝"}
                      {ct.tipo === "video" && "🎥"}
                      <span className="ml-2">{ct.nome}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto"
                        onClick={() => window.open(ct.arquivo)}
                      >
                        Abrir
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {materiaSelecionada.conteudos.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Sem conteúdos ainda.
                  </p>
                )}
              </>
            ) : (
              <p>Seletcione uma matéria para ver os conteúdos.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal Novo Curso */}
      {modalNovoCurso && (
        <Modal
          title="Criar Novo Curso"
          onClose={() => setModalNovoCurso(false)}
        >
          <div className="space-y-4">
            <Input
              placeholder="Nome do Curso"
              value={novoCursoNome}
              onChange={(e) => setNovoCursoNome(e.target.value)}
            />
            <Button onClick={criarCurso}>Criar Curso</Button>
          </div>
        </Modal>
      )}

      {/* Modal Nova Matéria */}
      {modalNovaMateria && (
        <Modal
          title="Adicionar Matéria"
          onClose={() => setModalNovaMateria(false)}
        >
          <div className="space-y-4">
            <Input
              placeholder="Nome da Matéria"
              value={novaMateriaNome}
              onChange={(e) => setNovaMateriaNome(e.target.value)}
            />
            <Button onClick={criarMateria}>Adicionar Matéria</Button>
          </div>
        </Modal>
      )}

      {/* Modal Novo Conteúdo */}
      {modalNovoConteudo && (
        <Modal
          title="Adicionar Conteúdo"
          onClose={() => setModalNovoConteudo(false)}
        >
          <div className="space-y-4">
            <Input
              placeholder="Nome do Conteúdo"
              value={novoContNome}
              onChange={(e) => setNovoContNome(e.target.value)}
            />
            <Select
              defaultValue={novoContTipo}
              onValueChange={(v) => setNovoContTipo(v as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder={novoContTipo} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="video">Vídeo</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="URL ou caminho do arquivo"
              value={novoContArquivo}
              onChange={(e) => setNovoContArquivo(e.target.value)}
            />
            <Button onClick={criarConteudo}>Adicionar Conteúdo</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Cursos;
