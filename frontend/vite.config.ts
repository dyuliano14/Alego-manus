import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuração para DigitalOcean Static Site
export default defineConfig({
  plugins: [react()],
  base: '/alego-manus/', // Static Site serve em /alego-manus/
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined // Simplificar chunks
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  preview: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: ['estudos.dyuliano.work.gd', 'localhost', 'alego-app-6s83a.ondigitalocean.app']
  },
  define: {
    global: 'globalThis',
  }
});
