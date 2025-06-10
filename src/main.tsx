<<<<<<< HEAD
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/tailwind.css'
=======
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import "./styles/custom.css";

// Registrar Service Worker para PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registrado com sucesso:", registration);
      })
      .catch((registrationError) => {
        console.log("SW falhou ao registrar:", registrationError);
      });
  });
}
>>>>>>> fb270e6b6c1ab0688f18f742bc96e07958af231f

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
