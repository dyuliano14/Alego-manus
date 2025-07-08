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
    <div className="space-y-6">
      {!cursoAberto ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Controle de Estudos dos Meus Cursos {""}
            </h2>
            <Button
              className="simple-btn"
              onClick={() => setMostrarModalCurso(true)}
            >
              + Novo Curso
            </Button>
          </div>

          <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-">
            {cursos.length === 0 ? (
              <p className="text-muted-foreground col-span-full">
                Nenhum curso criado ainda.
              </p>
            ) : (
              cursos.map((c) => (
                <div key={c.id} className="simple-card">
                  <h3 className="text-lg font-semibold">{c.nome}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {c.materias?.length ?? 0} matérias
                  </p>
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
