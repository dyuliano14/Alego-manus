// src/services/uploadService.ts
const API = import.meta.env.VITE_API_URL;

export const uploadFiles = async (files: FileList): Promise<string[]> => {
  const data = new FormData();
  for (let i = 0; i < files.length; i++) data.append("files", files[i]);
  const res = await fetch(`${API}/api/uploads`, {
    method: "POST",
    body: data,
  });
  if (!res.ok) throw new Error("Erro ao enviar arquivos");
  return (await res.json()).urls as string[];
};
