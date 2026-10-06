import type { DecodedTokenPayload } from '@/types/auth'

export function decodeJwt(token: string): DecodedTokenPayload | null {
  if (!token || typeof token !== 'string') return null

  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(jsonPayload) as DecodedTokenPayload
  } catch {
    return null
  }
}

export function getNameFromJwt(token: string): string | null {
  const decoded = decodeJwt(token)
  return decoded?.name || null
}

export function isJwtExpired(token: string): boolean {
  const decoded = decodeJwt(token)
  if (!decoded?.exp) return false

  const currentTimeInSeconds = Math.floor(Date.now() / 1000)
  return decoded.exp < currentTimeInSeconds
}
