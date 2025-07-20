// src/services/debugService.ts
import { getApiUrl } from "./api";

export const resetDB = async () => {
  const res = await fetch(getApiUrl("/api/debug/reset"), { method: "POST" });
  if (!res.ok) throw new Error("Erro ao resetar o banco de dados");
  return res.json();
};

export const seedDB = async () => {
  const res = await fetch(getApiUrl("/api/debug/seed"), { method: "POST" });
  if (!res.ok) throw new Error("Erro ao popular o banco de dados");
  return res.json();
};
