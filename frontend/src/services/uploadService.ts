// src/services/uploadService.ts
const API = import.meta.env.VITE_API_URL;

export const uploadFiles = async (files: File[]): Promise<string[]> => {
  const form = new FormData();
  files.forEach(file => form.append("files", file)); // ← campo plural "files"

  const res = await fetch(`${API}/api/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Erro no upload:", errText);
    throw new Error("Falha ao enviar arquivos");
  }

  const data = await res.json();
  return data.urls; // ← retorna array
};
