// src/services/debugService.ts
const API = import.meta.env.VITE_API_URL;

export const resetDB = async () => {
  const res = await fetch(`${API}/api/debug/reset`, { method: "POST" });
  if (!res.ok) throw new Error("Erro ao resetar o banco de dados");
  return res.json();
};

export const seedDB = async () => {
  const res = await fetch(`${API}/api/debug/seed`, { method: "POST" });
  if (!res.ok) throw new Error("Erro ao popular o banco de dados");
  return res.json();
};
