// src/components/Cursos.tsx
import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import Modal from "../components/ui/Modal";
import CursosArea from "./CursosArea";

// Tipagem
interface Materia {
  id: number;
  nome: string;
  conteudos: any[];
}
interface Curso {
  id: number;
  nome: string;
  materias: Materia[];
}

const LOCAL_KEY = "Meus-Cursos";

const Cursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoAberto, setCursoAberto] = useState<Curso | null>(null);

  // 🔄 Modal novo curso
  const [modalNovoCurso, setModalNovoCurso] = useState(false);
  const [nomeCurso, setNomeCurso] = useState("");
  const [qtdMaterias, setQtdMaterias] = useState(1);
  const [nomesMaterias, setNomesMaterias] = useState<string[]>([]);

  // ✅ Carrega os cursos do localStorage ao iniciar
  useEffect(() => {
    const dadosSalvos = localStorage.getItem(LOCAL_KEY);
    if (dadosSalvos) {
      try {
        setCursos(JSON.parse(dadosSalvos));
      } catch (e) {
        console.error("Erro ao carregar cursos:", e);
      }
    }
  }, []);

  // 💾 Salva sempre que cursos for atualizado
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(cursos));
  }, [cursos]);

  // 🎯 Cria curso com suas matérias
  const adicionarCurso = () => {
    const novoCurso: Curso = {
      id: Date.now(),
      nome: nomeCurso,
      materias: nomesMaterias.map((nome, i) => ({
        id: Date.now() + i,
        nome,
        conteudos: [],
      })),
    };

    setCursos((prev) => [...prev, novoCurso]);
    setModalNovoCurso(false);
    setNomeCurso("");
    setQtdMaterias(1);
    setNomesMaterias([]);
  };

  // 🔁 Atualiza um curso quando há adição de conteúdo
  const handleAtualizaCurso = (curso: Curso) => {
    setCursos((prev) =>
      prev.map((c) => (c.id === curso.id ? curso : c))
    );
  };

  return (
    <div className="main-container py-6">
      {!cursoAberto ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Meus Cursos</h1>
            <Button onClick={() => setModalNovoCurso(true)} className="simple-btn">
              + Novo Curso
            </Button>
          </div>

          <div className="simple-grid simple-grid-2">
            {cursos.map((curso) => (
              <div key={curso.id} className="simple-card">
                <h2 className="font-semibold">{curso.nome}</h2>
                <p className="text-sm text-muted-foreground">
                  {curso.materias.length} matérias
                </p>
                <Button className="simple-btn mt-2" onClick={() => setCursoAberto(curso)}>
                  Ver Curso
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <CursosArea
          curso={cursoAberto}
          onVoltar={() => setCursoAberto(null)}
          onAtualizar={handleAtualizaCurso}
        />
      )}

      {/* 📦 Modal: Criar Novo Curso */}
      {modalNovoCurso && (
        <Modal title="Novo Curso" onClose={() => setModalNovoCurso(false)}>
          <div className="space-y-4">
            <input
              className="w-full border rounded p-2"
              type="text"
              placeholder="Nome do Curso"
              value={nomeCurso}
              onChange={(e) => setNomeCurso(e.target.value)}
            />
            <input
              className="w-full border rounded p-2"
              type="number"
              placeholder="Quantidade de matérias"
              min={1}
              value={qtdMaterias}
              onChange={(e) => setQtdMaterias(Math.max(1, parseInt(e.target.value)))}
            />
            {[...Array(qtdMaterias)].map((_, i) => (
              <input
                key={i}
                className="w-full border rounded p-2"
                type="text"
                placeholder={`Matéria ${i + 1}`}
                value={nomesMaterias[i] || ""}
                onChange={(e) => {
                  const clone = [...nomesMaterias];
                  clone[i] = e.target.value;
                  setNomesMaterias(clone);
                }}
              />
            ))}
            <Button className="simple-btn w-full" onClick={adicionarCurso}>
              Criar Curso
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Cursos;