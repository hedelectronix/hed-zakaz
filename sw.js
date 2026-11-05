// Hed buyurtma — ilova qobig'ini oflayn ochish uchun kesh. Google skript so'rovlari keshlanmaydi.
const CACHE = 'hz-shell-v17';
const SHELL = ['./', 'index.html', 'zakaz.html', 'zakaz.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  // tarmoq sekin bo'lsa (4 soniyadan ko'p) saqlangan nusxa darhol ochiladi; yangisi fonda keshga yoziladi
  const net = fetch(e.request, { cache: 'no-cache' }).then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return r; });
  e.respondWith(Promise.race([net, new Promise((_, no) => setTimeout(no, 4000))])
    .catch(() => caches.match(e.request).then(r => r || caches.match('zakaz.html')).then(r => r || net)));
});
