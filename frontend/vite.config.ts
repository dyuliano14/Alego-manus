import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          pdf: ['pdfjs-dist'],
          ui: ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
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
  preview: {
    port: 8080,
    host: "0.0.0.0"
  },
  define: {
    global: 'globalThis',
  },
});
