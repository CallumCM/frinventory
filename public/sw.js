const CACHE_NAME = 'frinventory-v1';
const urlsToCache = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', event => {
  // Caching disabled for development
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Network only
  event.respondWith(fetch(event.request));
});
