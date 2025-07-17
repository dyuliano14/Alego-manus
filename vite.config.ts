import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "./frontend", // Define o frontend como raiz
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "frontend/src"), // para imports tipo @/hooks/...
    },
  },
  server: {
    fs: { allow: ["."] },
    watch: { ignored: ["**/backend/**"] },
    host: true,
    strictPort: true,
    allowedHosts: [".replit.dev", "localhost"],
  },
});
