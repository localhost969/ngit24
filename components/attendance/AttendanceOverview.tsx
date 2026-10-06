'use client'

import React, { useMemo } from 'react'
import type { AttendanceDetail } from '@/types/academic'

interface AttendanceOverviewProps {
  overallPercentage?: string | number
  attendanceDetails?: AttendanceDetail[]
  loading?: boolean
  className?: string
  isGreen?: boolean
}

const RADIUS = 12.9155
const STROKE = 2.5
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const clamp = (val: number, min = 0, max = 100) => Math.max(min, Math.min(max, val))

function StatusLabel({ percentage }: { percentage: number }) {
  if (percentage >= 75) return <span>On Track (Safe Margin)</span>
  if (percentage >= 65) return <span>Borderline Warning</span>
  return <span>Critical Shortage</span>
}

export default function AttendanceOverview({
  overallPercentage = 0,
  loading = false,
  className = '',
  isGreen,
}: AttendanceOverviewProps) {
  const numeric = useMemo(() => {
    const parsed =
      typeof overallPercentage === 'number'
        ? overallPercentage
        : parseFloat(String(overallPercentage || '0'))
    return clamp(Number.isFinite(parsed) ? parsed : 0)
  }, [overallPercentage])

  const qualifiesForGreen = typeof isGreen === 'boolean' ? isGreen : numeric >= 75

  const strokeDashoffset = useMemo(() => {
    return CIRCUMFERENCE * (1 - numeric / 100)
  }, [numeric])

  if (loading) {
    return (
      <div className={`grid gap-3 ${className}`}>
        <div
          aria-hidden="true"
          className="animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 flex flex-col items-center justify-center min-h-[240px]"
        >
          <div className="h-3 w-32 rounded bg-[var(--color-secondary)] mb-6" />
          <div className="h-36 w-36 rounded-full border-4 border-[var(--color-secondary)]" />
          <div className="h-3 w-24 rounded bg-[var(--color-secondary)] mt-6" />
        </div>
      </div>
    )
  }

  return (
    <section
      role="region"
      aria-label="Overall Academic Attendance"
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 transition-all duration-200 overflow-hidden relative flex flex-col items-center text-center ${
        qualifiesForGreen ? 'outline-glow-green' : 'outline-glow-primary'
      } ${className}`}
    >
      <h3
        className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        Overall Attendance
      </h3>

      <div className="relative flex items-center justify-center my-2" style={{ width: 160, height: 160 }}>
        <svg viewBox="0 0 36 36" className="h-40 w-40 -rotate-90" aria-hidden="true">
          <circle
            cx="18"
            cy="18"
            r={RADIUS}
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth={STROKE}
          />
          <circle
            cx="18"
            cy="18"
            r={RADIUS}
            fill="none"
            stroke={qualifiesForGreen ? 'var(--color-green)' : 'var(--color-primary)'}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 700ms cubic-bezier(0.2, 0.9, 0.2, 1)',
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-4xl font-extrabold leading-none"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}
          >
            {Math.round(numeric)}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <span
          className={`h-2 w-2 rounded-full ${
            qualifiesForGreen ? 'bg-[var(--color-green)] shadow-sm' : 'bg-[var(--color-primary)]'
          }`}
        />
        <span
          className="text-xs sm:text-sm font-medium text-[var(--color-muted-foreground)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <StatusLabel percentage={numeric} />
        </span>
      </div>
    </section>
  )
}
