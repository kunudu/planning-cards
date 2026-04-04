/* ============================================================
   Planning Cards — sw.js
   Phase 8: Service Worker — cache-first offline strategy
   ============================================================ */

'use strict';

const CACHE  = 'planning-cards-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './logo.svg',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// ── Install: pre-cache all static assets ─────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  // Activate immediately, don't wait for old SW to be released
  self.skipWaiting();
});

// ── Activate: purge stale caches ─────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  // Take control of all open clients immediately
  self.clients.claim();
});

// ── Fetch: cache-first, fall back to network ─────────────────
self.addEventListener('fetch', event => {
  // Only handle GET requests; skip cross-origin requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      // Not in cache — fetch from network and cache the response
      return fetch(event.request).then(response => {
        // Only cache valid same-origin responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, toCache));
        return response;
      });
    })
  );
});
