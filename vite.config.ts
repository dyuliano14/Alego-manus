// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url"; // Necessário para __dirname em ESM

// Define __dirname e __filename para o contexto de Módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Certifique-se que o caminho esteja correto aqui
    },
  },
  server: {
    fs: { allow: ["."] }, // Permite o acesso a arquivos fora da raiz, se necessário
  },
});
