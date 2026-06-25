const CACHE_VERSION = Date.now();
const CACHE_NAME = 'sms-gateway-v' + CACHE_VERSION;
// FIX: index.html ESORINA ao amin'ny pre-cache -- io file io misy CSS/JS
// inline rehetra ka tsy tokony ho cached mafy. manifest.json sy '/' ihany.
const ASSETS = ['/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// FIX: rehefa mandray SKIP_WAITING avy amin'ny page (rehefa misy version
// vaovao installed fa "waiting" ihany), lasa active avy hatrany.
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // FIX: HTML pages (navigation requests) -- TOUJOURS network-first, JAMAIS
  // cache, mba hahatonga ny PWA installed (standalone) hahazo ny version
  // farany foana, tsy mila desinstaller.
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
