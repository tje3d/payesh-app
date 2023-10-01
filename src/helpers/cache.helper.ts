export function loadCacheJsonIfAny(key: string) {
  const items = localStorage.getItem(key) || null

  if (items) {
    try {
      return JSON.parse(items)
    } catch (error) {}
  }
}

export function saveCache(config: CacheConfig, data: any) {
  const key = typeof config === 'string' ? config : config.key

  if (!data) {
    localStorage.removeItem(key)
  } else {
    if (typeof data === 'object') {
      localStorage.setItem(key, JSON.stringify(data))
    } else {
      localStorage.setItem(key, data)
    }
  }
}

export function loadCache(config: CacheConfig, json: boolean = true) {
  const result = localStorage.getItem(typeof config === 'string' ? config : config.key)

  if (result) {
    if (json) {
      try {
        return JSON.parse(result) as any
      } catch (error) {}
    }
  }

  return result as any
}

export type CacheConfig =
  | string
  | {
      key: string
    }
