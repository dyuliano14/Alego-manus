// src/components/CursosArea.tsx
import React, { useState, useEffect } from "react";
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
import ContentViewer from "./ContentViewer"; // exibe PDF/MD/video
import { Curso } from "../types"; // ou o caminho correto onde está a tipagem

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

interface CursosAreaProps {
  curso: Curso;
  onVoltar: () => void;
  onAtualizar: (curso: Curso) => void;
}

const STORAGE_KEY = "alego_cursos";

const CursosArea: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoSel, setCursoSel] = useState<Curso | null>(null);
  const [materiaSel, setMateriaSel] = useState<Materia | null>(null);
  const [conteudoSel, setConteudoSel] = useState<Conteudo | null>(null);

  const [modalNovoCurso, setModalNovoCurso] = useState(false);
  const [modalNovaMateria, setModalNovaMateria] = useState(false);
  const [modalNovoConteudo, setModalNovoConteudo] = useState(false);

  // Campos temporários modais
  const [novoCursoNome, setNovoCursoNome] = useState("");
  const [novaMateriaNome, setNovaMateriaNome] = useState("");
  const [novoContTitulo, setNovoContTitulo] = useState("");
  const [novoContTipo, setNovoContTipo] = useState<Conteudo["tipo"]>("pdf");
  const [novoContArquivo, setNovoContArquivo] = useState("");

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) setCursos(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cursos));
  }, [cursos]);

  const criarCurso = () => {
    const novo: Curso = { id: Date.now(), nome: novoCursoNome, materias: [] };
    setCursos([...cursos, novo]);
    setModalNovoCurso(false);
    setNovoCursoNome("");
  };

  const criarMateria = () => {
    if (!cursoSel) return;
    const materia: Materia = {
      id: Date.now(),
      nome: novaMateriaNome,
      conteudos: [],
    };
    setCursos(
      cursos.map((c) =>
        c.id === cursoSel.id ? { ...c, materias: [...c.materias, materia] } : c,
      ),
    );
    setModalNovaMateria(false);
    setNovaMateriaNome("");
  };

  const criarConteudo = () => {
    if (!materiaSel) return;
    const cont: Conteudo = {
      id: Date.now(),
      titulo: novoContTitulo,
      tipo: novoContTipo,
      arquivo: novoContArquivo,
    };
    setCursos(
      cursos.map((c) => ({
        ...c,
        materias: c.materias.map((m) =>
          m.id === materiaSel.id
            ? { ...m, conteudos: [...m.conteudos, cont] }
            : m,
        ),
      })),
    );
    setModalNovoConteudo(false);
    setNovoContTitulo("");
    setNovoContArquivo("");
  };

  const CursosArea: React.FC<CursosAreaProps> = ({
    curso,
    onVoltar,
    onAtualizar,
  }) => {
    return (
      <div className="flex gap-6">
        <aside className="w-64 border-r pr-4">
          <h3 className="text-lg font-semibold mb-4">{curso.nome}</h3>
          {curso.materias.map((materia) => (
            <div key={materia.id} className="mb-2">
              📘 {materia.nome}
            </div>
          ))}
          <button className="simple-btn-outline mt-4 w-full" onClick={onVoltar}>
            ⬅ Voltar
          </button>
        </aside>
        <div className="flex-1">
          <p>Selecione uma matéria à esquerda para ver os conteúdos.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full min-h-[600px]">
      <Card className="course-card">…</Card>
      <main className="main-area">…</main>

      {/* Sidebar: cursos e matérias */}
      <aside className="w-64 border-r pr-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Cursos</h2>
          <Button
            size="sm"
            className="simple-btn"
            onClick={() => setModalNovoCurso(true)}
          >
            + Curso
          </Button>
        </div>
        <div className="overflow-auto flex-1">
          {cursos.map((c) => (
            <div key={c.id} className="mb-2">
              <Button
                className={`sidebar-button ${cursoSel?.id === c.id ? "font-semibold bg-accent/20" : ""}`}
                onClick={() => {
                  setCursoSel(c);
                  setMateriaSel(null);
                  setConteudoSel(null);
                }}
              >
                {c.nome}
              </Button>
              {cursoSel?.id === c.id &&
                c.materias.map((m) => (
                  <Button
                    key={m.id}
                    className={`sidebar-button pl-6 ${materiaSel?.id === m.id ? "font-semibold bg-accent/10" : ""}`}
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setMateriaSel(m);
                      setConteudoSel(null);
                    }}
                  >
                    {m.nome}
                  </Button>
                ))}
              {cursoSel?.id === c.id && (
                <Button
                  className="simple-btn w-full mt-1"
                  size="xs"
                  onClick={() => setModalNovaMateria(true)}
                >
                  + Matéria
                </Button>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Área de Conteúdo */}
      <main className="flex-1 p-6 overflow-auto">
        {!cursoSel && <p>Selecione um curso à esquerda.</p>}
        {cursoSel && !materiaSel && (
          <p>
            Selecione uma matéria ou crie uma nova no curso "{cursoSel.nome}".
          </p>
        )}
        {materiaSel && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{materiaSel.nome}</h3>
              <Button size="sm" onClick={() => setModalNovoConteudo(true)}>
                + Conteúdo
              </Button>
            </div>
            {materiaSel.conteudos.length === 0 && <p>Nenhum conteúdo ainda.</p>}
            <div className="grid md:grid-cols-2 gap-4">
              {materiaSel.conteudos.map((cont) => (
                <Card
                  key={cont.id}
                  className="cursor-pointer hover:shadow-lg"
                  onClick={() => setConteudoSel(cont)}
                >
                  <CardHeader>
                    <CardTitle>{cont.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>{cont.tipo.toUpperCase()}</CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
        {conteudoSel && (
          <ContentViewer
            conteudo={conteudoSel}
            onClose={() => setConteudoSel(null)}
          />
        )}
      </main>

      {/* 🚀 Modals */}
      {modalNovoCurso && (
        <Modal title="Novo Curso" onClose={() => setModalNovoCurso(false)}>
          <Input
            placeholder="Nome do curso"
            value={novoCursoNome}
            onChange={(e) => setNovoCursoNome(e.target.value)}
          />
          <Button className="mt-4" onClick={criarCurso}>
            Criar Curso
          </Button>
        </Modal>
      )}
      {modalNovaMateria && (
        <Modal title="Nova Matéria" onClose={() => setModalNovaMateria(false)}>
          <Input
            placeholder="Nome da matéria"
            value={novaMateriaNome}
            onChange={(e) => setNovaMateriaNome(e.target.value)}
          />
          <Button className="mt-4" onClick={criarMateria}>
            Criar Matéria
          </Button>
        </Modal>
      )}
      {modalNovoConteudo && (
        <Modal
          title="Adicionar Conteúdo"
          onClose={() => setModalNovoConteudo(false)}
        >
          <Input
            placeholder="Título do conteúdo"
            value={novoContTitulo}
            onChange={(e) => setNovoContTitulo(e.target.value)}
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
            placeholder="URL / caminho do arquivo"
            value={novoContArquivo}
            onChange={(e) => setNovoContArquivo(e.target.value)}
          />
          <Button className="mt-4" onClick={criarConteudo}>
            Adicionar Conteúdo
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default CursosArea;
