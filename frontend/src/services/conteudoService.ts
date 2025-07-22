// src/services/conteudoService.ts
import { Conteudo } from "../components/types";
import { getApiUrl } from "./api";

export const listarConteudos = async (): Promise<Conteudo[]> => {
  const res = await fetch(getApiUrl("/api/conteudos"));
  if (!res.ok) throw new Error("Erro ao carregar conteúdos");
  return res.json();
};

export const criarConteudo = async (
  c: Omit<Conteudo, "id">,
): Promise<Conteudo> => {
  console.log("🔄 Criando conteúdo:", c);
  const res = await fetch(getApiUrl("/api/conteudos"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(c),
  });
  if (!res.ok) {
    console.error("❌ Erro ao criar conteúdo:", res.status, res.statusText);
    throw new Error("Erro ao criar conteúdo");
  }
  const resultado = await res.json();
  console.log("✅ Conteúdo criado:", resultado);
  return resultado;
};

export const atualizarConteudo = async (c: Conteudo): Promise<Conteudo> => {
  const res = await fetch(getApiUrl(`/api/conteudos/${c.id}`), {
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
  const res = await fetch(getApiUrl(`/api/conteudos/${id}`), {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao excluir conteúdo");
};
