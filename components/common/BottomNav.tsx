'use client'

import { Home as HomeIcon, Calendar, FileText } from 'lucide-react'
import useTheme from '@/hooks/use-theme'

export type ActiveView = 'home' | 'calendar' | 'results'

interface BottomNavProps {
  activeView: ActiveView
  onNavigate: (view: ActiveView) => void
}

export default function BottomNav({ activeView, onNavigate }: BottomNavProps) {
  const { isTransitioning } = useTheme()

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 z-50 md:left-1/2 md:transform md:-translate-x-1/2 w-full md:max-w-sm bg-[var(--color-background)]/90 backdrop-blur-md border-t border-[var(--color-border)] transition-all duration-300 ${
        isTransitioning ? 'opacity-90' : 'opacity-100'
      }`}
    >
      <nav className="flex items-center justify-around h-16 px-4" aria-label="Bottom Navigation">
        <button
          onClick={() => onNavigate('home')}
          className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all hover:bg-[var(--color-secondary)] active:scale-95 cursor-pointer"
        >
          <HomeIcon
            className={`h-5 w-5 transition-colors ${
              activeView === 'home' ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted-foreground)]'
            }`}
          />
          <span
            className={`text-[10px] font-semibold tracking-wider transition-colors ${
              activeView === 'home' ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted-foreground)]'
            }`}
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Home
          </span>
        </button>

        <button
          onClick={() => onNavigate('calendar')}
          className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all hover:bg-[var(--color-secondary)] active:scale-95 cursor-pointer"
        >
          <Calendar
            className={`h-5 w-5 transition-colors ${
              activeView === 'calendar' ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted-foreground)]'
            }`}
          />
          <span
            className={`text-[10px] font-semibold tracking-wider transition-colors ${
              activeView === 'calendar' ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted-foreground)]'
            }`}
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Calendar
          </span>
        </button>

        <button
          onClick={() => onNavigate('results')}
          className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all hover:bg-[var(--color-secondary)] active:scale-95 cursor-pointer"
        >
          <FileText
            className={`h-5 w-5 transition-colors ${
              activeView === 'results' ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted-foreground)]'
            }`}
          />
          <span
            className={`text-[10px] font-semibold tracking-wider transition-colors ${
              activeView === 'results' ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted-foreground)]'
            }`}
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Results
          </span>
        </button>
      </nav>
    </footer>
  )
}
