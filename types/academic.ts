export type PeriodStatus = 0 | 1 | 2

export interface Period {
  period_no: number
  status: PeriodStatus
}

export interface AttendanceDetail {
  date: string
  periods: Period[]
}

export interface AttendanceData {
  attendanceDetails: AttendanceDetail[]
  overallAttendance: string
}

export interface SubjectAttendanceData {
  attendancePercentage: string
  attendedSessions: number
  subjectName: string
  subjectType: 'THEORY' | 'LAB'
  totalSessions: number
}

export type CollegeCode = 'KMEC' | 'NGIT'

export interface AttendanceTargetCalculation {
  targetPercentage: number
  currentAttended: number
  currentTotal: number
  currentPercentage: number
  sessionsNeeded: number
  canMissSessions: number
  status: 'on_track' | 'needs_attendance'
}
