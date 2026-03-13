const INTERVAL_MS = 6 * 60 * 60 * 1000 // 6 hours

export interface RefreshStatus {
  lastRefreshed: string | null
  nextRefresh: string | null
  newVideoCount: number
}

const state: RefreshStatus = {
  lastRefreshed: null,
  nextRefresh: new Date(Date.now() + INTERVAL_MS).toISOString(),
  newVideoCount: 0,
}

export function getRefreshStatus(): RefreshStatus {
  return { ...state }
}

export function markRefreshDone(newVideoCount: number) {
  const now = new Date()
  state.lastRefreshed = now.toISOString()
  state.nextRefresh = new Date(now.getTime() + INTERVAL_MS).toISOString()
  state.newVideoCount = newVideoCount
}
