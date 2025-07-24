import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // App principal restaurado
import "./styles/index.css";
import "./styles/custom.css";
import "./styles/pwa-mobile.css";
import "./styles/tts-controls.css";
import "./styles/reading-mode.css";

// Register Service Worker for PWA
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/alego-manus/service-worker.js");
      console.info("✅ Service Worker registered:", registration);
      
      // Verificar atualizações
      registration.addEventListener('updatefound', () => {
        console.info('🔄 Nova versão disponível!');
      });
    } catch (error) {
      console.error("❌ Service Worker registration failed:", error);
    }
  });
} else {
  console.info("🔧 Service Worker desabilitado em desenvolvimento");
}

// PWA Install Prompt
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.info('💫 PWA pode ser instalado');
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
