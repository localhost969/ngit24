'use client'

import ThemeToggle from './ThemeToggle'
import useTheme from '@/hooks/use-theme'

interface HeaderProps {
  college?: string
  onLogoClick?: () => void
}

export default function Header({ college = 'NGIT', onLogoClick }: HeaderProps) {
  const { isTransitioning } = useTheme()

  return (
    <header
      className={`fixed top-0 z-50 w-full bg-[var(--color-background)]/80 backdrop-blur-md transition-all duration-300 border-b border-[var(--color-border)] ${
        isTransitioning ? 'opacity-90' : 'opacity-100'
      }`}
      role="banner"
    >
      <div className="flex h-16 items-center justify-between px-4 mx-auto w-full md:max-w-sm">
        <div
          onClick={onLogoClick}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <span
            className="text-base sm:text-lg font-bold tracking-wider text-[var(--color-foreground)]"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {college}
          </span>
          <div className="h-4 w-px bg-[var(--color-border)]" />
          <h1
            className="text-xs sm:text-sm font-semibold tracking-wider text-[var(--color-muted-foreground)] uppercase"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Student Tracker
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
