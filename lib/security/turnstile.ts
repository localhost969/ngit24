import { CLOUDFLARE_CONFIG } from '@/config/constants'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        params: {
          sitekey: string
          theme?: 'light' | 'dark' | 'auto'
          callback: (token: string) => void
          'error-callback'?: (errorCode: string) => void
          'expired-callback'?: () => void
        }
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export class CloudflareTurnstileService {
  private static readonly SITE_KEY = CLOUDFLARE_CONFIG.turnstileSiteKey
  private static scriptLoadingPromise: Promise<void> | null = null

  static getSiteKey(): string {
    return this.SITE_KEY
  }

  static async loadScript(): Promise<void> {
    if (typeof window === 'undefined') return

    if (window.turnstile) return

    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise
    }

    this.scriptLoadingPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src*="turnstile/v0/api.js"]')
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve())
        existingScript.addEventListener('error', () => reject(new Error('Failed to load Turnstile script')))
        return
      }

      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Cloudflare Turnstile verification'))
      document.head.appendChild(script)
    })

    return this.scriptLoadingPromise
  }

  static async solveInteractive(): Promise<string> {
    if (typeof window === 'undefined') {
      throw new Error('Verification requires a browser environment')
    }

    await this.loadScript()

    return new Promise((resolve, reject) => {
      const turnstile = window.turnstile
      if (!turnstile) {
        reject(new Error('Cloudflare Turnstile service is unavailable'))
        return
      }

      const overlay = document.createElement('div')
      overlay.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4'

      const card = document.createElement('div')
      card.className = 'relative w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl transition-all'

      const header = document.createElement('div')
      header.className = 'mb-4 text-center'
      header.innerHTML = `
        <h3 class="text-base font-semibold text-[var(--color-foreground)]">Security Verification</h3>
        <p class="text-xs text-[var(--color-muted-foreground)] mt-1">Confirming humanity before issuing token</p>
      `

      const widgetContainer = document.createElement('div')
      widgetContainer.className = 'flex justify-center my-4 min-h-[65px]'
      const widgetId = `cf-turnstile-${Date.now()}`
      widgetContainer.id = widgetId

      const errorText = document.createElement('p')
      errorText.className = 'text-xs text-red-500 text-center mt-2 hidden'

      card.appendChild(header)
      card.appendChild(widgetContainer)
      card.appendChild(errorText)
      overlay.appendChild(card)
      document.body.appendChild(overlay)

      let settled = false

      const cleanup = () => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay)
        }
      }

      try {
        turnstile.render(`#${widgetId}`, {
          sitekey: this.SITE_KEY,
          theme: 'auto',
          callback: (token: string) => {
            if (settled) return
            settled = true
            cleanup()
            resolve(token)
          },
          'error-callback': () => {
            if (settled) return
            errorText.textContent = 'Verification check failed. Please refresh.'
            errorText.classList.remove('hidden')
          },
          'expired-callback': () => {
            if (settled) return
            errorText.textContent = 'Token expired. Please click to verify again.'
            errorText.classList.remove('hidden')
          },
        })
      } catch (err) {
        cleanup()
        reject(err instanceof Error ? err : new Error('Unable to render Turnstile widget'))
      }
    })
  }
}
