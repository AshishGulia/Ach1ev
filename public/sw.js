const CACHE_NAME = 'achiev-app-shell-v10';
const STATIC_ASSETS = [
  '/manifest.webmanifest',
  '/assets/aistudio/Final_Logo_webp_1000_x_350_e6e85d30.PNG',
  '/android-chrome-192x192.png?v=2',
  '/android-chrome-512x512.png?v=2',
  '/favicon.svg?v=2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Never cache cross-origin auth/cloud sync or /api endpoints
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    return;
  }

  // Always bypass browser HTTP cache for HTML navigations so new deployments load immediately
  if (request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(new Request(request, { cache: 'no-store' }))
        .then((resp) => {
          if (resp && resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone)).catch(() => {});
          }
          return resp;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Cache-first with background refresh for brand assets & static icons
  if (url.pathname.startsWith('/assets/aistudio/') || url.pathname.endsWith('/manifest.webmanifest')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetched = fetch(request)
          .then((resp) => {
            if (resp && resp.ok) {
              const clone = resp.clone();
              caches.open(CACHE_NAME).then((c) => c.put(request, clone)).catch(() => {});
            }
            return resp;
          })
          .catch(() => cached);
        return cached || fetched;
      })
    );
  }
});
