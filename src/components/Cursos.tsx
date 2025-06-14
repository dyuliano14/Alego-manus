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
import Modal from "../components/ui/modal"; // modal genérico

// Tipagens
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

const Cursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [modalNovoCurso, setModalNovoCurso] = useState(false);
  const [modalNovoConteudo, setModalNovoConteudo] = useState<{
    aberto: boolean;
    cursoId?: number;
    materiaId?: number;
  }>({ aberto: false });

  // Campos temporários modal curso
  const [novoCursoNome, setNovoCursoNome] = useState("");
  const [novoCursoQtdMaterias, setNovoCursoQtdMaterias] = useState(1);
  const [novoCursoMaterias, setNovoCursoMaterias] = useState<string[]>([]);

  // Campos temporários modal conteúdo
  const [novoContTitulo, setNovoContTitulo] = useState("");
  const [novoContTipo, setNovoContTipo] = useState<
    "pdf" | "markdown" | "video"
  >("pdf");
  const [novoContArquivo, setNovoContArquivo] = useState("");

  // Cria curso e matérias
  const handleCriaCurso = () => {
    const materias: Materia[] = novoCursoMaterias.map((nome, idx) => ({
      id: Date.now() + idx,
      nome,
      conteudos: [],
    }));
    setCursos((prev) => [
      ...prev,
      { id: Date.now(), nome: novoCursoNome, materias },
    ]);
    setModalNovoCurso(false);
    setNovoCursoMaterias([]);
    setNovoCursoNome("");
    setNovoCursoQtdMaterias(1);
  };

  // Adiciona conteúdo
  const handleCriaConteudo = () => {
    if (!modalNovoConteudo.cursoId || !modalNovoConteudo.materiaId) return;
    setCursos((prev) =>
      prev.map((curso) => {
        if (curso.id !== modalNovoConteudo.cursoId) return curso;
        return {
          ...curso,
          materias: curso.materias.map((mat) => {
            if (mat.id !== modalNovoConteudo.materiaId) return mat;
            const novo: Conteudo = {
              id: Date.now(),
              titulo: novoContTitulo,
              tipo: novoContTipo,
              arquivo: novoContArquivo,
            };
            return { ...mat, conteudos: [...mat.conteudos, novo] };
          }),
        };
      }),
    );
    setModalNovoConteudo({ aberto: false });
    setNovoContTitulo("");
    setNovoContArquivo("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cursos e Conteúdos</h1>
        <Button onClick={() => setModalNovoCurso(true)}>Novo Curso</Button>
      </div>

      {cursos.map((curso) => (
        <Card key={curso.id}>
          <CardHeader>
            <CardTitle>{curso.nome}</CardTitle>
          </CardHeader>
          <CardContent>
            {curso.materias.map((materia) => (
              <div key={materia.id} className="mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{materia.nome}</h3>
                  <Button
                    size="sm"
                    onClick={() =>
                      setModalNovoConteudo({
                        aberto: true,
                        cursoId: curso.id,
                        materiaId: materia.id,
                      })
                    }
                  >
                    + Conteúdo
                  </Button>
                </div>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  {materia.conteudos.map((cont) => (
                    <li key={cont.id}>
                      {cont.titulo} ({cont.tipo})
                      <Button
                        size="xs"
                        variant="outline"
                        className="ml-2"
                        onClick={() => window.open(cont.arquivo, "_blank")}
                      >
                        Abrir
                      </Button>
                    </li>
                  ))}
                  {materia.conteudos.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Nenhum conteúdo ainda
                    </p>
                  )}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

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
            <Input
              type="number"
              placeholder="Número de matérias"
              min={1}
              value={novoCursoQtdMaterias}
              onChange={(e) =>
                setNovoCursoQtdMaterias(parseInt(e.target.value) || 1)
              }
            />
            {[...Array(novoCursoQtdMaterias)].map((_, i) => (
              <Input
                key={i}
                placeholder={`Nome da Matéria ${i + 1}`}
                value={novoCursoMaterias[i] || ""}
                onChange={(e) => {
                  const copy = [...novoCursoMaterias];
                  copy[i] = e.target.value;
                  setNovoCursoMaterias(copy);
                }}
              />
            ))}
            <Button onClick={handleCriaCurso}>Criar Curso</Button>
          </div>
        </Modal>
      )}

      {/* Modal Novo Conteúdo */}
      {modalNovoConteudo.aberto && (
        <Modal
          title="Adicionar Conteúdo"
          onClose={() => setModalNovoConteudo({ aberto: false })}
        >
          <div className="space-y-4">
            <Input
              placeholder="Título do Conteúdo"
              value={novoContTitulo}
              onChange={(e) => setNovoContTitulo(e.target.value)}
            />
            <Select
              defaultValue="pdf"
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
            <Button onClick={handleCriaConteudo}>Adicionar Conteúdo</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Cursos;
