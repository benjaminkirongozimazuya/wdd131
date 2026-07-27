const CACHE_NAME = "mazuya-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./upload.html",
  "./profile.html",
  "./css/style.css",
  "./js/script.js",
  "./js/upload.js",
  "./js/firebase.js",
  "./manifest.json",
  "./assets/images/logo.png"
];

// Installation du Service Worker et mise en cache des fichiers
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Interception des requêtes pour le fonctionnement hors-ligne
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});