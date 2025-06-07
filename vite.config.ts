import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/", // caminho base da aplicação (ajuste se for deploy em subdiretório)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 👈 permite @/components etc.
    },
  },
  server: {
    fs: {
      allow: ["."], // 👈 necessário para carregar arquivos fora de src se houver
    },
  },
  build: {
    outDir: "dist", // destino do build final
    emptyOutDir: true,
    sourcemap: true,
  },
});
