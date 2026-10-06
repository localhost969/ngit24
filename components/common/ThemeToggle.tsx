'use client'

import { Moon, Sun } from 'lucide-react'
import useTheme from '@/hooks/use-theme'

export default function ThemeToggle() {
  const { theme, setTheme, isLoading, isTransitioning } = useTheme()
  const isDark = theme === 'dark'

  const handleToggle = () => {
    if (isLoading || isTransitioning) return
    setTheme(isDark ? 'light' : 'dark')
  }

  if (isLoading) {
    return (
      <div className="h-9 w-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center">
        <div className="h-4 w-4 rounded-full bg-[var(--color-muted-foreground)]/30 animate-pulse" />
      </div>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isTransitioning}
      aria-label={`Toggle to ${isDark ? 'light' : 'dark'} mode`}
      className={`
        relative h-9 w-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]
        flex items-center justify-center text-[var(--color-foreground)] transition-all duration-200
        hover:scale-105 active:scale-95 cursor-pointer shadow-soft
        focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40
      `}
    >
      {isDark ? (
        <Moon className="h-4 w-4 text-[var(--color-foreground)] transition-transform duration-200" />
      ) : (
        <Sun className="h-4 w-4 text-[var(--color-foreground)] transition-transform duration-200" />
      )}
    </button>
  )
}
