'use client'

import { useState } from 'react'
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import { formatAttendanceDate } from '@/lib/utils/formatters'
import type { AttendanceDetail } from '@/types/academic'

interface AttendanceCalendarProps {
  data?: AttendanceDetail[]
  loading?: boolean
  isGreen?: boolean
}

export default function AttendanceCalendar({ data, loading, isGreen = false }: AttendanceCalendarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const containerClass = `rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 transition-all duration-200 ${
    isGreen ? 'outline-glow-green' : 'outline-glow-primary'
  }`

  if (loading) {
    return (
      <section className={`${containerClass} animate-pulse`}>
        <div className="h-4 w-36 rounded bg-[var(--color-secondary)] mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-[var(--color-secondary)]" />
          ))}
        </div>
      </section>
    )
  }

  const todayEntry = data?.find((day) => day.date === 'Today')
  const historicalEntries = data?.filter((day) => day.date !== 'Today') || []

  return (
    <section role="region" aria-label="Day-wise Attendance Timeline" className={containerClass}>
      <div className="flex justify-between items-center mb-4">
        <h3
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Day-wise Attendance
        </h3>

        {historicalEntries.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 text-[var(--color-foreground)] transition-colors cursor-pointer`}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                <span>Show More ({historicalEntries.length})</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {todayEntry && (
          <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5">
            <span
              className="text-xs sm:text-sm font-bold min-w-[70px] text-[var(--color-foreground)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {formatAttendanceDate(todayEntry.date)}
            </span>
            <div className="flex gap-1.5 flex-1 justify-end overflow-x-auto">
              {todayEntry.periods.map((period) => (
                <PeriodPill key={period.period_no} status={period.status} periodNo={period.period_no} />
              ))}
            </div>
          </div>
        )}

        {isExpanded &&
          historicalEntries.map((day) => (
            <div
              key={day.date}
              className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/50"
            >
              <span
                className="text-xs font-semibold min-w-[70px] text-[var(--color-muted-foreground)]"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {formatAttendanceDate(day.date)}
              </span>
              <div className="flex gap-1.5 flex-1 justify-end overflow-x-auto">
                {day.periods.map((period) => (
                  <PeriodPill key={period.period_no} status={period.status} periodNo={period.period_no} />
                ))}
              </div>
            </div>
          ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex flex-wrap items-center gap-4 text-[11px] text-[var(--color-muted-foreground)]">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full border border-[var(--color-green)] text-[var(--color-green)] flex items-center justify-center">
            <Check className="h-2 w-2" />
          </span>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full border border-red-500 text-red-500 flex items-center justify-center">
            <X className="h-2 w-2" />
          </span>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)]" />
          <span>No Class</span>
        </div>
      </div>
    </section>
  )
}

function PeriodPill({ status, periodNo }: { status: number; periodNo: number }) {
  if (status === 1) {
    return (
      <div
        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-[var(--color-green)] text-[var(--color-green)] bg-[var(--color-green)]/10 flex items-center justify-center shrink-0"
        title={`Period ${periodNo}: Present`}
      >
        <Check className="h-3 w-3" strokeWidth={2.5} />
      </div>
    )
  }

  if (status === 0) {
    return (
      <div
        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-red-500 text-red-500 bg-red-500/10 flex items-center justify-center shrink-0"
        title={`Period ${periodNo}: Absent`}
      >
        <X className="h-3 w-3" strokeWidth={2.5} />
      </div>
    )
  }

  return (
    <div
      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)]/50 shrink-0"
      title={`Period ${periodNo}: No Class`}
    />
  )
}
