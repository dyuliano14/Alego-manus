import React, { useState, useEffect } from "react";
import { Curso, Materia } from "./types";
import { listarCursos, criarCurso } from "../services/cursoService";
import { criarMateria } from "../services/materiaService";
import CursosArea from "./CursosArea";
import { Button } from "./ui/button";
import Modal from "./ui/Modal";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

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

  return (
    <div className="space-y-6 p-4">
      {!cursoAberto ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">🎓 Meus Cursos</h2>
            <Button onClick={() => setMostrarModalCurso(true)}>+ Novo Curso</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cursos.length === 0 ? (
              <p className="text-muted-foreground col-span-full">
                Nenhum curso criado ainda.
              </p>
            ) : (
              cursos.map((c) => (
                <div key={c.id} className="rounded-lg border p-4 shadow hover:shadow-md transition">
                  <h3 className="text-lg font-semibold">{c.nome}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {c.materias?.length ?? 0} matérias
                  </p>
                  <Button onClick={() => setCursoAberto(c)} className="simple-btn">
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
          onAtualizar={(cursoAtualizado) => {
            setCursos(
              cursos.map((c) => (c.id === cursoAtualizado.id ? cursoAtualizado : c))
            );
            setCursoAberto(cursoAtualizado);
          }}
        />
      )}

      {mostrarModalCurso && (
        <Modal title="Criar Novo Curso" onClose={() => setMostrarModalCurso(false)}>
          <div className="space-y-4">
            <Input
              placeholder="Nome do Curso"
              value={nomeNovoCurso}
              onChange={(e) => setNomeNovoCurso(e.target.value)}
            />

            <Select
              value={String(numMaterias)}
              onValueChange={(val) => setNumMaterias(parseInt(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Número de matérias" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={i} value={String(i + 1)}>
                    {i + 1} matéria{ i > 0 && 's' }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
