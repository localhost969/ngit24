import { API_ENDPOINTS } from '@/config/constants'
import { detectCollege } from '@/lib/utils/formatters'
import { AuthService } from './auth.service'
import { postJson, ApiError } from './api-client'
import type { AttendanceData, SubjectAttendanceData } from '@/types/academic'
import type { LoginType } from '@/types/auth'

export class AcademicService {
  /**
   * Fetches unified academic records including overall metrics,
   * subject-wise attendance breakdown, and day-wise period attendance.
   * Transparently catches token expiry, requests a refreshed token, and retries.
   */
  static async getAcademicRecords(
    identifier: string,
    token: string,
    loginType: LoginType = 'htno'
  ): Promise<{ attendanceData: AttendanceData; subjectData: SubjectAttendanceData[] }> {
    const isKMEC = loginType === 'htno' && detectCollege(identifier) === 'KMEC'

    const subjectUrl = isKMEC ? API_ENDPOINTS.kmecSubject : API_ENDPOINTS.ngitSubject
    const attendanceUrl = isKMEC ? API_ENDPOINTS.kmecAttendance : API_ENDPOINTS.ngitAttendance

    const executeBatch = async (bearerToken: string) => {
      const [subjectResponse, attendanceResponse] = await Promise.all([
        postJson(subjectUrl, { bearer: bearerToken }),
        postJson(attendanceUrl, { bearer: bearerToken }),
      ])

      return {
        subjectData: this.normalizeSubjectData(subjectResponse),
        attendanceData: this.normalizeAttendanceData(attendanceResponse),
      }
    }

    try {
      return await executeBatch(token)
    } catch (err) {
      if (err instanceof ApiError && err.isTokenExpired) {
        AuthService.invalidateSession(identifier)
        const refreshedToken = await AuthService.acquireToken(identifier, loginType)
        return await executeBatch(refreshedToken)
      }
      throw err
    }
  }

  private static normalizeAttendanceData(raw: any): AttendanceData {
    return {
      attendanceDetails: raw?.attendanceDetails || raw?.payload?.attendanceDetails || [],
      overallAttendance: String(raw?.overallAttendance || raw?.payload?.overallAttendance || '0'),
    }
  }

  private static normalizeSubjectData(raw: any): SubjectAttendanceData[] {
    if (Array.isArray(raw)) return raw
    if (raw?.subjectAttendance && Array.isArray(raw.subjectAttendance)) return raw.subjectAttendance
    if (raw?.payload && Array.isArray(raw.payload)) return raw.payload
    if (raw?.payload?.subjectAttendance && Array.isArray(raw.payload.subjectAttendance)) {
      return raw.payload.subjectAttendance
    }
    return []
  }
}
