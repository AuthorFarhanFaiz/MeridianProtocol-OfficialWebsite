const APP_BASE = new URL('./', self.location.href).pathname
const CACHE_PREFIX = `meridian-app-shell-${APP_BASE.replace(/[^a-z0-9]+/gi, '-')}-`
const CACHE_NAME = `${CACHE_PREFIX}v13`
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
  const url = new URL(request.url)
  if (!url.pathname.startsWith(APP_BASE)) return
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(APP_BASE, response.clone()))
      return response
    }).catch(() => caches.match(APP_BASE)))
    return
  }
  const networkUrl = new URL(request.url)
  if (networkUrl.pathname.endsWith('/index-CMPWtBVI.js')) networkUrl.searchParams.set('mpReactRuntime', '0b6696b')
  const networkRequest = networkUrl.href === request.url ? request : new Request(networkUrl.href, request)
  event.respondWith(caches.match(request).then(cached => cached || fetch(networkRequest).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()))
    return response
  })))
})
