import * as React from "react";
import { useEffect, useState } from "react";
import { Curso, Materia } from "./types";
import { listarCursos, criarCurso } from "../services/cursoService";
import { criarMateria } from "../services/materiaService";
<<<<<<< HEAD
=======
import CursosArea from "./CursosArea";
>>>>>>> 70b16420e1e4a7b232ecfdbff5772fd98767a044
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Modal from "./ui/Modal";
<<<<<<< HEAD
import CursosArea from "./CursosArea";
=======
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
>>>>>>> 70b16420e1e4a7b232ecfdbff5772fd98767a044

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

<<<<<<< HEAD
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
      setModalNovo(false); setNome(""); setNumMaterias(1); setNomesMaterias([""]);
    } catch {
      alert("Erro ao criar");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      <aside className="md:w-80 bg-white rounded-lg p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">📚 Meus Cursos</h2>
        <div className="space-y-2">
          {cursos.map(c => (
            <Button
              key={c.id}
              onClick={() => setCursoAberto(c)}
              className="w-full text-left bg-blue-50 hover:bg-blue-100"
            >
              {c.nome} ({c.materias?.length})
=======
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
            <h2 className="text-2xl font-bold">
              Plataforma de controle de estudos 🎓 Meus Cursos
            </h2>
            <Button
              className="simple-btn mt-4 mb-4"
              onClick={() => setMostrarModalCurso(true)}
            >
              + Novo Curso
>>>>>>> 70b16420e1e4a7b232ecfdbff5772fd98767a044
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
            onAtualizar={upd => {
              setCursos(cursos.map(c => c.id === upd.id ? upd : c));
              setCursoAberto(upd);
            }}
          />
        ) : (
          <p>Selecione um curso à esquerda.</p>
        )}
      </main>

<<<<<<< HEAD
      {modalNovo && (
        <Modal title="Novo Curso" onClose={() => setModalNovo(false)}>
          <div className="space-y-3">
=======
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cursos.length === 0 ? (
              <p className="text-muted-foreground col-span-full">
                Nenhum curso criado ainda.
              </p>
            ) : (
              cursos.map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg border p-4 shadow hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold">{c.nome}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {c.materias?.length ?? 0} matérias
                  </p>
                  <Button
                    onClick={() => setCursoAberto(c)}
                    className="simple-btn mt-4 mb-4"
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
          onAtualizar={(cursoAtualizado) => {
            setCursos(
              cursos.map((c) =>
                c.id === cursoAtualizado.id ? cursoAtualizado : c,
              ),
            );
            setCursoAberto(cursoAtualizado);
          }}
        />
      )}

      {mostrarModalCurso && (
        <Modal
          title="Criar Novo Curso"
          onClose={() => setMostrarModalCurso(false)}
        >
          <div className="space-y-4">
>>>>>>> 70b16420e1e4a7b232ecfdbff5772fd98767a044
            <Input
              placeholder="Nome do curso"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
<<<<<<< HEAD
            <Input
              type="number"
              min={1}
              value={numMaterias}
              onChange={e => {
                const v = parseInt(e.target.value) || 1;
                setNumMaterias(v);
                setNomesMaterias(prev => Array.from({ length: v }, (_, i) => prev[i] || ""));
              }}
              placeholder="Quantas matérias?"
            />
=======

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
                    {i + 1} matéria{i > 0 && "s"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

>>>>>>> 70b16420e1e4a7b232ecfdbff5772fd98767a044
            {Array.from({ length: numMaterias }).map((_, i) => (
              <Input
                key={i}
                placeholder={`Matéria ${i + 1}`}
                value={nomesMaterias[i]}
                onChange={e => {
                  const arr = [...nomesMaterias];
                  arr[i] = e.target.value;
                  setNomesMaterias(arr);
                }}
              />
            ))}
<<<<<<< HEAD
            <Button onClick={criarNovoCurso} className="w-full bg-blue-600 text-white">
=======

            <Button onClick={handleCriaCurso} className="simple-btn mt-4 mb-4">
>>>>>>> 70b16420e1e4a7b232ecfdbff5772fd98767a044
              Criar Curso
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Cursos;
