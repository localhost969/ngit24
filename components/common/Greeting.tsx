'use client'

import { useMemo } from 'react'

interface GreetingProps {
  htno?: string | null
  name?: string | null
  isGreen?: boolean
}

export default function Greeting({ htno, name, isGreen = false }: GreetingProps) {
  const greetingText = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  if (!name && !htno) {
    return (
      <div
        className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)] tracking-tight"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {greetingText}
      </div>
    )
  }

  const displayName = name || htno

  return (
    <div
      className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)] tracking-tight"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      {greetingText},{' '}
      <span
        className={`bg-gradient-to-r ${
          isGreen
            ? 'from-[var(--color-green)] to-[var(--color-green)]'
            : 'from-[var(--color-primary)] to-[var(--color-accent)]'
        } bg-clip-text text-transparent`}
      >
        {displayName}
      </span>
      !
    </div>
  )
}
