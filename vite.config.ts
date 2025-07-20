import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Suprimir warnings de deprecação
const originalEmitWarning = process.emitWarning;
process.emitWarning = function(warning: any, type?: any, code?: any) {
  if (code === 'DEP0060') return;
  if (typeof warning === 'string' && warning.includes('util._extend')) return;
  return originalEmitWarning.call(this, warning, type, code);
};

export default defineConfig({
  plugins: [react()],
  root: "./frontend", // Define o frontend como raiz
  server: {
    port: 5174,
    fs: { allow: ["."] },
    watch: { ignored: ["**/backend/**"] },
    host: true,
    strictPort: false,
    allowedHosts: [".replit.dev", "localhost"],
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
