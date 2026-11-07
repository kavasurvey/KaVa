/// <reference lib="webworker" />

const CACHE_VERSION = 'kava-v1';
const SHELL_CACHE = `kava-shell-${CACHE_VERSION}`;
const STATIC_CACHE = `kava-static-${CACHE_VERSION}`;
const MAP_TILES_CACHE = `kava-map-tiles-${CACHE_VERSION}`;

const MAX_MAP_TILES = 250;

// Essential app shell and assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/login',
  '/offline',
  '/manifest.webmanifest',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-512x512.png',
  'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
];

// Helper to limit cache size (LRU cleanup)
async function limitCacheEntries(cacheName, maxEntries) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxEntries) {
      // Delete oldest entries
      const entriesToDelete = keys.slice(0, keys.length - maxEntries);
      await Promise.all(entriesToDelete.map((key) => cache.delete(key)));
    }
  } catch (err) {
    console.warn('[SW] Cache cleanup warning:', err);
  }
}

// 1. Install event: Precache core shell & styles
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(async (cache) => {
      // Use individual promises to ensure partial failures do not break entire install
      await Promise.allSettled(
        PRECACHE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => console.warn(`[SW] Precache skipped for ${asset}:`, err))
        )
      );
      return self.skipWaiting();
    })
  );
});

// 2. Activate event: Clean up previous cache generations
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(async (cacheNames) => {
      const allowedCaches = [SHELL_CACHE, STATIC_CACHE, MAP_TILES_CACHE];
      await Promise.all(
        cacheNames.map((name) => {
          if (!allowedCaches.includes(name)) {
            return caches.delete(name);
          }
        })
      );
      return self.clients.claim();
    })
  );
});

// 3. Message event: Allow client to trigger skipWaiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 4. Fetch event: Strategic caching rules
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Non-GET requests are never intercepted by service worker cache
  if (request.method !== 'GET') {
    return;
  }

  // --- RULE A: API, SUPABASE & AUTH CALLS (NETWORK ONLY / NEVER CACHE PERSONAL DATA) ---
  const isApi = url.pathname.startsWith('/api/');
  const isSupabase =
    url.hostname.includes('supabase.co') ||
    url.pathname.includes('/rest/v1/') ||
    url.pathname.includes('/auth/v1/');

  if (isApi || isSupabase) {
    event.respondWith(
      fetch(request).catch(() => {
        // Return 503 response if network is offline; never store or serve from CacheStorage
        return new Response(
          JSON.stringify({ error: 'Network unavailable. Running in offline mode.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // --- RULE B: MAP TILES & GLYPHS (CACHE FIRST WITH MAX-SIZE LIMIT) ---
  const isMapTile =
    url.hostname.includes('cartocdn.com') ||
    url.hostname.includes('openstreetmap.org') ||
    url.pathname.includes('/tiles/') ||
    url.pathname.endsWith('.pbf') ||
    url.pathname.includes('/fonts/');

  if (isMapTile) {
    event.respondWith(
      caches.open(MAP_TILES_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) {
          return cached;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
            limitCacheEntries(MAP_TILES_CACHE, MAX_MAP_TILES);
          }
          return networkResponse;
        } catch {
          // Fallback or empty tile
          return new Response('', { status: 204 });
        }
      })
    );
    return;
  }

  // --- RULE C: STATIC ASSETS (NEXT.JS BUNDLES, FONTS, IMAGES, ICONS) ---
  const isStatic =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(?:png|jpg|jpeg|svg|webp|ico|woff2?|css|js)$/.test(url.pathname);

  if (isStatic) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) {
          return cached;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return cached || new Response('', { status: 404 });
        }
      })
    );
    return;
  }

  // --- RULE D: NAVIGATION REQUESTS (HTML / APP SHELL) ---
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(async (networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(SHELL_CACHE);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(async () => {
          // If offline, check matching cached page
          const cache = await caches.open(SHELL_CACHE);
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }

          // If navigating to dashboard or subroute, serve cached dashboard shell
          if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/wizard')) {
            const dashboardShell = await cache.match('/dashboard');
            if (dashboardShell) return dashboardShell;
          }

          // Fallback to offline page
          const offlinePage = await cache.match('/offline');
          return (
            offlinePage ||
            new Response(
              '<html><body><h1>KaVa Offline</h1><p>Offline shell active. Open dashboard.</p></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            )
          );
        })
    );
    return;
  }

  // Default: Network with shell cache fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).catch(() => {
          return new Response('', { status: 404 });
        })
      );
    })
  );
});

