export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isTokenExpired: boolean = false
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function postJson<T = any>(
  url: string,
  body: Record<string, unknown>,
  timeoutMs: number = 10000
): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    const data = await response.json()

    // Cloudflare Workers sometimes return 200 with { Error: true, statusCode: 401 }
    if (data && (data.Error === true || data.error)) {
      const isExpired =
        data.statusCode === 401 ||
        data.message === 'Unauthorized' ||
        data.error === 'TOKEN_EXPIRED'

      throw new ApiError(data.message || data.error || 'Worker request failed', data.statusCode, isExpired)
    }

    if (!response.ok) {
      throw new ApiError(data?.message || `Request failed with HTTP ${response.status}`, response.status)
    }

    return data as T
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out, please retry', 408)
    }

    const message = err instanceof Error ? err.message : 'Network communication error'
    throw new ApiError(message)
  } finally {
    clearTimeout(timer)
  }
}
