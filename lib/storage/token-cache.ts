import { CACHE_CONFIG } from '@/config/constants'
import type { RecentSearch, TokenData } from '@/types/auth'

export class TokenCacheManager {
  private static readonly STORAGE_KEY = CACHE_CONFIG.tokenStorageKey
  private static readonly TTL_MS = CACHE_CONFIG.tokenTtlMs
  private static readonly MAX_ENTRIES = CACHE_CONFIG.maxRecentSearches

  static getRecentSearches(): RecentSearch[] {
    if (typeof window === 'undefined') return []

    try {
      const serialized = localStorage.getItem(this.STORAGE_KEY)
      if (!serialized) return []

      const parsed: RecentSearch[] = JSON.parse(serialized)
      const now = Date.now()

      // Automatically prune items older than the 6-hour TTL
      const validEntries = parsed.filter((item) => now - item.timestamp <= this.TTL_MS)

      if (validEntries.length !== parsed.length) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validEntries))
      }

      return validEntries
    } catch {
      return []
    }
  }

  static getValidToken(identifier: string, loginType?: string): string | null {
    const entries = this.getRecentSearches()
    const match = entries.find(
      (entry) => entry.htno === identifier && (!loginType || entry.loginType === loginType)
    )

    if (!match) return null

    if (Date.now() - match.timestamp > this.TTL_MS) {
      this.evict(identifier)
      return null
    }

    return match.token
  }

  static saveToken(identifier: string, tokenData: TokenData, loginType: 'htno' | 'netra' | 'sanjaya' = 'htno'): void {
    if (typeof window === 'undefined') return

    try {
      const searches = this.getRecentSearches()
      const existingIndex = searches.findIndex(
        (entry) => entry.htno === identifier && (!loginType || entry.loginType === loginType)
      )

      const entry: RecentSearch = {
        htno: identifier,
        name: tokenData.name,
        collegeName: tokenData.collegeName || 'NGIT',
        timestamp: Date.now(),
        token: tokenData.access_token,
        loginType,
      }

      if (existingIndex >= 0) {
        searches[existingIndex] = entry
      } else {
        searches.unshift(entry)
      }

      const trimmed = searches.slice(0, this.MAX_ENTRIES)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed))
    } catch (err) {
      console.warn('Storage write failed for token cache:', err)
    }
  }

  static evict(identifier: string): void {
    if (typeof window === 'undefined') return

    try {
      const remaining = this.getRecentSearches().filter((entry) => entry.htno !== identifier)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(remaining))
    } catch {
      // Ignore storage errors during eviction
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch {
      // Ignore
    }
  }
}
