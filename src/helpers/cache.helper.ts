export function loadCacheJsonIfAny(key: string) {
  const items = localStorage.getItem(key) || null

  if (items) {
    try {
      return JSON.parse(items)
    } catch (error) {}
  }
}
