'use client'

import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import useTheme from '@/hooks/use-theme'

interface RollNumberSearchProps {
  onSearch: (htno: string) => void
  loading: boolean
  isGreen?: boolean
}

export default function RollNumberSearch({ onSearch, loading, isGreen = false }: RollNumberSearchProps) {
  const [htno, setHtno] = useState('')
  const [error, setError] = useState('')
  const { isTransitioning } = useTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const clean = htno.trim()
    if (clean.length !== 12 || !/^\d{12}$/.test(clean)) {
      setError('Enter a valid 12-digit student roll number')
      return
    }

    onSearch(clean)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setHtno(value)
    setError('')

    if (value.length === 12) {
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
          type="text"
          value={htno}
          onChange={handleInputChange}
          placeholder="Enter 12-digit Roll number"
          maxLength={12}
          autoComplete="off"
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
          disabled={loading || htno.length !== 12}
          aria-label="Search student records"
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

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 animate-in fade-in duration-200">
          {error}
        </p>
      )}
    </form>
  )
}
