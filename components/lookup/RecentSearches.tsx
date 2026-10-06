'use client'

import { useState, useEffect } from 'react'
import { History, X, User } from 'lucide-react'
import { TokenCacheManager } from '@/lib/storage/token-cache'
import { detectDepartment } from '@/lib/utils/formatters'
import useTheme from '@/hooks/use-theme'
import type { RecentSearch } from '@/types/auth'

interface RecentSearchesProps {
  onSearch: (identifier: string, loginType?: RecentSearch['loginType']) => void
  loading: boolean
}

export default function RecentSearches({ onSearch, loading }: RecentSearchesProps) {
  const [searches, setSearches] = useState<RecentSearch[]>([])
  const { isTransitioning } = useTheme()

  useEffect(() => {
    setSearches(TokenCacheManager.getRecentSearches())
  }, [])

  const handleSelect = (entry: RecentSearch) => {
    if (loading) return
    onSearch(entry.htno, entry.loginType)
  }

  const handleRemove = (identifier: string) => {
    TokenCacheManager.evict(identifier)
    setSearches((prev) => prev.filter((item) => item.htno !== identifier))
  }

  if (searches.length === 0) return null

  const displayList = searches.slice(0, 5)

  return (
    <div
      className={`space-y-3 transition-all duration-300 ease-out ${
        isTransitioning ? 'opacity-80 scale-[0.99]' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <History className="h-3.5 w-3.5" />
        </div>
        <h3
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Recent Searches
        </h3>
      </div>

      <div className="grid gap-2">
        {displayList.map((entry) => {
          const dept = detectDepartment(entry.htno)
          return (
            <div
              key={`${entry.htno}-${entry.loginType || 'htno'}`}
              className={`
                group flex items-center justify-between p-3 rounded-xl border
                border-[var(--color-border)] bg-[var(--color-surface)]/60
                hover:bg-[var(--color-surface)] hover:border-[var(--color-primary)]/30
                transition-all duration-200 ease-out active:scale-[0.99]
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div
                className="flex-1 flex items-center gap-3 min-w-0"
                onClick={() => handleSelect(entry)}
              >
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-[var(--color-primary)]" />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-[var(--color-foreground)] truncate"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {entry.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-medium text-[var(--color-muted-foreground)] truncate">
                      {entry.htno} • {entry.collegeName}
                    </span>
                    {dept && (
                      <span className="text-[10px] font-bold text-[var(--color-primary)] px-1.5 py-0.2 bg-[var(--color-primary)]/10 rounded">
                        {dept}
                      </span>
                    )}
                    {entry.loginType && entry.loginType !== 'htno' && (
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)] px-1 bg-[var(--color-secondary)] rounded">
                        {entry.loginType}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(entry.htno)
                }}
                className="p-1 rounded text-[var(--color-muted-foreground)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                aria-label={`Remove ${entry.name} from recent searches`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
