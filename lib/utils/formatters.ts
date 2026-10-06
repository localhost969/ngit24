import { COLLEGE_CODES, DEPARTMENT_CODES } from '@/config/constants'
import type { CollegeCode, AttendanceTargetCalculation } from '@/types/academic'

export function detectCollege(identifier: string): CollegeCode {
  if (identifier.startsWith(COLLEGE_CODES.NGIT.prefix)) {
    return 'NGIT'
  }
  return 'KMEC'
}

export function detectDepartment(htno: string): string | null {
  for (const [code, dept] of Object.entries(DEPARTMENT_CODES)) {
    if (htno.includes(code)) {
      return dept
    }
  }
  return null
}

export function formatAttendanceDate(dateString: string): string {
  if (dateString === 'Today') {
    const today = new Date()
    const month = today.toLocaleDateString('en-US', { month: 'short' })
    const day = today.getDate().toString().padStart(2, '0')
    return `${month} ${day}`
  }

  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return dateString
  }

  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const day = date.getDate().toString().padStart(2, '0')
  return `${month} ${day}`
}

/**
 * Calculates academic target attendance metrics.
 * Determines how many consecutive sessions a student must attend to reach the target,
 * or how many sessions can be skipped while safely staying at or above the target.
 */
export function calculateAttendanceTarget(
  attended: number,
  total: number,
  targetPercentage: number = 75
): AttendanceTargetCalculation {
  const target = Math.max(1, Math.min(99, targetPercentage)) / 100
  const currentPercentage = total > 0 ? (attended / total) * 100 : 0

  if (total === 0) {
    return {
      targetPercentage,
      currentAttended: attended,
      currentTotal: total,
      currentPercentage: 0,
      sessionsNeeded: 0,
      canMissSessions: 0,
      status: 'on_track',
    }
  }

  if (currentPercentage >= targetPercentage) {
    // Math: attended / (total + miss) >= target => miss <= (attended - target * total) / target
    const canMiss = Math.floor((attended - target * total) / target)
    return {
      targetPercentage,
      currentAttended: attended,
      currentTotal: total,
      currentPercentage,
      sessionsNeeded: 0,
      canMissSessions: Math.max(0, canMiss),
      status: 'on_track',
    }
  } else {
    // Math: (attended + need) / (total + need) >= target => need >= (target * total - attended) / (1 - target)
    const needed = Math.ceil((target * total - attended) / (1 - target))
    return {
      targetPercentage,
      currentAttended: attended,
      currentTotal: total,
      currentPercentage,
      sessionsNeeded: Math.max(0, needed),
      canMissSessions: 0,
      status: 'needs_attendance',
    }
  }
}
