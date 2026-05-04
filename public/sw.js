const CACHE_NAME = "jy-portfolio-v3";
const CORE_ASSETS = ["/", "/manifest.webmanifest", "/icon.svg", "/icon-192.png", "/icon-512.png"];
const NETWORK_TIMEOUT_MS = 500;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate" || url.pathname === "/") {
    event.respondWith(
      Promise.race([
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put("/", copy));
          }
          return response;
        }),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            caches.match("/").then((cached) => (cached ? resolve(cached) : reject()));
          }, NETWORK_TIMEOUT_MS);
        }),
      ]).catch(() => caches.match("/").then((cached) => cached || fetch(request))),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && (url.pathname === "/" || url.pathname.startsWith("/_next/static/"))) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/"))),
  );
});
