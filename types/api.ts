export interface WorkerErrorResponse {
  Error?: boolean
  error?: string
  message?: string
  statusCode?: number
}

export interface WorkerSuccessResponse<T = unknown> {
  Error?: false
  data?: T
  payload?: T
  [key: string]: unknown
}

export type WorkerResponse<T = unknown> = WorkerSuccessResponse<T> & WorkerErrorResponse

export interface RateLimitStatus {
  allowed: boolean
  remaining: number
  resetTime: number
  resetTimeFormatted: string
  isRepeat: boolean
}
