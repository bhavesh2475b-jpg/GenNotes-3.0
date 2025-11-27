
const CACHE_NAME = 'gennotes-v5-spa-fix';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // For Navigation requests (Page loads), serve index.html
  // This covers SPA routing and fixes 404s if the server fails
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If server returns 404 (Not Found), fallback to index.html
          if (!response || response.status === 404) {
             return caches.match('/index.html');
          }
          return response;
        })
        .catch(() => {
          // If offline, fallback to index.html
          return caches.match('/index.html');
        })
    );
    return;
  }

  // For other resources (images, scripts), use Network First strategy
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Cache valid responses
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
             const responseToCache = networkResponse.clone();
             caches.open(CACHE_NAME).then((cache) => {
                 cache.put(request, responseToCache);
             });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(request);
      })
  );
});
