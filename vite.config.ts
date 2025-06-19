// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url"; // Importe fileURLToPath do módulo 'url'
import path from "path"; // Importe 'path'

// Define __dirname em um ambiente de módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    fs: { allow: ["."] },
  },
});
