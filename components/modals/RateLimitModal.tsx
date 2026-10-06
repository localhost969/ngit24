'use client'

import { AlertCircle, Clock, X } from 'lucide-react'

interface RateLimitModalProps {
  isOpen: boolean
  onClose: () => void
  remaining: number
  resetTime: string
  timeUntilReset: string
}

export default function RateLimitModal({
  isOpen,
  onClose,
  remaining,
  resetTime,
  timeUntilReset,
}: RateLimitModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--color-foreground)]">Search Quota Reached</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
          To maintain zero backend overhead and avoid API abuse, lookups are limited to 3 unique roll numbers per hour. You can still search previously queried roll numbers anytime.
        </p>

        <div className="rounded-xl bg-[var(--color-secondary)]/50 p-3.5 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[var(--color-muted-foreground)]">Unique Slots Remaining</span>
            <span className="font-bold text-[var(--color-foreground)]">{remaining}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border)]/50">
            <span className="text-[var(--color-muted-foreground)] flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Reset Window
            </span>
            <span className="font-semibold text-[var(--color-primary)]">{resetTime || 'Next hour boundary'}</span>
          </div>

          <div className="flex justify-between items-center text-[11px] text-[var(--color-muted-foreground)]">
            <span>Countdown</span>
            <span className="font-mono font-medium text-[var(--color-foreground)]">{timeUntilReset}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[var(--color-primary)] text-white hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-sm"
        >
          Understood
        </button>
      </div>
    </div>
  )
}
