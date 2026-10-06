export type LoginType = 'htno' | 'netra' | 'sanjaya'

export interface TokenData {
  access_token: string
  username: string
  name: string
  collegeName: string
  timestamp: number
}

export interface RecentSearch {
  htno: string
  name: string
  collegeName: string
  timestamp: number
  token: string
  loginType?: LoginType
}

export interface DecodedTokenPayload {
  error?: boolean
  username?: string
  name?: string
  exp?: number
  iat?: number
  [key: string]: unknown
}
