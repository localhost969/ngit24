'use client'

import useTheme from '@/hooks/use-theme'
import type { LoginType } from '@/types/auth'

interface LookupTabsProps {
  activeTab: LoginType
  onTabChange: (tab: LoginType) => void
}

interface TabItem {
  id: LoginType
  label: string
  subtitle: string
  badge?: string
}

const TABS: TabItem[] = [
  {
    id: 'htno',
    label: 'Roll No.',
    subtitle: 'Direct search via 12-digit student hall ticket',
    badge: 'Fastest',
  },
  {
    id: 'netra',
    label: 'Student Mobile',
    subtitle: 'Netra portal login with student registered number',
  },
  {
    id: 'sanjaya',
    label: 'Parent Mobile',
    subtitle: 'Sanjaya portal login with parent registered number',
  },
]

export default function LookupTabs({ activeTab, onTabChange }: LookupTabsProps) {
  const { isTransitioning } = useTheme()

  return (
    <div
      className={`space-y-3 transition-all duration-300 ease-out ${
        isTransitioning ? 'opacity-80 scale-[0.99]' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex border-b border-[var(--color-border)] gap-1 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group relative flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold tracking-wide
                transition-all duration-200 border-b-2 whitespace-nowrap cursor-pointer
                ${
                  isActive
                    ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                    : 'text-[var(--color-muted-foreground)] border-transparent hover:text-[var(--color-foreground)] hover:border-[var(--color-border)]'
                }
              `}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
                      : 'bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-[var(--color-muted-foreground)] px-0.5">
        {TABS.find((t) => t.id === activeTab)?.subtitle}
      </p>
    </div>
  )
}
