// src/components/Cursos.tsx
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Modal from "./ui/Modal";
import { Input } from "./ui/input";
import CursosArea from "./CursosArea";

// Dados iniciais persistidos
const STORAGE_KEY = "Meus-Cursos";

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
  // 📂 1. Lista de cursos
  const [cursos, setCursos] = useState<Curso[]>([]);
  // 📌 Curso selecionado para visualização
  const [cursoAberto, setCursoAberto] = useState<Curso | null>(null);
  // 🎲 Modal de criar curso
  const [mostrarModalCurso, setMostrarModalCurso] = useState(false);

  // Campos do modal novo curso
  const [nomeNovoCurso, setNomeNovoCurso] = useState("");
  const [numMaterias, setNumMaterias] = useState(1);
  const [nomesMaterias, setNomesMaterias] = useState<string[]>([""]);

  // 🎁 Load do localStorage ao iniciar
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      setCursos(JSON.parse(data));
    }
  }, []);

  // 💾 Salva no localStorage sempre que cursos mudam
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cursos));
  }, [cursos]);

  // ➕ Cria um novo curso com matérias vazias
  const handleCriaCurso = () => {
    const materias: Materia[] = nomesMaterias
      .slice(0, numMaterias)
      .map((nome, idx) => ({
        id: Date.now() + idx,
        nome: nome || `Matéria ${idx + 1}`,
        conteudos: [],
      }));

    setCursos([...cursos, { id: Date.now(), nome: nomeNovoCurso, materias }]);
    setMostrarModalCurso(false);
    setNomeNovoCurso("");
    setNumMaterias(1);
    setNomesMaterias([""]);
  };

  // 🔄 Atualiza o curso após adicionar conteúdo
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
            {cursos.map((c) => (
              <div key={c.id} className="simple-card">
                <h3 className="text-lg font-semibold">{c.nome}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {c.materias.length} matérias
                </p>
                <Button
                  onClick={() => setCursoAberto(c)}
                  className="simple-btn"
                >
                  Ver Curso
                </Button>
              </div>
            ))}
            {cursos.length === 0 && (
              <p className="text-muted-foreground">
                Nenhum curso criado ainda.
              </p>
            )}
          </div>
        </>
      ) : (
        // 🤝 Exibe a área do curso aberto
        <CursosArea
          curso={cursoAberto}
          onVoltar={() => setCursoAberto(null)}
          onAtualizar={handleAtualizaCurso}
        />
      )}

      {/* 🛠 Modal: criação de curso */}
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
