import { useState, useEffect, useCallback } from 'react'
import { ClientRateLimiter } from '@/lib/storage/rate-limiter'
import type { RateLimitStatus } from '@/types/api'

export function useRateLimit() {
  const [modalOpen, setModalOpen] = useState(false)
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitStatus>({
    allowed: true,
    remaining: 3,
    resetTime: 0,
    resetTimeFormatted: '',
    isRepeat: false,
  })
  const [countdown, setCountdown] = useState<string>('')

  const check = useCallback((identifier: string) => {
    const status = ClientRateLimiter.checkLimit(identifier)
    setRateLimitInfo(status)

    if (!status.allowed) {
      setCountdown(ClientRateLimiter.getTimeUntilReset())
      setModalOpen(true)
    }

    return status
  }, [])

  const record = useCallback((identifier: string) => {
    ClientRateLimiter.record(identifier)
  }, [])

  useEffect(() => {
    if (!modalOpen) return

    const interval = setInterval(() => {
      setCountdown(ClientRateLimiter.getTimeUntilReset())
    }, 1000)

    return () => clearInterval(interval)
  }, [modalOpen])

  return {
    isModalOpen: modalOpen,
    openModal: () => setModalOpen(true),
    closeModal: () => setModalOpen(false),
    rateLimitInfo,
    countdown,
    checkRateLimit: check,
    recordSearch: record,
  }
}
