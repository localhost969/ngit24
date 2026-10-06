import { RATE_LIMIT_CONFIG } from '@/config/constants'
import type { RateLimitStatus } from '@/types/api'

interface RateLimitStore {
  count: number
  resetTime: number
  searchedIdentifiers: string[]
}

function getNextHourBoundary(): number {
  const now = new Date()
  const nextHour = new Date(now)
  nextHour.setHours(now.getHours() + 1, 0, 0, 0)
  return nextHour.getTime()
}

function formatResetTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  })
}

export class ClientRateLimiter {
  private static readonly KEY = RATE_LIMIT_CONFIG.storageKey
  private static readonly MAX_UNIQUE = RATE_LIMIT_CONFIG.maxUniqueSearchesPerHour

  private static readStore(): RateLimitStore {
    if (typeof window === 'undefined') {
      return { count: 0, resetTime: getNextHourBoundary(), searchedIdentifiers: [] }
    }

    try {
      const raw = localStorage.getItem(this.KEY)
      if (!raw) {
        return { count: 0, resetTime: getNextHourBoundary(), searchedIdentifiers: [] }
      }

      const store: RateLimitStore = JSON.parse(raw)
      if (Date.now() >= store.resetTime) {
        return { count: 0, resetTime: getNextHourBoundary(), searchedIdentifiers: [] }
      }

      return store
    } catch {
      return { count: 0, resetTime: getNextHourBoundary(), searchedIdentifiers: [] }
    }
  }

  private static writeStore(store: RateLimitStore): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(this.KEY, JSON.stringify(store))
    } catch {
      // Storage quota or privacy mode error
    }
  }

  static checkLimit(identifier: string): RateLimitStatus {
    const store = this.readStore()
    const isRepeat = store.searchedIdentifiers.includes(identifier)

    if (isRepeat) {
      return {
        allowed: true,
        remaining: Math.max(0, this.MAX_UNIQUE - store.count),
        resetTime: store.resetTime,
        resetTimeFormatted: formatResetTimestamp(store.resetTime),
        isRepeat: true,
      }
    }

    const allowed = store.count < this.MAX_UNIQUE
    const remaining = Math.max(0, this.MAX_UNIQUE - store.count)

    return {
      allowed,
      remaining,
      resetTime: store.resetTime,
      resetTimeFormatted: formatResetTimestamp(store.resetTime),
      isRepeat: false,
    }
  }

  static record(identifier: string): void {
    const store = this.readStore()
    if (!store.searchedIdentifiers.includes(identifier)) {
      store.count += 1
      store.searchedIdentifiers.push(identifier)
      this.writeStore(store)
    }
  }

  static getTimeUntilReset(): string {
    const store = this.readStore()
    const diff = store.resetTime - Date.now()

    if (diff <= 0) return 'now'

    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)

    if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`
    }
    return `${seconds} second${seconds !== 1 ? 's' : ''}`
  }

  static reset(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(this.KEY)
    } catch {
      // Ignore
    }
  }
}
