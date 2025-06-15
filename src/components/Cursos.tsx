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

// Interfaces (mantidas como estão, pois já estão bem definidas)
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
    // Carrega os cursos do localStorage ao iniciar
    const saved = localStorage.getItem("alego-cursos");
    return saved ? JSON.parse(saved) : [];
  });
  const [cursoAberto, setCursoAberto] = useState<Curso | null>(null);
  const [modalNovoCurso, setModalNovoCurso] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [qtdMaterias, setQtdMaterias] = useState(1);
  const [novoMaterias, setNovoMaterias] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("alego-cursos", JSON.stringify(cursos));
  }, [cursos]);

  const abrirModalCurso = () => {
    setModalNovoCurso(true);
    setNovoNome("");
    setQtdMaterias(1);
    setNovoMaterias(Array(1).fill("")); // Inicializa com um campo vazio para a primeira matéria
  };

  const handleCriaCurso = () => {
    if (!novoNome.trim()) {
      alert("O nome do curso não pode estar vazio.");
      return;
    }
    const materias = novoMaterias.map((m, i) => ({
      id: Date.now() + i,
      nome: m.trim(),
      conteudos: [],
    }));
    const curso: Curso = { id: Date.now(), nome: novoNome.trim(), materias };
    setCursos((prev) => [...prev, curso]);
    setModalNovoCurso(false);
    setNovoNome("");
    setQtdMaterias(1);
    setNovoMaterias([]);
  };

  const handleAtualizarCurso = (cursoAtualizado: Curso) => {
    setCursos((prev) =>
      prev.map((c) => (c.id === cursoAtualizado.id ? cursoAtualizado : c)),
    );
    if (cursoAberto && cursoAberto.id === cursoAtualizado.id) {
      setCursoAberto(cursoAtualizado);
    }
  };

  return (
    // Adicionado `w-full h-full` para que ocupe o espaço disponível
    <div className="flex flex-col md:flex-row gap-6 p-6 w-full h-full">
      {/* Seção da Barra Lateral (Aside) para a lista de cursos */}
      <aside className="w-full md:w-64 flex-shrink-0 border-b md:border-r md:border-b-0 pb-6 md:pb-0 pr-0 md:pr-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Meus Cursos</h2>
          <Button onClick={abrirModalCurso} size="sm">
            + Novo Curso
          </Button>
        </div>

        {cursos.length === 0 ? (
          <p className="text-muted-foreground">
            Nenhum curso adicionado ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {cursos.map((curso) => (
              <Button
                key={curso.id}
                variant={cursoAberto?.id === curso.id ? "default" : "outline"}
                className="w-full justify-start text-left"
                onClick={() => setCursoAberto(curso)}
              >
                {curso.nome} ({curso.materias.length} matéria(s))
              </Button>
            ))}
          </div>
        )}
      </aside>

      {/* Seção Principal de Conteúdo */}
      <section className="flex-1 min-w-0">
        {cursoAberto ? (
          <CursosArea
            curso={cursoAberto}
            onVoltar={() => setCursoAberto(null)}
            onAtualizar={handleAtualizarCurso}
          />
        ) : (
          <Card className="p-6 text-center h-full flex flex-col justify-center items-center">
            <CardTitle className="mb-2">Bem-vindo à Área de Cursos!</CardTitle>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Selecione um curso na barra lateral para começar a estudar ou
                crie um novo.
              </p>
              <Button onClick={abrirModalCurso}>
                Criar meu primeiro curso
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Modal para criar novo curso */}
      {modalNovoCurso && (
        <Modal title="Novo Curso" onClose={() => setModalNovoCurso(false)}>
          <div className="space-y-4">
            <input
              placeholder="Nome do Curso"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="simple-input w-full p-2 border rounded"
            />
            <div>
              <label
                htmlFor="qtdMaterias"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Quantidade de Matérias:
              </label>
              <input
                id="qtdMaterias"
                type="number"
                min={1}
                value={qtdMaterias}
                onChange={(e) => {
                  const num = parseInt(e.target.value);
                  setQtdMaterias(num);
                  setNovoMaterias(Array(num).fill("")); // Garante que o array de matérias tenha o tamanho correto
                }}
                className="simple-input w-full p-2 border rounded"
              />
            </div>
            {/* Campos para nomes das matérias */}
            {[...Array(qtdMaterias)].map((_, i) => (
              <input
                key={i}
                placeholder={`Nome da Matéria ${i + 1}`}
                value={novoMaterias[i] || ""}
                onChange={(e) => {
                  const arr = [...novoMaterias];
                  arr[i] = e.target.value;
                  setNovoMaterias(arr);
                }}
                className="simple-input w-full p-2 border rounded"
              />
            ))}
            <Button onClick={handleCriaCurso} className="w-full">
              Criar Curso
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Cursos;
