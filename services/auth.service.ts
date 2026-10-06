import { API_ENDPOINTS } from '@/config/constants'
import { TokenCacheManager } from '@/lib/storage/token-cache'
import { CloudflareTurnstileService } from '@/lib/security/turnstile'
import { decodeJwt } from '@/lib/security/jwt'
import { postJson, ApiError } from './api-client'
import type { LoginType } from '@/types/auth'

export class AuthService {
  /**
   * Retrieves a valid JWT token for the requested identifier.
   * Checks the client-side 6-hour cache first. If a fresh token is required,
   * triggers Cloudflare Turnstile verification and queries the edge authentication worker.
   */
  static async acquireToken(identifier: string, loginType: LoginType): Promise<string> {
    const cachedToken = TokenCacheManager.getValidToken(identifier, loginType)
    if (cachedToken) {
      return cachedToken
    }

    const captchaToken = await CloudflareTurnstileService.solveInteractive()

    if (loginType === 'htno') {
      return this.fetchRollNumberToken(identifier, captchaToken)
    }

    return this.fetchMobileToken(identifier, loginType, captchaToken)
  }

  private static async fetchRollNumberToken(htno: string, captchaToken: string): Promise<string> {
    const data = await postJson<{ access_token: string; username: string; collegeName?: string }>(
      API_ENDPOINTS.authRollNumber,
      {
        h: htno,
        token: captchaToken,
      }
    )

    if (!data.access_token) {
      throw new ApiError('Student not registered in college database')
    }

    const decoded = decodeJwt(data.access_token)
    const resolvedName = decoded?.name || htno

    TokenCacheManager.saveToken(
      htno,
      {
        access_token: data.access_token,
        username: data.username,
        name: resolvedName,
        collegeName: data.collegeName || (htno.startsWith('2455') ? 'KMEC' : 'NGIT'),
        timestamp: Date.now(),
      },
      'htno'
    )

    return data.access_token
  }

  private static async fetchMobileToken(
    mobile: string,
    mode: 'netra' | 'sanjaya',
    captchaToken: string
  ): Promise<string> {
    const data = await postJson<{ access_token: string; collegeName?: string }>(
      API_ENDPOINTS.authMobile,
      {
        mobile,
        token: captchaToken,
        application: mode,
      }
    )

    if (!data.access_token) {
      throw new ApiError(`Verification failed for ${mode === 'netra' ? 'student' : 'parent'} mobile number`)
    }

    const decoded = decodeJwt(data.access_token)
    const resolvedName = decoded?.name || mobile

    TokenCacheManager.saveToken(
      mobile,
      {
        access_token: data.access_token,
        username: mobile,
        name: resolvedName,
        collegeName: data.collegeName || 'NGIT',
        timestamp: Date.now(),
      },
      mode
    )

    return data.access_token
  }

  static invalidateSession(identifier: string): void {
    TokenCacheManager.evict(identifier)
  }
}
