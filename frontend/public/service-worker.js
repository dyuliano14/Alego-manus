// Service Worker para PWA Alego Manus
const CACHE_NAME = "alego-manus-v1";
const BASE_PATH = "/alego-manus/";

// Recursos essenciais para cache
const STATIC_RESOURCES = [
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "assets/",
];

self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker instalando...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Cache criado");
        return cache.addAll(
          STATIC_RESOURCES.filter((url) => url !== BASE_PATH + "assets/")
        );
      })
      .catch((err) => console.log("❌ Erro no cache:", err))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker ativado");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("🗑️ Removendo cache antigo:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia: Network First para API, Cache First para assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Requisições para API - sempre da rede
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Assets estáticos - cache primeiro
  if (url.pathname.startsWith(BASE_PATH)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            // Só tenta clonar se a resposta for válida
            if (fetchResponse.ok && fetchResponse.status === 200) {
              const cache = caches.open(CACHE_NAME);
              cache.then((c) => c.put(event.request, fetchResponse.clone()));
            }
            return fetchResponse;
          })
        );
      })
    );
  }
});
