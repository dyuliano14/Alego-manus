// src/services/cursoService.ts
import { Curso } from "../components/types";
import { api } from "./api";

export const listarCursos = async (): Promise<Curso[]> => {
  return await api.get("/api/cursos");
};

export const criarCurso = async (nome: string): Promise<Curso> => {
  console.log("🔄 Criando curso:", nome);
  const resultado = await api.post("/api/cursos", { nome });
  console.log("✅ Curso criado:", resultado);
  return resultado;
};

export const atualizarCurso = async (curso: Curso): Promise<Curso> => {
  return await api.put(`/api/cursos/${curso.id}`, { nome: curso.nome });
};

export const excluirCurso = async (id: number): Promise<void> => {
  return await api.delete(`/api/cursos/${id}`);
};
