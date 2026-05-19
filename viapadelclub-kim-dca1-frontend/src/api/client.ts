import { apiBaseUrl } from './config'
import type {
  RegisterPlayerRequest,
  RegisterPlayerResponse,
  UpcomingDailySchedulesResponse,
} from './types'

export async function registerPlayer(
  payload: RegisterPlayerRequest,
): Promise<RegisterPlayerResponse> {
  const response = await fetch(`${apiBaseUrl}/api/players/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Failed to register player')
  }

  return (await response.json()) as RegisterPlayerResponse
}

export async function getUpcomingDailySchedules(): Promise<UpcomingDailySchedulesResponse> {
  const response = await fetch(`${apiBaseUrl}/api/daily-schedules/upcoming`)

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Failed to load upcoming schedules')
  }

  const payload = (await response.json()) as
    | UpcomingDailySchedulesResponse
    | { items?: UpcomingDailySchedulesResponse }

  if (Array.isArray(payload)) {
    return payload
  }

  return Array.isArray(payload.items) ? payload.items : []
}
