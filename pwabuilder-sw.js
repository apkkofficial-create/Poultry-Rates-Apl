const CACHE_NAME = "ap-poultry-rates-v1";
const ASSETS_TO_CACHE = [
  "/Poultry-Rates-Apl/",
  "/Poultry-Rates-Apl/index.html",
  "/Poultry-Rates-Apl/manifest.json",
  "/Poultry-Rates-Apl/icon-192.png",
  "/Poultry-Rates-Apl/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
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
  // rates.json ను ఎల్లప్పుడూ లైవ్ నెట్‌వర్క్ నుంచే తెచ్చుకోవాలి
  if (event.request.url.includes("rates.json")) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
