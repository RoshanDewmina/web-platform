self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Network-first for navigations
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("/")));
    return;
  }
});
