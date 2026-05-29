export interface RegisterPlayerRequest {
  playerId: string
  universityName: string
}

export interface RegisterPlayerResponse {
  playerId: string
  universityName: string
  isVip?: boolean
  isBanned?: boolean
}

export interface PlayerSummary {
  playerId: string
  universityName: string
  isVip: boolean
  isBanned: boolean
}

export interface CreateManagerRequest {
  managerId: string
  padelCompanyName: string
}

export interface CreateCourtRequest {
  courtId: string
  courtName: string
}

export interface Court {
  courtId: string
  courtName: string
}

export interface CreateDailyScheduleRequest {
  dailyScheduleId: string
  managerId: string
  windowStart: string
  windowEnd: string
}

export interface AddDailyScheduleCourtRequest {
  dailyScheduleCourtId: string
  courtId: string
  isVipOnly: boolean
}

export interface CreateBookingRequest {
  bookingId: string
  playerId: string
  slotStart: string
  slotEnd: string
}

export interface PlayerAdminActionRequest {
  managerId: string
  reason: string
}

export interface UpcomingDailySchedule {
  dailyScheduleId: string
  managerId: string
  createdTimestamp: string
  windowStart: string
  windowEnd: string
  status: string
  courts?: ScheduleCourt[]
}

export type UpcomingDailySchedulesResponse = UpcomingDailySchedule[]

export interface CourtsResponse {
  courts: Court[]
}

export interface PlayersResponse {
  players: PlayerSummary[]
}

export interface ScheduleCourt {
  dailyScheduleCourtId: string
  courtId: string
  courtName: string
  isVipOnly: boolean
  activeBookings: number
  bookings: BookingSummary[]
}

export interface BookingSummary {
  slotStart: string
  slotEnd: string
  status: string
}
