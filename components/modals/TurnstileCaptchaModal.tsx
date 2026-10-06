'use client'

import { useState, useEffect } from 'react'
import { Shield, Loader2 } from 'lucide-react'
import { CloudflareTurnstileService } from '@/lib/security/turnstile'

interface TurnstileCaptchaModalProps {
  isOpen: boolean
  onComplete: (token: string) => void
  onError: (error: string) => void
  onClose?: () => void
}

export default function TurnstileCaptchaModal({
  isOpen,
  onComplete,
  onError,
}: TurnstileCaptchaModalProps) {
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsVerifying(false)
      return
    }

    let isMounted = true
    setIsVerifying(true)

    CloudflareTurnstileService.solveInteractive()
      .then((token) => {
        if (isMounted) {
          setIsVerifying(false)
          onComplete(token)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setIsVerifying(false)
          onError(err instanceof Error ? err.message : 'Verification failed')
        }
      })

    return () => {
      isMounted = false
    }
  }, [isOpen, onComplete, onError])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

      <div className="relative w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
          <Shield className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-base font-bold text-[var(--color-foreground)]">Security Check</h3>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
            Verifying your request with Cloudflare Turnstile
          </p>
        </div>

        {isVerifying && (
          <div className="flex items-center justify-center gap-2 py-2 text-xs text-[var(--color-muted-foreground)]">
            <Loader2 className="w-4 h-4 animate-spin text-[var(--color-primary)]" />
            <span>Verifying browser challenge...</span>
          </div>
        )}
      </div>
    </div>
  )
}
