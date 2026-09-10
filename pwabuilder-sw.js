// Cache వెర్షన్ పేరు
const CACHE_NAME = "pwabuilder-offline-v3";

// మీ రిపోజిటరీ పాత్ ప్రకారం ఆఫ్‌లైన్ లో భద్రపరచాల్సిన ఫైల్స్
const OFFLINE_ASSETS = [
  "/Poultry-Rates-Apl/",
  "/Poultry-Rates-Apl/index.html",
  "/Poultry-Rates-Apl/manifest.json",
  "/Poultry-Rates-Apl/icon-192.png",
  "/Poultry-Rates-Apl/icon-512.png"
];

// సర్వీస్ వర్కర్ ఇన్‌స్టాలేషన్ - ఫైళ్లను Cache చేయడం
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_ASSETS);
    })
  );
  self.skipWaiting();
});

// పాత కాష్‌లను తొలగించడం
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// నెట్‌వర్క్ రిక్వెస్ట్‌లను హ్యాండిల్ చేయడం
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // rates.json కోసం ఎల్లప్పుడూ లైవ్ ఇంటర్నెట్ నుండి మాత్రమే తీసుకుంటుంది
  if (url.pathname.endsWith("rates.json")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // మిగిలిన యాప్ ఫైల్స్ కాష్ నుండి వేగంగా లోడ్ అవుతాయి
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
