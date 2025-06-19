// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url"; // ESSENCIAL para __dirname em ESM

// Obtém o caminho do arquivo atual e o diretório, compatível com ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Garante que o '@' aponte para a pasta 'src'
    },
  },
  server: {
    fs: { allow: ["."] }, // Permite ao servidor Vite acessar arquivos fora da raiz do projeto, se necessário.
  },
});
