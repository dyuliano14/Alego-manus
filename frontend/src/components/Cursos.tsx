// src/components/Cursos.tsx
import React, { useState, useEffect } from "react";
import { Curso, Materia } from "./types";
import { listarCursos, criarCurso } from "../services/cursoService";
import { criarMateria } from "../services/materiaService";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Modal from "./ui/Modal";
import CursosArea from "./CursosArea";

const Cursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoAberto, setCursoAberto] = useState<Curso | null>(null);
  const [mostrarModalCurso, setMostrarModalCurso] = useState(false);
  const [nomeNovoCurso, setNomeNovoCurso] = useState("");
  const [numMaterias, setNumMaterias] = useState(1);
  const [nomesMaterias, setNomesMaterias] = useState<string[]>([""]);

  useEffect(() => {
    listarCursos().then(setCursos).catch(console.error);
  }, []);

  const handleCriaCurso = async () => {
    if (!nomeNovoCurso.trim()) return alert("Informe nome do curso");

    try {
      const cursoCriado = await criarCurso(nomeNovoCurso.trim());
      const materiasCriadas: Materia[] = [];

      for (const nome of nomesMaterias) {
        if (nome.trim()) {
          const materia = await criarMateria(nome, cursoCriado.id);
          materiasCriadas.push({ ...materia, conteudos: [] });
        }
      }

      const novoCurso: Curso = { ...cursoCriado, materias: materiasCriadas };
      setCursos(prev => [...prev, novoCurso]);
      setMostrarModalCurso(false);
      setNomeNovoCurso("");
      setNumMaterias(1);
      setNomesMaterias([""]);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar curso");
    }
  };

  const handleAtualizaCurso = (cursoAtualizado: Curso) => {
    setCursos(prev =>
      prev.map(c => (c.id === cursoAtualizado.id ? cursoAtualizado : c))
    );
    setCursoAberto(cursoAtualizado);
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
    <div className="space-y-8 px-6 py-4">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-700">📚 Meus Cursos</h1>
        <Button className="bg-blue-200 text-blue-800 hover:bg-blue-300" onClick={() => setMostrarModalCurso(true)}>
          + Novo Curso
        </Button>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cursos.length === 0 && (
          <p className="text-gray-500 col-span-full">Nenhum curso criado ainda.</p>
        )}
        {cursos.map(c => (
          <div key={c.id} className="bg-indigo-50 shadow-sm rounded-lg p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-indigo-800 mb-2">{c.nome}</h2>
              <p className="text-gray-600">
                {c.materias?.length ?? 0} matéria{c.materias && c.materias.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button className="mt-4 bg-indigo-200 text-indigo-900 hover:bg-indigo-300" onClick={() => setCursoAberto(c)}>
              Ver Curso
            </Button>
          </div>
        ))}
      </div>

      {mostrarModalCurso && (
        <Modal title="Criar Novo Curso" onClose={() => setMostrarModalCurso(false)}>
          <div className="space-y-4">
            <Input
              placeholder="Nome do Curso"
              value={nomeNovoCurso}
              onChange={e => setNomeNovoCurso(e.target.value)}
            />
            <Input
              type="number"
              min={1}
              placeholder="Número de matérias"
              value={numMaterias}
              onChange={e => {
                const val = parseInt(e.target.value) || 1;
                setNumMaterias(val);
                setNomesMaterias(Array(val).fill(""));
              }}
            />
            {Array.from({ length: numMaterias }, (_, i) => (
              <Input
                key={i}
                placeholder={`Nome da Matéria ${i + 1}`}
                value={nomesMaterias[i] || ""}
                onChange={e => {
                  const arr = [...nomesMaterias];
                  arr[i] = e.target.value;
                  setNomesMaterias(arr);
                }}
              />
            ))}
            <Button className="simple-btn w-full bg-green-200 text-green-800 hover:bg-green-300" onClick={handleCriaCurso}>
              Criar Curso
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Cursos;
