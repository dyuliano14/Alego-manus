import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Modal from "./ui/Modal";
import { Input } from "./ui/input";
import CursosArea from "./CursosArea";

const API =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";
if (!API) {
  console.error("❌ VITE_API_URL não está definida!");
  alert("Erro de configuração. A API não está acessível.");
}

export interface Conteudo {
  id: number;
  titulo: string;
  tipo: "pdf" | "markdown" | "video";
  arquivo: string;
}
export interface Materia {
  id: number;
  nome: string;
  conteudos: Conteudo[];
}
export interface Curso {
  id: number;
  nome: string;
  materias: Materia[];
}

const Cursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoAberto, setCursoAberto] = useState<Curso | null>(null);
  const [mostrarModalCurso, setMostrarModalCurso] = useState(false);

  const [nomeNovoCurso, setNomeNovoCurso] = useState("");
  const [numMaterias, setNumMaterias] = useState(1);
  const [nomesMaterias, setNomesMaterias] = useState<string[]>([""]);

  console.log("Criando curso:", nomeNovoCurso, nomesMaterias);
  // 🟡 Carrega cursos do backend
  useEffect(() => {
    // 🟡 Carrega cursos do backend ao montar o componente
    fetch(`${API}/api/cursos`)
      .then((res) => res.json())
      .then(setCursos)
      .catch((err) => console.error("Erro ao carregar cursos:", err));
  }, []);

  const handleCriaCurso = async () => {
    if (!nomeNovoCurso.trim()) {
      alert("Informe um nome para o curso");
      return;
    }

    console.log("Criando curso:", nomeNovoCurso, nomesMaterias);

    try {
      // 🔹 1. Cria o curso
      const resCurso = await fetch(`${API}/api/cursos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomeNovoCurso.trim() }),
      });

      if (!resCurso.ok) throw new Error("Erro ao criar curso");
      const cursoCriado = await resCurso.json();

      // 🔹 2. Cria as matérias
      const materiasCriadas = await Promise.all(
        Array.from({ length: numMaterias }).map((_, i) => {
          const nomeMateria = nomesMaterias[i]?.trim() || `Matéria ${i + 1}`;
          return fetch(`${API}/api/materias`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nome: nomeMateria,
              curso_id: cursoCriado.id,
            }),
          }).then((res) => {
            if (!res.ok)
              throw new Error(`Erro ao criar matéria: ${nomeMateria}`);
            return res.json();
          });
        })
      );

      // 🔹 3. Atualiza o estado com o novo curso e matérias
      setCursos([...cursos, { ...cursoCriado, materias: materiasCriadas }]);
      setMostrarModalCurso(false);
      setNomeNovoCurso("");
      setNumMaterias(1);
      setNomesMaterias([""]);
    } catch (err) {
      console.error("Erro ao criar curso:", err);
      alert("Falha ao criar curso. Verifique os campos e tente novamente.");
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
            <h2 className="text-2xl font-bold">Meus Cursos</h2>
            <Button onClick={() => setMostrarModalCurso(true)}>
              + Novo Curso
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              placeholder="Número de matérias"
              min={1}
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
