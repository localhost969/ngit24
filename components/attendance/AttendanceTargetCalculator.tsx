'use client'

import { useState, useMemo } from 'react'
import { Calculator, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'
import { calculateAttendanceTarget } from '@/lib/utils/formatters'
import type { SubjectAttendanceData } from '@/types/academic'

interface AttendanceTargetCalculatorProps {
  subjectData?: SubjectAttendanceData[]
  overallPercentage?: string | number
  isGreen?: boolean
}

export default function AttendanceTargetCalculator({
  subjectData = [],
  overallPercentage = 0,
  isGreen = false,
}: AttendanceTargetCalculatorProps) {
  const [targetPercentage, setTargetPercentage] = useState<number>(75)
  const [selectedSubject, setSelectedSubject] = useState<string>('overall')

  // Calculate overall aggregates
  const aggregate = useMemo(() => {
    let attended = 0
    let total = 0
    subjectData.forEach((s) => {
      attended += s.attendedSessions
      total += s.totalSessions
    })
    return { attended, total }
  }, [subjectData])

  const targetMetrics = useMemo(() => {
    if (selectedSubject === 'overall') {
      return calculateAttendanceTarget(aggregate.attended, aggregate.total, targetPercentage)
    }

    const matched = subjectData.find((s) => s.subjectName === selectedSubject)
    if (!matched) {
      return calculateAttendanceTarget(aggregate.attended, aggregate.total, targetPercentage)
    }

    return calculateAttendanceTarget(matched.attendedSessions, matched.totalSessions, targetPercentage)
  }, [selectedSubject, aggregate, subjectData, targetPercentage])

  const containerClass = `rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 transition-all duration-200 ${
    isGreen ? 'outline-glow-green' : 'outline-glow-primary'
  }`

  return (
    <section
      role="region"
      aria-label="Attendance Target Calculator"
      className={containerClass}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <Calculator className="h-4 w-4" />
          </div>
          <h3
            className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Target Attendance Calculator
          </h3>
        </div>

        <div className="flex gap-1 bg-[var(--color-secondary)] p-0.5 rounded-lg">
          {[75, 80, 85].map((target) => (
            <button
              key={target}
              onClick={() => setTargetPercentage(target)}
              className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                targetPercentage === target
                  ? 'bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-sm'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
              }`}
            >
              {target}%
            </button>
          ))}
        </div>
      </div>

      {subjectData.length > 0 && (
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-[var(--color-muted-foreground)] uppercase block mb-1.5">
            Scope
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full text-xs font-medium rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2 px-3 text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          >
            <option value="overall">All Subjects Combined (Overall)</option>
            {subjectData.map((s) => (
              <option key={s.subjectName} value={s.subjectName}>
                {s.subjectName} ({s.attendedSessions}/{s.totalSessions} sessions - {Math.round(parseFloat(s.attendancePercentage))}%)
              </option>
            ))}
          </select>
        </div>
      )}

      <div
        className={`rounded-xl p-4 border transition-all ${
          targetMetrics.status === 'on_track'
            ? 'border-[var(--color-green)]/20 bg-[var(--color-green)]/5'
            : 'border-amber-500/20 bg-amber-500/5'
        }`}
      >
        <div className="flex items-start gap-3">
          {targetMetrics.status === 'on_track' ? (
            <div className="p-1.5 rounded-full bg-[var(--color-green)]/10 text-[var(--color-green)] shrink-0 mt-0.5">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          ) : (
            <div className="p-1.5 rounded-full bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>
          )}

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--color-foreground)]">
              {targetMetrics.status === 'on_track'
                ? `Safety Margin: ${targetMetrics.canMissSessions} session${targetMetrics.canMissSessions === 1 ? '' : 's'} to spare`
                : `Shortage: Need ${targetMetrics.sessionsNeeded} consecutive session${targetMetrics.sessionsNeeded === 1 ? '' : 's'}`}
            </h4>

            <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
              {targetMetrics.status === 'on_track'
                ? `You are currently at ${Math.round(targetMetrics.currentPercentage)}%. You can skip up to ${targetMetrics.canMissSessions} more class${targetMetrics.canMissSessions === 1 ? '' : 'es'} without dropping below ${targetPercentage}%.`
                : `You are currently at ${Math.round(targetMetrics.currentPercentage)}%. You must attend the next ${targetMetrics.sessionsNeeded} class${targetMetrics.sessionsNeeded === 1 ? '' : 'es'} continuously to reach ${targetPercentage}%.`}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--color-border)]/50 flex items-center justify-between text-xs text-[var(--color-muted-foreground)]">
          <span>Current: {Math.round(targetMetrics.currentPercentage)}%</span>
          <ArrowRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-[var(--color-foreground)]">Target: {targetPercentage}%</span>
        </div>
      </div>
    </section>
  )
}
