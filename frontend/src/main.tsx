import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js", {
        scope: "/"
      });
      
      console.info("Service Worker registered successfully:", registration.scope);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.info('New service worker installed, refresh to update');
            }
          });
        }
      });
      
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
  
  // Handle offline/online status
  window.addEventListener('online', () => {
    console.info('App is back online');
  });
  
  window.addEventListener('offline', () => {
    console.info('App is offline');
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
