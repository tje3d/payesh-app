/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, prerendered, version } from '$service-worker'

const worker = self as unknown as ServiceWorkerGlobalScope
const KEY_FILES = `cache${version}`
const KEY_FONTS = `fonts`
const KEY_DRACO = `draco`

const to_cache = build.concat(['/manifest.json', '/favicon.png']).concat(prerendered)

const staticAssets = new Set(to_cache.concat(files).concat(['/']))

worker.addEventListener('install', (event) => {
  // Create a new cache and add all files to it
  async function addFilesToCache() {
    const cache = await caches.open(KEY_FILES)
    await cache.addAll(to_cache)
    worker.skipWaiting()
  }

  event.waitUntil(addFilesToCache())
})

worker.addEventListener('activate', (event) => {
  // Remove previous cached data from disk
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== KEY_FILES && key !== KEY_FONTS && key !== KEY_DRACO) {
        await caches.delete(key)
      }
    }

    worker.clients.claim()
  }

  event.waitUntil(deleteOldCaches())
})

/**
 * Fetch the asset from the network and store it in the cache.
 * Fall back to the cache if the user is offline.
 */
async function fetchAndCache(request: Request, cacheName: string) {
  const cache = await caches.open(cacheName)

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

  // ignore POST requests etc
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
  const isVersionJson = !!url.pathname.match(/version\.json$/)
  const isDraco = !!url.pathname.match(/draco_decoder\.wasm$|draco_wasm_wrapper\.js$/)

  if (isStaticAsset || isImage || isFont || isDraco || (isJson && !isVersionJson)) {
    event.respondWith(
      (async () => {
        // always serve static files and bundler-generated assets from cache.
        // if your application has other URLs with data that will never change,
        // set this variable to true for them and they will only be fetched once.
        const cachedAsset = await caches.match(event.request)
        let cacheKey: string | undefined

        if (isFont) {
          cacheKey = KEY_FONTS
        } else if (isDraco) {
          cacheKey = KEY_DRACO
        } else {
          cacheKey = KEY_FILES
        }

        return cachedAsset || fetchAndCache(event.request, cacheKey)
      })(),
    )
  }
})
