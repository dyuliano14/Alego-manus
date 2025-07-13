// src/services/conteudoService.ts
import { Conteudo } from "../components/types";

const API = import.meta.env.VITE_API_URL;

export const listarConteudos = async (): Promise<Conteudo[]> => {
  const res = await fetch(`${API}/api/conteudos`);
  if (!res.ok) throw new Error("Erro ao carregar conteúdos");
  return res.json();
};

export const criarConteudo = async (
  c: Omit<Conteudo, "id">,
): Promise<Conteudo> => {
  const res = await fetch(`${API}/api/conteudos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(c),
  });
  if (!res.ok) throw new Error("Erro ao criar conteúdo");
  return res.json();
};

export const atualizarConteudo = async (c: Conteudo): Promise<Conteudo> => {
  const res = await fetch(`${API}/api/conteudos/${c.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: c.titulo,
      tipo: c.tipo,
      arquivo: c.arquivo,
    }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar conteúdo");
  return res.json();
};

export const excluirConteudo = async (id: number): Promise<void> => {
  const res = await fetch(`${API}/api/conteudos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao excluir conteúdo");
};
