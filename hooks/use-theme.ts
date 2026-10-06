import { useEffect, useState, useCallback } from 'react'

export type Theme = 'light' | 'dark'

const THEME_TOKENS: Record<Theme, Record<string, string>> = {
  light: {
    '--color-background': '#ffffff',
    '--color-surface': '#fefefe',
    '--color-elevated': '#f9fafb',
    '--color-border': 'rgba(0, 0, 0, 0.08)',
    '--color-foreground': '#111111',
    '--color-muted': '#6b6b6b',
    '--color-muted-foreground': 'rgba(17, 17, 17, 0.6)',
    '--color-primary': '#f59e0b',
    '--color-primary-foreground': '#ffffff',
    '--color-secondary': '#f3f4f6',
    '--color-secondary-foreground': '#111111',
    '--color-accent': '#f59e0b',
    '--color-gradient-start': '#fef3c7',
    '--color-gradient-end': '#ffffff',
    '--shadow-soft': '0 1px 2px rgba(245,158,11,0.1), 0 4px 12px rgba(245,158,11,0.08)',
  },
  dark: {
    '--color-background': '#0f0f0f',
    '--color-surface': '#1a1a1a',
    '--color-elevated': '#262626',
    '--color-border': 'rgba(255, 255, 255, 0.08)',
    '--color-foreground': '#f5f5f5',
    '--color-muted': '#a3a3a3',
    '--color-muted-foreground': 'rgba(245, 245, 245, 0.6)',
    '--color-primary': '#fbbf24',
    '--color-primary-foreground': '#92400e',
    '--color-secondary': '#2a2a2a',
    '--color-secondary-foreground': '#f5f5f5',
    '--color-accent': '#fbbf24',
    '--color-gradient-start': '#1a1a1a',
    '--color-gradient-end': '#0f0f0f',
    '--shadow-soft': '0 1px 2px rgba(251,191,36,0.2), 0 6px 20px rgba(251,191,36,0.15)',
  },
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light')
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const applyThemeTokens = useCallback((activeTheme: Theme) => {
    if (typeof document === 'undefined') return

    const tokens = THEME_TOKENS[activeTheme]
    for (const [key, val] of Object.entries(tokens)) {
      document.documentElement.style.setProperty(key, val)
    }

    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    const saved = localStorage.getItem('theme-v2') as Theme | null
    const initialTheme: Theme = saved === 'dark' || saved === 'light' ? saved : 'light'

    setThemeState(initialTheme)
    applyThemeTokens(initialTheme)
    setIsLoading(false)
  }, [applyThemeTokens])

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      if (typeof window === 'undefined') return

      setIsTransitioning(true)
      setThemeState(nextTheme)
      applyThemeTokens(nextTheme)

      try {
        localStorage.setItem('theme-v2', nextTheme)
      } catch {
        // Ignore storage quotas
      }

      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 400)

      return () => clearTimeout(timer)
    },
    [applyThemeTokens]
  )

  return {
    theme,
    setTheme,
    isLoading,
    isTransitioning,
  }
}

export default useTheme
