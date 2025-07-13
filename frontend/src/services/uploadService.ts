const API = import.meta.env.VITE_API_URL;

export const uploadFiles = async (files: File[]): Promise<string[]> => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));

  const res = await fetch(`${API}/api/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Erro ao enviar arquivos");

  const urls = await res.json(); // deve retornar array de URLs
  return urls;
};
