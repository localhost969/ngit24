import { CLOUDFLARE_CONFIG } from './constants'

export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  turnstileSiteKey: CLOUDFLARE_CONFIG.turnstileSiteKey,
  vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL || '',
} as const
