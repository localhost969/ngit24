import { API_ENDPOINTS } from '@/config/constants'
import { detectCollege, detectDepartment } from '@/lib/utils/formatters'
import type { LoginType } from '@/types/auth'

export class TelemetryService {
  static logAccess(identifier: string, name: string, loginType: LoginType = 'htno'): void {
    try {
      const college = detectCollege(identifier)
      const dept = detectDepartment(identifier) || 'UNKNOWN'

      let logPayload = ''
      if (loginType === 'htno') {
        logPayload = `latest-${college}-${identifier}-${name}-${dept}`
      } else {
        const app = loginType === 'netra' ? 'NETRA' : 'SANJAYA'
        logPayload = `latest-${app}-${identifier}-${name}`
      }

      const target = `${API_ENDPOINTS.auditLog}?text=${encodeURIComponent(logPayload)}`
      fetch(target, { mode: 'no-cors' }).catch(() => {})
    } catch {
      // Telemetry should never disrupt user execution
    }
  }

  static logError(identifier: string, errorMessage: string): void {
    try {
      const college = detectCollege(identifier)
      const dept = detectDepartment(identifier) || 'UNKNOWN'
      const payload = `ERROR-${college}-${identifier}-${dept}-${errorMessage}`

      const target = `${API_ENDPOINTS.errorTelemetry}?text=${encodeURIComponent(payload)}`
      fetch(target, { mode: 'no-cors' }).catch(() => {})
    } catch {
      // Suppress telemetry failures
    }
  }
}
