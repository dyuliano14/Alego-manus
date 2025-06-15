// src/components/Cursos.tsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import Modal from "../components/ui/Modal";
import CursosArea from "./CursosArea";

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
export interface Curso {
  id: number;
  nome: string;
  materias: Materia[];
}

const STORAGE_KEY = "alego:cursos";

const Cursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoAberto, setCursoAberto] = useState<Curso | null>(null);
  const [modalNovoCurso, setModalNovoCurso] = useState(false);
  const [novoCursoNome, setNovoCursoNome] = useState("");
  const [novoCursoQtdMaterias, setNovoCursoQtdMaterias] = useState(1);
  const [novoCursoMaterias, setNovoCursoMaterias] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setCursos(JSON.parse(saved));
  }, []);

  const save = (list: Curso[]) => {
    setCursos(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const handleCriaCurso = () => {
    const materias = novoCursoMaterias.map((nome, idx) => ({
      id: Date.now() + idx,
      nome,
      conteudos: [],
    }));
    const novo = { id: Date.now(), nome: novoCursoNome, materias };
    const updated = [...cursos, novo];
    save(updated);
    setModalNovoCurso(false);
    setNovoCursoNome("");
    setNovoCursoQtdMaterias(1);
    setNovoCursoMaterias([]);
  };

  const handleAtualizaCurso = (curso: Curso) => {
    const updated = cursos.map((c) => (c.id === curso.id ? curso : c));
    save(updated);
    setCursoAberto(curso);
  };

  if (cursoAberto) {
    return (
      <CursosArea
        curso={cursoAberto}
        onVoltar={() => setCursoAberto(null)}
        onAtualizar={handleAtualizaCurso}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meus Cursos</h2>
        <Button onClick={() => setModalNovoCurso(true)}>+ Novo Curso</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cursos.map((c) => (
          <Card key={c.id} className="hover:shadow-lg">
            <CardHeader>
              <CardTitle>{c.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {c.materias.length} matéria{c.materias.length !== 1 ? "s" : ""}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={() => setCursoAberto(c)}
              >
                Ver Curso
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {modalNovoCurso && (
        <Modal
          title="Criar Novo Curso"
          onClose={() => setModalNovoCurso(false)}
        >
          <div className="space-y-4">
            <input
              className="w-full border px-2 py-1 rounded"
              placeholder="Nome do Curso"
              value={novoCursoNome}
              onChange={(e) => setNovoCursoNome(e.target.value)}
            />
            <input
              className="w-full border px-2 py-1 rounded"
              type="number"
              min={1}
              placeholder="Número de matérias"
              value={novoCursoQtdMaterias}
              onChange={(e) =>
                setNovoCursoQtdMaterias(parseInt(e.target.value) || 1)
              }
            />
            {[...Array(novoCursoQtdMaterias)].map((_, i) => (
              <input
                key={i}
                className="w-full border px-2 py-1 rounded"
                placeholder={`Nome da Matéria ${i + 1}`}
                value={novoCursoMaterias[i] || ""}
                onChange={(e) => {
                  const arr = [...novoCursoMaterias];
                  arr[i] = e.target.value;
                  setNovoCursoMaterias(arr);
                }}
              />
            ))}
            <Button onClick={handleCriaCurso}>Criar Curso</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Cursos;
