const CACHE_NAME = 'frinventory-v2';
const DEV_MODE = false;
const urlsToCache = [
];

self.addEventListener('install', event => {
  if (DEV_MODE) {
    console.log("Service worker installed in DEV MODE, bypassing cache.")
    self.skipWaiting();
  } else {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
        })
    );
  }
});

self.addEventListener('fetch', event => {
  if (DEV_MODE) {
    event.respondWith(fetch(event.request));
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});
