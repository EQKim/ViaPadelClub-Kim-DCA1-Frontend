export interface RegisterPlayerRequest {
  playerId: string
  universityCollegeName: string
  isVip: boolean
}

export interface RegisterPlayerResponse {
  playerId: string
  universityCollegeName: string
  isVip: boolean
  isBanned: boolean
}

export interface UpcomingDailySchedule {
  dailyScheduleId: string
  managerId: string
  createdTimestamp: string
  windowStart: string
  windowEnd: string
  status: string
}

export type UpcomingDailySchedulesResponse = UpcomingDailySchedule[]
