// PWABuilder Service Worker with Offline Support
const CACHE_NAME = "pwabuilder-poultry-v2";
const OFFLINE_URL = "./index.html";

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // rates.json ఎప్పుడూ తాజా రేట్ల కోసం నేరుగా ఇంటర్నెట్ నుంచే రావాలి
  if (event.request.url.includes("rates.json")) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // ఇంటర్నెట్ లేనప్పుడు ఆఫ్‌లైన్ లో యాప్ ఓపెన్ అవుతుంది
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        return response || caches.match(OFFLINE_URL);
      });
    })
  );
});
