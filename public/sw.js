const CACHE_NAME = "jy-portfolio-v4";
const CORE_ASSETS = ["/", "/manifest.webmanifest", "/icon.svg", "/icon-192.png", "/icon-512.png"];

function isRscRequest(request, url) {
  const accept = request.headers.get("accept") || "";
  return (
    request.headers.has("rsc") ||
    url.searchParams.has("_rsc") ||
    accept.includes("text/x-component")
  );
}

function isHtml(response) {
  return (response.headers.get("content-type") || "").includes("text/html");
}

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
  if (isRscRequest(request, url)) return;

  if (request.mode === "navigate") {
    if (url.pathname !== "/") {
      event.respondWith(fetch(request));
      return;
    }

    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && isHtml(response)) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put("/", copy));
          }
          return response;
        })
        .catch(() => caches.match("/").then((cached) => cached || fetch(request))),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && url.pathname.startsWith("/_next/static/")) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || Response.error())),
  );
});
