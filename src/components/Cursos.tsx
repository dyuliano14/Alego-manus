// src/components/Cursos.tsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Modal from "./ui/Modal";
import CursosArea from "./CursosArea";


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
  const [cursoAberto, setCursoAberto] = useState<Curso | null>(null);

  const [modalNovoCurso, setModalNovoCurso] = useState(false);
  const [novoCursoNome, setNovoCursoNome] = useState("");
  const [novoCursoQtdMaterias, setNovoCursoQtdMaterias] = useState(1);
  const [novoCursoMaterias, setNovoCursoMaterias] = useState<string[]>([]);

  // Carregar do localStorage
  useEffect(() => {
    const local = localStorage.getItem("meusCursos");
    if (local) {
      setCursos(JSON.parse(local));
    }
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem("meusCursos", JSON.stringify(cursos));
  }, [cursos]);

  const handleCriaCurso = () => {
    const novo: Curso = {
      id: Date.now(),
      nome: novoCursoNome,
      materias: novoCursoMaterias.map((nome, idx) => ({
        id: Date.now() + idx,
        nome,
        conteudos: [],
      })),
    };
    setCursos((prev) => [...prev, novo]);
    setModalNovoCurso(false);
    setNovoCursoNome("");
    setNovoCursoQtdMaterias(1);
    setNovoCursoMaterias([]);
  };

  const handleAtualizaCurso = (cursoAtualizado: Curso) => {
    setCursos((prev) =>
      prev.map((c) => (c.id === cursoAtualizado.id ? cursoAtualizado : c)),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meus Cursos</h2>
        <Button
          className="simple-btn-outline"
          onClick={() => setModalNovoCurso(true)}
        >
          + Novo Curso
        </Button>
      </div>

      {!cursoAberto ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cursos.map((curso) => (
            <Card key={curso.id} className="hover:shadow-lg">
              <CardHeader>
                <CardTitle>{curso.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{curso.materias.length} matérias</p>
                <Button
                  className="simple-btn"
                  onClick={() => setCursoAberto(curso)}
                >
                  Ver Curso
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <CursosArea
          curso={cursoAberto}
          onVoltar={() => setCursoAberto(null)}
          onAtualizar={handleAtualizaCurso}
        />
      )}

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
              min={1}
              value={novoCursoQtdMaterias}
              onChange={(e) =>
                setNovoCursoQtdMaterias(parseInt(e.target.value) || 1)
              }
              placeholder="Quantas matérias?"
            />
            {[...Array(novoCursoQtdMaterias)].map((_, i) => (
              <Input
                key={i}
                placeholder={`Nome da Matéria ${i + 1}`}
                value={novoCursoMaterias[i] || ""}
                onChange={(e) => {
                  const copia = [...novoCursoMaterias];
                  copia[i] = e.target.value;
                  setNovoCursoMaterias(copia);
                }}
              />
            ))}
            <Button className="simple-btn" onClick={handleCriaCurso}>
              Criar Curso
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Cursos;
