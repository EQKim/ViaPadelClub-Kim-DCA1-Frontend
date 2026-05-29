import { apiBaseUrl } from './config'
import type {
  AddDailyScheduleCourtRequest,
  CreateBookingRequest,
  CreateCourtRequest,
  CreateDailyScheduleRequest,
  CreateManagerRequest,
  CourtsResponse,
  PlayerBookingsResponse,
  PlayersResponse,
  PlayerAdminActionRequest,
  RegisterPlayerRequest,
  RegisterPlayerResponse,
  UpcomingDailySchedulesResponse,
} from './types'

function formatApiError(payload: unknown, fallback: string) {
  if (payload && typeof payload === 'object' && 'errors' in payload) {
    const errors = (payload as { errors?: Array<string | { message?: string }> })
      .errors
    if (Array.isArray(errors) && errors.length > 0) {
      return errors
        .map((error) =>
          typeof error === 'string'
            ? error
            : error.message || fallback,
        )
        .filter(Boolean)
        .join('\n')
    }
  }
  return fallback
}

async function assertOk(response: Response, fallback: string) {
  if (response.ok) {
    return
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (typeof payload === 'string') {
    throw new Error(payload || fallback)
  }

  throw new Error(formatApiError(payload, fallback))
}

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

  await assertOk(response, 'Failed to register player')

  return (await response.json()) as RegisterPlayerResponse
}

export async function createManager(payload: CreateManagerRequest): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/managers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  await assertOk(response, 'Failed to create manager')
}

export async function createCourt(payload: CreateCourtRequest): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/courts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  await assertOk(response, 'Failed to create court')
}

export async function getCourts(): Promise<CourtsResponse> {
  const response = await fetch(`${apiBaseUrl}/api/courts`)

  await assertOk(response, 'Failed to load courts')

  return (await response.json()) as CourtsResponse
}

export async function getPlayers(): Promise<PlayersResponse> {
  const response = await fetch(`${apiBaseUrl}/api/players?isBanned=false`)

  await assertOk(response, 'Failed to load players')

  return (await response.json()) as PlayersResponse
}

export async function getAllPlayers(): Promise<PlayersResponse> {
  const response = await fetch(`${apiBaseUrl}/api/players`)

  await assertOk(response, 'Failed to load players')

  return (await response.json()) as PlayersResponse
}

export async function getPlayerBookings(
  playerId: string,
): Promise<PlayerBookingsResponse> {
  const response = await fetch(`${apiBaseUrl}/api/players/${playerId}/bookings`)

  await assertOk(response, 'Failed to load player bookings')

  return (await response.json()) as PlayerBookingsResponse
}

export async function createDailySchedule(
  payload: CreateDailyScheduleRequest,
): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/daily-schedules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  await assertOk(response, 'Failed to create daily schedule')
}

export async function activateDailySchedule(dailyScheduleId: string): Promise<void> {
  const response = await fetch(
    `${apiBaseUrl}/api/daily-schedules/${dailyScheduleId}/activate`,
    {
      method: 'POST',
    },
  )

  await assertOk(response, 'Failed to activate daily schedule')
}

export async function addDailyScheduleCourt(
  dailyScheduleId: string,
  payload: AddDailyScheduleCourtRequest,
): Promise<void> {
  const response = await fetch(
    `${apiBaseUrl}/api/daily-schedules/${dailyScheduleId}/courts`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )

  await assertOk(response, 'Failed to add court to schedule')
}

export async function createBooking(
  dailyScheduleId: string,
  dailyScheduleCourtId: string,
  payload: CreateBookingRequest,
): Promise<void> {
  const response = await fetch(
    `${apiBaseUrl}/api/daily-schedules/${dailyScheduleId}/courts/${dailyScheduleCourtId}/bookings`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )

  await assertOk(response, 'Failed to create booking')
}

export async function cancelBooking(
  dailyScheduleId: string,
  dailyScheduleCourtId: string,
  bookingId: string,
): Promise<void> {
  const response = await fetch(
    `${apiBaseUrl}/api/daily-schedules/${dailyScheduleId}/courts/${dailyScheduleCourtId}/bookings/${bookingId}/cancel`,
    {
      method: 'POST',
    },
  )

  await assertOk(response, 'Failed to cancel booking')
}

export async function grantVip(
  playerId: string,
  payload: PlayerAdminActionRequest,
): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/players/${playerId}/grant-vip`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  await assertOk(response, 'Failed to grant VIP')
}

export async function revokeVip(
  playerId: string,
  payload: PlayerAdminActionRequest,
): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/players/${playerId}/revoke-vip`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  await assertOk(response, 'Failed to revoke VIP')
}

export async function banPlayer(
  playerId: string,
  payload: PlayerAdminActionRequest,
): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/players/${playerId}/ban`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  await assertOk(response, 'Failed to ban player')
}

export async function unbanPlayer(
  playerId: string,
  payload: PlayerAdminActionRequest,
): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/players/${playerId}/unban`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  await assertOk(response, 'Failed to unban player')
}

export async function getUpcomingDailySchedules(): Promise<UpcomingDailySchedulesResponse> {
  const response = await fetch(`${apiBaseUrl}/api/daily-schedules/upcoming?count=50`)

  await assertOk(response, 'Failed to load upcoming schedules')

  const payload = (await response.json()) as {
    dailySchedules?: UpcomingDailySchedulesResponse
  }

  return Array.isArray(payload.dailySchedules) ? payload.dailySchedules : []
}
