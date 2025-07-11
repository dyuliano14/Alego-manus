// src/components/Cursos.tsx
import React, { useState, useEffect } from "react";
import { Curso, Materia } from "./types";
import { listarCursos, criarCurso } from "../services/cursoService";
import { criarMateria } from "../services/materiaService"; // <- este
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
  const carregar = async () => {
    const dados = await listarCursos();
    setCursos(dados); // cursos com materias incluídas
  };
  carregar();
}, []);
 const handleCriaCurso = async () => {
  if (!nomeNovoCurso.trim()) {
    alert("Informe um nome para o curso");
    return;
  }

  try {
    const cursoCriado = await criarCurso(nomeNovoCurso.trim());

    const materiasCriadas: Materia[] = [];
    for (const nome of nomesMaterias) {
      if (nome.trim()) {
        const materia = await criarMateria(nome, cursoCriado.id);
        materiasCriadas.push({ ...materia, conteudos: [] });
      }
    }

    const novoCursoCompleto: Curso = {
      ...cursoCriado,
      materias: materiasCriadas,
    };

    setCursos((prev) => [...prev, novoCursoCompleto]);
    setMostrarModalCurso(false);
    setNomeNovoCurso("");
    setNumMaterias(1);
    setNomesMaterias([""]);
  } catch (e) {
    console.error("Erro ao criar curso:", e);
    alert("Erro ao criar curso.");
  }
};


  const handleAtualizaCurso = (cursoAtualizado: Curso) => {
    setCursos(
      cursos.map((c) => (c.id === cursoAtualizado.id ? cursoAtualizado : c))
    );
    setCursoAberto(cursoAtualizado);
  };

  return (
    <div className="p-4 sm:p-8 width: 100%">
      {!cursoAberto ? (
        <>
          <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-2xl font-bold">Meus Cursos</h1>
            <Button onClick={() => setMostrarModalCurso(true)} className="simple-btn">
              + Novo Curso
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                Nenhum curso criado ainda.
              </p>
            ) : (
              cursos.map((c) => (
                <div key={c.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold mb-2">{c.nome}</h2>
                  <p className="text-gray-600 text-sm mb-4">
                  <h3 className="text-md font-medium mb-2">Matérias:</h3>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                    {c.materias?.length ?? 0} matérias
                    </ul>
                    
                  </p>
                  </div>
                  <Button
                    onClick={() => setCursoAberto(c)}
                    className="simple-btn"
                  >
                    Ver Curso
                  </Button>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <CursosArea
          curso={cursoAberto}
          onVoltar={() => setCursoAberto(null)}
          onAtualizar={handleAtualizaCurso}
        />
      )}

      {mostrarModalCurso && (
        <Modal
          title="Criar Novo Curso"
          onClose={() => setMostrarModalCurso(false)}
        >
          <div className="space-y-4">
            <Input
              placeholder="Nome do Curso"
              value={nomeNovoCurso}
              onChange={(e) => setNomeNovoCurso(e.target.value)}
            />
            <Input
              type="number"
              min={1}
              placeholder="Número de matérias"
              value={numMaterias}
              onChange={(e) => setNumMaterias(parseInt(e.target.value) || 1)}
            />
            {Array.from({ length: numMaterias }).map((_, i) => (
              <Input
                key={i}
                placeholder={`Nome da Matéria ${i + 1}`}
                value={nomesMaterias[i] || ""}
                onChange={(e) => {
                  const arr = [...nomesMaterias];
                  arr[i] = e.target.value;
                  setNomesMaterias(arr);
                }}
              />
            ))}
            <Button onClick={handleCriaCurso} className="simple-btn w-full">
              Criar Curso
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Cursos;
