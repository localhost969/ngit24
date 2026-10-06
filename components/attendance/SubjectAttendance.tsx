'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { SubjectAttendanceData } from '@/types/academic'

interface SubjectAttendanceProps {
  data?: SubjectAttendanceData[]
  loading?: boolean
  isGreen?: boolean
}

export default function SubjectAttendance({ data, loading, isGreen = false }: SubjectAttendanceProps) {
  const [activeTab, setActiveTab] = useState<'cannot-miss' | 'can-miss'>('cannot-miss')

  const containerClass = `rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 transition-all duration-200 ${
    isGreen ? 'outline-glow-green' : 'outline-glow-primary'
  }`

  if (loading) {
    return (
      <section className={`${containerClass} animate-pulse`}>
        <div className="h-4 w-36 rounded bg-[var(--color-secondary)] mb-4" />
        <div className="flex gap-2 mb-4">
          <div className="flex-1 h-9 rounded-lg bg-[var(--color-secondary)]" />
          <div className="flex-1 h-9 rounded-lg bg-[var(--color-secondary)]" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-[var(--color-secondary)]" />
          ))}
        </div>
      </section>
    )
  }

  const items =
    data?.map((subject) => ({
      name: subject.subjectName,
      percentage: parseFloat(subject.attendancePercentage),
      sessions: `${subject.attendedSessions}/${subject.totalSessions}`,
      type: subject.subjectType,
      attended: subject.attendedSessions,
      total: subject.totalSessions,
    })) || []

  const cannotMiss = items.filter((s) => s.percentage < 75).sort((a, b) => a.percentage - b.percentage)
  const canMiss = items.filter((s) => s.percentage >= 75).sort((a, b) => b.percentage - a.percentage)

  const activeItems = activeTab === 'cannot-miss' ? cannotMiss : canMiss

  return (
    <section role="region" aria-label="Subject Attendance Breakdown" className={containerClass}>
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Subject-wise Attendance
        </h3>
        {data && (
          <span
            className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {data.length} subjects
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('cannot-miss')}
          className={`flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === 'cannot-miss'
              ? isGreen
                ? 'bg-[var(--color-green)] text-white shadow-sm'
                : 'bg-[var(--color-primary)] text-white shadow-sm'
              : 'bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
          }`}
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Cannot Miss ({cannotMiss.length})
        </button>
        <button
          onClick={() => setActiveTab('can-miss')}
          className={`flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === 'can-miss'
              ? isGreen
                ? 'bg-[var(--color-green)] text-white shadow-sm'
                : 'bg-[var(--color-primary)] text-white shadow-sm'
              : 'bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
          }`}
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Can Miss ({canMiss.length})
        </button>
      </div>

      {activeItems.length === 0 ? (
        <div className="py-8 text-center text-[var(--color-muted-foreground)]">
          <p className="text-xs sm:text-sm font-medium">
            {activeTab === 'cannot-miss'
              ? 'Excellent! No subjects are currently below 75%.'
              : 'No subjects have reached 75% or above yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="block sm:hidden space-y-2">
            {activeItems.map((subj, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/50"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <h4
                    className="text-xs sm:text-sm font-semibold text-[var(--color-foreground)] truncate"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {subj.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--color-muted-foreground)]">
                    <span>
                      {subj.attended}/{subj.total} sessions
                    </span>
                    <span>•</span>
                    <span className="uppercase font-medium text-[9px]">{subj.type}</span>
                  </div>
                </div>
                <span
                  className="text-sm font-bold text-[var(--color-foreground)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {Math.round(subj.percentage)}%
                </span>
              </div>
            ))}
          </div>

          <div className="hidden sm:block pr-1">
            <ResponsiveContainer width="100%" height={Math.min(Math.max(activeItems.length * 52, 180), 500)}>
              <BarChart
                data={activeItems}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid horizontal stroke="var(--color-border)" strokeOpacity={0.4} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 11, fill: 'var(--color-foreground)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <Tooltip
                  cursor={{ fill: 'var(--color-elevated)', opacity: 0.3 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as any
                      return (
                        <div className="rounded-xl bg-[var(--color-surface)] p-3 shadow-xl border border-[var(--color-border)] text-xs">
                          <p className="font-bold text-[var(--color-foreground)] mb-1">{d.name}</p>
                          <p className="text-[var(--color-muted-foreground)]">
                            {d.attended} of {d.total} attended ({Math.round(d.percentage)}%)
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="percentage"
                  fill={isGreen ? 'var(--color-green)' : 'var(--color-primary)'}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  )
}
