// src/services/anotacaoService.ts
const API = import.meta.env.VITE_API_URL;

/**
 * Carrega todas as anotações de um conteúdo específico.
 */
export const listarAnotacoes = async (
  conteudoId: number,
): Promise<string[]> => {
  const res = await fetch(`${API}/api/anotacoes/${conteudoId}`);
  if (!res.ok) throw new Error("Erro ao carregar anotações");
  const arr = await res.json(); // retorna array de {id, texto}
  return arr.map((a: any) => a.texto);
};

/**
 * Salva um array de textos como as anotações do conteúdo.
 */
export const salvarAnotacoes = async (
  conteudoId: number,
  textos: string[],
): Promise<void> => {
  const res = await fetch(`${API}/api/anotacoes/${conteudoId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(textos),
  });
  if (!res.ok) throw new Error("Erro ao salvar anotações");
};
