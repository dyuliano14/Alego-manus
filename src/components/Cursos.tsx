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
  tipo: string;
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
  const [cursos, setCursos] = useState<Curso[]>(() => {
    const saved = localStorage.getItem("alego-cursos");
    return saved ? JSON.parse(saved) : [];
  });
  const [cursoAberto, setCursoAberto] = useState<Curso | null>(null);
  const [modalNovoCurso, setModalNovoCurso] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [qtdMaterias, setQtdMaterias] = useState(1);
  const [novoMaterias, setNovoMaterias] = useState<string[]>([]);

  useEffect(
    () => localStorage.setItem("alego-cursos", JSON.stringify(cursos)),
    [cursos],
  );

  const abrirModalCurso = () => setModalNovoCurso(true);
  const handleCriaCurso = () => {
    const materias = novoMaterias.map((m, i) => ({
      id: Date.now() + i,
      nome: m,
      conteudos: [],
    }));
    const curso: Curso = { id: Date.now(), nome: novoNome, materias };
    setCursos((prev) => [...prev, curso]);
    setModalNovoCurso(false);
    setNovoNome("");
    setQtdMaterias(1);
    setNovoMaterias([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meus Cursos</h2>
        <Button onClick={abrirModalCurso}>+ Novo Curso</Button>
      </div>

      {cursoAberto ? (
        <CursosArea
          curso={cursoAberto}
          onVoltar={() => setCursoAberto(null)}
          onAtualizar={(upd) => {
            setCursos((prev) => prev.map((c) => (c.id === upd.id ? upd : c)));
            setCursoAberto(upd);
          }}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cursos.map((curso) => (
            <Card key={curso.id} className="hover:shadow-lg">
              <CardHeader>
                <CardTitle>{curso.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{curso.materias.length} matéria(s)</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() => setCursoAberto(curso)}
                >
                  Ver Curso
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {modalNovoCurso && (
        <Modal title="Novo Curso" onClose={() => setModalNovoCurso(false)}>
          <div className="space-y-4">
            <input
              placeholder="Nome do Curso"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="simple-input"
            />
            <input
              type="number"
              min={1}
              value={qtdMaterias}
              onChange={(e) => setQtdMaterias(parseInt(e.target.value))}
              className="simple-input"
            />
            {[...Array(qtdMaterias)].map((_, i) => (
              <input
                key={i}
                placeholder={`Matéria ${i + 1}`}
                value={novoMaterias[i] || ""}
                onChange={(e) => {
                  const arr = [...novoMaterias];
                  arr[i] = e.target.value;
                  setNovoMaterias(arr);
                }}
                className="simple-input"
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
