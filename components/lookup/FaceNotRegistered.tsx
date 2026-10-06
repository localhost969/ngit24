'use client'

import { Users, AlertCircle } from 'lucide-react'

interface Props {
  themeTransitioning?: boolean
}

export default function FaceNotRegistered({ themeTransitioning = false }: Props) {
  return (
    <div
      className={`
        rounded-xl border border-amber-500/20 bg-amber-500/5
        p-4 transition-all duration-300 ease-out
        ${themeTransitioning ? 'opacity-70' : 'opacity-100'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-1">
            Student Profile Not Registered
          </h3>
          <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
            The student record has not completed biometric registration yet. Try signing in using
            the <strong>Student Mobile</strong> or <strong>Parent Mobile</strong> tab above.
          </p>
        </div>
      </div>
    </div>
  )
}
