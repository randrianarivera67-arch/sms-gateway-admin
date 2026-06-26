// Network-only SW: tsy mi-cache mihitsy, mamafa ny cache rehetra (anti-bug cache)
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('message', e => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  // Network-only: version vaovao hatrany. Offline fallback fotsiny raha tsy misy réseau.
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
