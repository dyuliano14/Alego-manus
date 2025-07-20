// src/services/materiaService.ts
import { Materia } from "../components/types";

const API = import.meta.env.VITE_API_URL || "";

export const listarMaterias = async (): Promise<Materia[]> => {
  const res = await fetch(`${API ? `${API}/api/materias` : "/api/materias"}`);
  if (!res.ok) throw new Error("Erro ao carregar matérias");
  return res.json();
};

export const criarMateria = async (
  nome: string,
  curso_id: number,
): Promise<Materia> => {
  const res = await fetch(`${API ? `${API}/api/materias` : "/api/materias"}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, curso_id }),
  });
  if (!res.ok) throw new Error("Erro ao criar matéria");
  return res.json();
};

export const atualizarMateria = async (m: Materia): Promise<Materia> => {
  const res = await fetch(`${API}/api/materias/${m.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: m.nome }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar matéria");
  return res.json();
};

export const excluirMateria = async (id: number): Promise<void> => {
  const res = await fetch(`${API}/api/materias/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao excluir matéria");
};
