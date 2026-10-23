const APP_BASE = new URL('./', self.location.href).pathname
const CACHE_PREFIX = `meridian-app-shell-${APP_BASE.replace(/[^a-z0-9]+/gi, '-')}-`
const CACHE_NAME = `${CACHE_PREFIX}v7`
const SHELL = [APP_BASE, `${APP_BASE}manifest.webmanifest`, `${APP_BASE}brand/meridian-icon-maskable.png`]

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)))))
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return
  if (!new URL(request.url).pathname.startsWith(APP_BASE)) return
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(APP_BASE, response.clone()))
      return response
    }).catch(() => caches.match(APP_BASE)))
    return
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()))
    return response
  })))
})
