import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    fs: { allow: ["."] },
    watch: { ignored: ["**/backend/**"] },
    host: true,
    strictPort: false,
    allowedHosts: [".replit.dev", "localhost"],
  },
});
