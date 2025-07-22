import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuração simplificada para DigitalOcean
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  preview: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: ['estudos.dyuliano.work.gd', 'localhost']
  },
  define: {
    global: 'globalThis',
  }
});
