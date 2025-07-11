// src/components/Cursos.tsx
import React, { useState, useEffect } from "react";
import { Curso, Materia } from "./types";
import { listarCursos, criarCurso } from "../services/cursoService";
import { criarMateria } from "../services/materiaService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Modal from "./ui/Modal";
import CursosArea from "./CursosArea";

const Cursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoAberto, setCursoAberto] = useState<Curso | null>(null);
  const [modalNovo, setModalNovo] = useState(false);
  const [nome, setNome] = useState("");
  const [numMaterias, setNumMaterias] = useState(1);
  const [nomesMaterias, setNomesMaterias] = useState<string[]>([""]);

  useEffect(() => {
    listarCursos().then(setCursos).catch(console.error);
  }, []);

  const criarNovoCurso = async () => {
    if (!nome.trim()) return alert("Informe nome");
    try {
      const curso = await criarCurso(nome);
      const materias: Materia[] = [];
      for (const mat of nomesMaterias) {
        if (mat.trim()) {
          const m = await criarMateria(mat, curso.id);
          materias.push({ ...m, conteudos: [] });
        }
      }
      const novo = { ...curso, materias };
      setCursos((c) => [...c, novo]);
      setModalNovo(false);
      setNome("");
      setNumMaterias(1);
      setNomesMaterias([""]);
    } catch {
      alert("Erro ao criar");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      <aside className="md:w-80 bg-white rounded-lg p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">📚 Controle de Estudos - Meus Cursos</h2>
        <div className="space-y-2">
          {cursos.map((c) => (
            <Button
              key={c.id}
              onClick={() => setCursoAberto(c)}
              className="w-full text-left bg-blue-50 hover:bg-blue-100"
            >
              {c.nome} ({c.materias?.length})
            </Button>
          ))}
        </div>
        <Button onClick={() => setModalNovo(true)} className="mt-6 w-full">
          + Novo Curso
        </Button>
      </aside>
      <main className="flex-1 bg-white rounded-lg p-4 shadow">
        {cursoAberto ? (
          <CursosArea
            curso={cursoAberto}
            onVoltar={() => setCursoAberto(null)}
            onAtualizar={(upd) => {
              setCursos(cursos.map((c) => (c.id === upd.id ? upd : c)));
              setCursoAberto(upd);
            }}
          />
        ) : (
          <p>Selecione um curso à esquerda.</p>
        )}
      </main>

      {modalNovo && (
        <Modal title="Novo Curso" onClose={() => setModalNovo(false)}>
          <div className="space-y-3">
            <Input
              placeholder="Nome do curso"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <Input
              type="number"
              min={1}
              value={numMaterias}
              onChange={(e) => {
                const v = parseInt(e.target.value) || 1;
                setNumMaterias(v);
                setNomesMaterias((prev) =>
                  Array.from({ length: v }, (_, i) => prev[i] || ""),
                );
              }}
              placeholder="Quantas matérias?"
            />
            {Array.from({ length: numMaterias }).map((_, i) => (
              <Input
                key={i}
                placeholder={`Matéria ${i + 1}`}
                value={nomesMaterias[i]}
                onChange={(e) => {
                  const arr = [...nomesMaterias];
                  arr[i] = e.target.value;
                  setNomesMaterias(arr);
                }}
              />
            ))}
            <Button
              onClick={criarNovoCurso}
              className="w-full bg-blue-600 text-white"
            >
              Criar Curso
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Cursos;
