// src/services/materiaService.ts
import { Materia } from "../components/types";
import { getApiUrl } from './api';

export const listarMaterias = async (): Promise<Materia[]> => {
  const res = await fetch(getApiUrl("/api/materias"));
  if (!res.ok) throw new Error("Erro ao carregar matérias");
  return res.json();
};

export const criarMateria = async (
  nome: string,
  curso_id: number,
): Promise<Materia> => {
  console.log("🔄 Criando matéria:", { nome, curso_id });
  const res = await fetch(getApiUrl("/api/materias"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, curso_id }),
  });
  if (!res.ok) {
    console.error("❌ Erro ao criar matéria:", res.status, res.statusText);
    throw new Error("Erro ao criar matéria");
  }
  const resultado = await res.json();
  console.log("✅ Matéria criada:", resultado);
  return resultado;
};

export const atualizarMateria = async (m: Materia): Promise<Materia> => {
  const res = await fetch(getApiUrl(`/api/materias/${m.id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: m.nome }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar matéria");
  return res.json();
};

export const excluirMateria = async (id: number): Promise<void> => {
  const res = await fetch(getApiUrl(`/api/materias/${id}`), {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao excluir matéria");
};
