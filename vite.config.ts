import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";  // import ESM

import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwind(),    // 👈 agora funciona corretamente
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") }
  },
  server: {
    fs: { allow: ["."] }
  }
});
