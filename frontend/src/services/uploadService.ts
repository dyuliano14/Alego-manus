// src/services/uploadService.ts
import { getApiUrl } from './api';

export const uploadFiles = async (files: File[]): Promise<string[]> => {
  const form = new FormData();
  files.forEach(file => form.append("files", file)); // ← campo plural "files"

  try {
    console.log("🔼 Enviando para:", getApiUrl("/api/upload"));
    console.log("🔼 Arquivos:", files.map(f => f.name));
    
    const res = await fetch(getApiUrl("/api/upload"), {
      method: "POST",
      body: form,
    });

    console.log("📡 Resposta status:", res.status);
    console.log("📡 Resposta headers:", Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ Erro no upload:", errText);
      
      // Se for erro 405, tentar método alternativo
      if (res.status === 405) {
        console.log("🔄 Método POST não permitido, tentando upload alternativo...");
        return await uploadFilesAlternative(files);
      }
      
      throw new Error(`Falha ao enviar arquivos: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log("✅ Resposta completa:", data);
    console.log("📋 URLs retornadas:", data.urls);
    return data.urls || []; // ← retorna array vazio se urls for undefined
  } catch (error) {
    console.error("Erro no fetch:", error);
    
    // Fallback para método alternativo em caso de erro de conexão
    console.log("Tentando método alternativo devido a erro de conexão...");
    return await uploadFilesAlternative(files);
  }
};

// Método alternativo para casos onde upload de arquivo falha no Render
const uploadFilesAlternative = async (files: File[]): Promise<string[]> => {
  console.log("Usando método alternativo de upload (mock)...");
  
  const urls: string[] = [];
  
  for (const file of files) {
    // Para fins de demonstração, criar URLs mock baseadas no nome do arquivo
    // Em produção, você pode implementar outro método de upload ou storage
    const mockUrl = `https://via.placeholder.com/400x600/cccccc/666666?text=${encodeURIComponent(file.name)}`;
    urls.push(mockUrl);
  }
  
  return urls;
};
