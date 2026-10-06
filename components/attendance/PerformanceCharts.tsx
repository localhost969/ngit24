'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { BarChart3 } from 'lucide-react'
import type { SubjectAttendanceData } from '@/types/academic'

interface PerformanceChartsProps {
  subjectData?: SubjectAttendanceData[]
  isGreen?: boolean
}

export default function PerformanceCharts({ subjectData = [], isGreen = false }: PerformanceChartsProps) {
  const chartMetrics = useMemo(() => {
    let theoryAttended = 0
    let theoryTotal = 0
    let labAttended = 0
    let labTotal = 0

    subjectData.forEach((sub) => {
      if (sub.subjectType === 'LAB') {
        labAttended += sub.attendedSessions
        labTotal += sub.totalSessions
      } else {
        theoryAttended += sub.attendedSessions
        theoryTotal += sub.totalSessions
      }
    })

    const theoryPct = theoryTotal > 0 ? (theoryAttended / theoryTotal) * 100 : 0
    const labPct = labTotal > 0 ? (labAttended / labTotal) * 100 : 0

    return [
      {
        category: 'Theory Subjects',
        percentage: Math.round(theoryPct),
        attended: theoryAttended,
        total: theoryTotal,
      },
      {
        category: 'Practical Labs',
        percentage: Math.round(labPct),
        attended: labAttended,
        total: labTotal,
      },
    ]
  }, [subjectData])

  if (subjectData.length === 0) return null

  const containerClass = `rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 transition-all duration-200 ${
    isGreen ? 'outline-glow-green' : 'outline-glow-primary'
  }`

  return (
    <section role="region" aria-label="Academic Performance Analytics" className={containerClass}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <BarChart3 className="h-4 w-4" />
        </div>
        <h3
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Performance Analytics (Theory vs Lab)
        </h3>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.4} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="rounded-xl bg-[var(--color-surface)] p-3 shadow-xl border border-[var(--color-border)] text-xs">
                      <p className="font-bold text-[var(--color-foreground)] mb-1">{data.category}</p>
                      <p className="text-[var(--color-muted-foreground)]">
                        Attendance: <span className="font-semibold text-[var(--color-foreground)]">{data.percentage}%</span>
                      </p>
                      <p className="text-[var(--color-muted-foreground)]">
                        Sessions: {data.attended}/{data.total}
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
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[var(--color-border)] text-center">
        {chartMetrics.map((item) => (
          <div key={item.category} className="p-2 rounded-lg bg-[var(--color-secondary)]/50">
            <span className="text-[11px] text-[var(--color-muted-foreground)] block">{item.category}</span>
            <span className="text-sm font-bold text-[var(--color-foreground)]">
              {item.percentage}% <span className="text-[10px] font-normal text-[var(--color-muted-foreground)]">({item.attended}/{item.total})</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
