'use client'

import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import useTheme from '@/hooks/use-theme'

interface SanjayaMobileSearchProps {
  onSearch: (mobile: string) => void
  loading: boolean
  isGreen?: boolean
}

export default function SanjayaMobileSearch({ onSearch, loading, isGreen = false }: SanjayaMobileSearchProps) {
  const [mobile, setMobile] = useState('')
  const [error, setError] = useState('')
  const { isTransitioning } = useTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const clean = mobile.trim()
    if (clean.length !== 10 || !/^\d{10}$/.test(clean)) {
      setError('Enter a valid 10-digit registered parent mobile number')
      return
    }

    onSearch(clean)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setMobile(value)
    setError('')

    if (value.length === 10) {
      onSearch(value)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-2.5 transition-all duration-300 ease-out ${
        isTransitioning ? 'opacity-80 scale-[0.99]' : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative">
        <input
          type="tel"
          value={mobile}
          onChange={handleInputChange}
          placeholder="Enter 10-digit parent mobile number"
          maxLength={10}
          autoComplete="tel"
          inputMode="numeric"
          className={`
            header-title w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]
            py-3 pl-4 pr-14 text-sm sm:text-base transition-all duration-200 ease-out
            placeholder:text-[var(--color-muted-foreground)]
            focus:outline-none focus:ring-2
            ${
              isGreen
                ? 'focus:border-[var(--color-green)] focus:ring-[var(--color-green)]/20'
                : 'focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20'
            }
            hover:border-[var(--color-border)]/80
            disabled:opacity-60 disabled:cursor-not-allowed
            ${loading ? 'opacity-75' : ''}
          `}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || mobile.length !== 10}
          aria-label="Search Sanjaya records"
          className={`
            absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full
            ${
              isGreen
                ? 'bg-[var(--color-green)]/10 hover:bg-[var(--color-green)]/20 active:bg-[var(--color-green)]/30'
                : 'bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 active:bg-[var(--color-primary)]/30'
            }
            rounded-r-xl transition-all duration-200 ease-out cursor-pointer
            disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-transparent
            active:scale-95
          `}
        >
          {loading ? (
            <Loader2
              className={`h-5 w-5 animate-spin ${
                isGreen ? 'text-[var(--color-green)]' : 'text-[var(--color-primary)]'
              }`}
            />
          ) : (
            <Search
              className={`h-5 w-5 ${
                isGreen ? 'text-[var(--color-green)]' : 'text-[var(--color-primary)]'
              } transition-transform hover:scale-110`}
            />
          )}
        </button>
      </div>

      {loading && (
        <p className="text-xs text-[var(--color-muted-foreground)] animate-in fade-in">
          Completing security challenge...
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 animate-in fade-in duration-200">
          {error}
        </p>
      )}
    </form>
  )
}
