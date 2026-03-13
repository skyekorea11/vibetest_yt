export type NewsFavoriteMap = Record<string, string[]>

const STORAGE_KEY = 'yt.news-favorites.v1'

export function loadNewsFavorites(): NewsFavoriteMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as NewsFavoriteMap
    if (!parsed || typeof parsed !== 'object') return {}
    const sanitized: NewsFavoriteMap = {}
    for (const [videoId, links] of Object.entries(parsed)) {
      if (!Array.isArray(links)) continue
      const unique = [...new Set(links.filter(link => typeof link === 'string' && link.length > 0))]
      if (unique.length > 0) sanitized[videoId] = unique
    }
    return sanitized
  } catch {
    return {}
  }
}

export function saveNewsFavorites(map: NewsFavoriteMap): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {}
}

export function toggleNewsFavorite(
  prev: NewsFavoriteMap,
  videoId: string,
  link: string
): NewsFavoriteMap {
  const current = new Set(prev[videoId] || [])
  if (current.has(link)) current.delete(link)
  else current.add(link)

  const next: NewsFavoriteMap = { ...prev }
  const links = [...current]
  if (links.length === 0) delete next[videoId]
  else next[videoId] = links

  saveNewsFavorites(next)
  return next
}

export function isNewsFavorited(map: NewsFavoriteMap, videoId: string, link: string): boolean {
  return (map[videoId] || []).includes(link)
}

