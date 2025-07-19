// 📚 SERVICE WORKER - Estudo Alego PWA
// 
// O Service Worker é como um "intermediário" entre sua aplicação e a internet
// Ele permite que o app funcione offline e seja instalável como um app nativo

const CACHE_NAME = 'estudo-alego-v2'; // Nome da versão do cache
const urlsToCache = [
  // 📝 CONCEITO: Lista de arquivos que queremos guardar offline
  '/',                                    // Página principal
  '/manifest.json',                       // Configurações do PWA
  '/estudos_alego/icon-192x192.png',     // Ícones para instalação
  '/estudos_alego/icon-512x512.png'
];

// 🔧 EVENTO INSTALL: Quando o Service Worker é instalado pela primeira vez
self.addEventListener('install', event => {
  console.log('🚀 Service Worker: Instalando...');
  
  // waitUntil garante que o SW não termine até o cache estar pronto
  event.waitUntil(
    caches.open(CACHE_NAME)           // Abre o "baú" do cache
      .then(cache => {
        console.log('📦 Cache aberto com sucesso');
        // Tenta adicionar todos os arquivos ao cache
        return cache.addAll(urlsToCache.filter(url => url)); // Remove URLs vazias
      })
      .catch(error => {
        console.log('❌ Erro ao adicionar arquivos ao cache:', error);
        // Continua mesmo se alguns arquivos falharem
        return Promise.resolve();
      })
  );
});

// Service Worker básico para evitar erros
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  event.waitUntil(self.clients.claim());
});

// 🌐 EVENTO FETCH: Intercepta todas as requisições da aplicação
// CONCEITO: É como ter um "porteiro" que decide se busca na internet ou no cache
self.addEventListener('fetch', event => {
  // respondWith = "responda com isso"
  event.respondWith(
    // 🔄 ESTRATÉGIA "Network First": Tenta internet primeiro, cache depois
    fetch(event.request)                 // Tenta buscar na internet
      .then(response => {
        // ✅ Se conseguiu da internet, salva uma cópia no cache
        if (response && response.status === 200) {
          const responseToCache = response.clone(); // Clona porque só pode usar 1x
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache); // Salva no cache
            });
        }
        return response; // Retorna a resposta da internet
      })
      .catch(() => {
        // ❌ Se a internet falhou, busca no cache (modo offline)
        console.log('📱 Modo offline: buscando no cache');
        return caches.match(event.request);
      })
  );
});

// 🔄 EVENTO ACTIVATE: Quando uma nova versão do SW é ativada
// CONCEITO: Limpa caches antigos para não ocupar espaço desnecessário
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker: Ativando nova versão...');
  
  const cacheWhitelist = [CACHE_NAME]; // Lista de caches permitidos (só o atual)
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Deixar o navegador lidar com todas as requisições
self.addEventListener('fetch', (event) => {
  return;
});

const CACHE_VERSION = 'v1-' + Date.now();

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado:', CACHE_VERSION);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado:', CACHE_VERSION);
  event.waitUntil(self.clients.claim());
});
