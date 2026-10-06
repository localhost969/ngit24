export const APP_CONFIG = {
  name: 'NGIT Student Tracker',
  description: 'Unified academic portal for attendance, timetables, and examination results across KMEC and NGIT.',
  version: '1.0.0',
} as const

export const CLOUDFLARE_CONFIG = {
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAABxu5-SWrD0WYDcB',
} as const

export const CACHE_CONFIG = {
  tokenStorageKey: 'localman',
  tokenTtlMs: 6 * 60 * 60 * 1000,
  maxRecentSearches: 10,
} as const

export const RATE_LIMIT_CONFIG = {
  storageKey: 'attendance_rate_limit',
  maxUniqueSearchesPerHour: 3,
} as const

export const API_ENDPOINTS = {
  authRollNumber: 'https://969.89determined.workers.dev/',
  authMobile: 'https://ntoken.89determined.workers.dev/',
  kmecSubject: 'https://ks.89determined.workers.dev',
  ngitSubject: 'https://nsub.89determined.workers.dev',
  kmecAttendance: 'https://kd.89determined.workers.dev',
  ngitAttendance: 'https://nday.89determined.workers.dev',
  auditLog: 'https://nlog.89determined.workers.dev',
  errorTelemetry: 'https://fb.89determined.workers.dev',
} as const

export const COLLEGE_CODES = {
  KMEC: {
    prefix: '2455',
    name: 'KMEC',
    fullName: 'Keshav Memorial Engineering College',
  },
  NGIT: {
    prefix: '2453',
    name: 'NGIT',
    fullName: 'Neil Gogte Institute of Technology',
  },
} as const

export const DEPARTMENT_CODES: Record<string, string> = {
  '733': 'CSE',
  '748': 'CSM',
}

export const RESULTS_PORTALS = [
  {
    title: '1st Year 1st Sem',
    url: 'https://www.osmania.ac.in/res07/20250403.jsp',
  },
  {
    title: '1st Year 2nd Sem',
    url: 'https://www.osmania.ac.in/res07/2025becbcs.jsp',
  },
] as const
