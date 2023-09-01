/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, prerendered, version } from '$service-worker'

const worker = self as unknown as ServiceWorkerGlobalScope
const FILES = `cache${version}`

const to_cache = build.concat(['/', '/manifest.json', '/favicon.png']).concat(prerendered)

const staticAssets = new Set(to_cache.concat(files).concat(['/']))

worker.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    worker.skipWaiting()
  }
})

worker.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(FILES)
      .then((cache) => cache.addAll(to_cache))
      .then(() => {
        worker.skipWaiting()
      }),
  )
})

worker.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      // delete old caches
      for (const key of keys) {
        if (key !== FILES) await caches.delete(key)
      }

      worker.clients.claim()
    }),
  )
})

/**
 * Fetch the asset from the network and store it in the cache.
 * Fall back to the cache if the user is offline.
 */
async function fetchAndCache(request: Request) {
  const cache = await caches.open(FILES)

  try {
    const response = await fetch(request)
    cache.put(request, response.clone())
    return response
  } catch (err) {
    const response = await cache.match(request)
    if (response) return response

    throw err
  }
}

worker.addEventListener('fetch', (event) => {
  if (self.location.hostname === 'localhost') {
    return
  }

  if (event.request.method !== 'GET' || event.request.headers.has('range')) return

  const url = new URL(event.request.url)

  // don't try to handle e.g. data: URIs
  const isHttp = url.protocol.startsWith('http')

  if (!isHttp) {
    return
  }

  const isStaticAsset = staticAssets.has(url.pathname)
  const isImage = !!url.pathname.match(/\.png$|\.jpg$|\.jpeg$|\.webp$/)
  const isFont = !!url.pathname.match(/\.woff$/)
  const isJson = !!url.pathname.match(/\.json$/)

  if (isStaticAsset || isImage || isFont || isJson) {
    event.respondWith(
      (async () => {
        // always serve static files and bundler-generated assets from cache.
        // if your application has other URLs with data that will never change,
        // set this variable to true for them and they will only be fetched once.
        const cachedAsset = await caches.match(event.request)

        return cachedAsset || fetchAndCache(event.request)
      })(),
    )
  }
})
