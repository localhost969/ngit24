'use client'

import { ExternalLink, ChevronRight } from 'lucide-react'
import { RESULTS_PORTALS } from '@/config/constants'

interface ResultsViewProps {
  onBack?: () => void
}

export default function ResultsView({ onBack }: ResultsViewProps) {
  return (
    <div className="min-h-screen w-full px-4 pb-24 pt-20" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="mx-auto w-full md:max-w-sm space-y-5">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-foreground)]">Examination Results</h2>
          <div className="h-1 w-12 bg-[var(--color-primary)] rounded-full mt-1" />
          <p className="text-xs text-[var(--color-muted-foreground)] mt-2">
            Direct access to official Osmania University examination result portals
          </p>
        </div>

        <div className="space-y-2.5">
          {RESULTS_PORTALS.map((portal) => (
            <a
              key={portal.url}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <ExternalLink className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                  {portal.title}
                </h3>
              </div>
              <ChevronRight className="h-4 w-4 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
