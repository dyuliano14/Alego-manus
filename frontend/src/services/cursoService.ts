// src/services/cursoService.ts
import { Curso } from "../components/types";

const API = import.meta.env.VITE_API_URL;

export const listarCursos = async (): Promise<Curso[]> => {
  const res = await fetch(`${API}/api/cursos`);
  if (!res.ok) throw new Error("Erro ao carregar cursos");
  return res.json();
};

export const criarCurso = async (nome: string): Promise<Curso> => {
  const res = await fetch(`${API}/api/cursos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome }),
  });
  if (!res.ok) throw new Error("Erro ao criar curso");
  return res.json();
};

export const atualizarCurso = async (curso: Curso): Promise<Curso> => {
  const res = await fetch(`${API}/api/cursos/${curso.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: curso.nome }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar curso");
  return res.json();
};

export const excluirCurso = async (id: number): Promise<void> => {
  const res = await fetch(`${API}/api/cursos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao excluir curso");
};
