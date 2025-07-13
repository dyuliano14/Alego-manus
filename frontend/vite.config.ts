import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";


export default defineConfig({
  plugins: [react()],
  resolve: {
  alias: {
      "@": path.resolve(__dirname, "src"), // para imports tipo @/hooks/...
  
    },
  },

  server: {
    fs: { allow: ["."] },
    watch: { ignored: ["**/backend/**"] },
    host: true,
    strictPort: true,
    allowedHosts: ["all"], // <- isso permite qualquer host, incluindo o do Replit
    
  },
});
