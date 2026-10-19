/* CTB ERP service worker — network-first for the app's own files, so updates arrive automatically, with a full
   offline fallback from the cache. Requests to other sites (such as the online team service) go straight to the
   network and are never stored here. It also shows team notifications and opens the app when one is tapped.
   Your data is NOT stored here; it lives in the browser's localStorage and is untouched by this file. */
const CACHE = 'ctb-erp-v6'; /* new name for each release: the old cache is cleared and the new files are fetched fresh */
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const FONTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com$/;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  let u;
  try { u = new URL(e.request.url); } catch (x) { return; }
  const own = u.origin === self.location.origin;
  if (!own && !FONTS.test(u.origin)) return; /* the online team service and other sites: never cached */
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request).then((hit) => hit || (own ? caches.match('./index.html') : Response.error()))
      )
  );
});

/* ----- team notifications (Web Push) ----- */
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { try { d = { b: e.data.text() }; } catch (y) { d = {}; } }
  const title = String(d.t || 'CTB ERP').slice(0, 120);
  const body = String(d.b || 'New update from your team').slice(0, 500);
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    wins.forEach((c) => { try { c.postMessage({ k: 'ctb-push', d }); } catch (x) {} });
    const ua = (self.navigator && self.navigator.userAgent) || '';
    const safari = /Safari\//.test(ua) && !/Chrom(e|ium)\/|Edg\//.test(ua);
    const inFront = wins.some((c) => c.visibilityState === 'visible' && c.focused);
    if (inFront && !safari) return; /* the app is open in front: it plays its own sound and shows the update */
    const opt = { body, data: { u: d.u || './' }, icon: 'icon-192.png', timestamp: +d.at || Date.now(), silent: inFront };
    if (d.g) { opt.tag = String(d.g).slice(0, 64); opt.renotify = true; }
    return self.registration.showNotification(title, opt);
  })());
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const u = new URL((e.notification.data && e.notification.data.u) || './', self.registration.scope).href;
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of wins) {
      if (c.url.indexOf(self.registration.scope) === 0) {
        try { await c.focus(); } catch (x) {}
        try { c.postMessage({ k: 'ctb-open', u }); } catch (x) {}
        return;
      }
    }
    return self.clients.openWindow(u);
  })());
});
