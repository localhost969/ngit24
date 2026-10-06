'use client'

import Image from 'next/image'

interface CalendarViewProps {
  onBack?: () => void
}

export default function CalendarView({ onBack }: CalendarViewProps) {
  return (
    <div className="min-h-screen w-full px-4 pb-24 pt-20" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="mx-auto w-full md:max-w-sm space-y-6">
        <section>
          <div className="mb-3">
            <h2 className="text-xl font-bold text-[var(--color-foreground)]">Academic Almanac</h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] rounded-full mt-1" />
          </div>
          <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-md">
            <Image
              src="/almanac.jpg"
              alt="College Academic Almanac"
              width={800}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        </section>

        <section>
          <div className="mb-3">
            <h2 className="text-xl font-bold text-[var(--color-foreground)]">Official Holidays</h2>
            <div className="h-1 w-12 bg-[var(--color-primary)] rounded-full mt-1" />
          </div>
          <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-md">
            <Image
              src="/holidays.jpg"
              alt="Academic Year Holidays"
              width={800}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        </section>
      </div>
    </div>
  )
}
