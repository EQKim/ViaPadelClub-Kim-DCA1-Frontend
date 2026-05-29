import { type FormEvent, useMemo, useState } from 'react'
import './App.css'
import {
  activateDailySchedule,
  addDailyScheduleCourt,
  banPlayer,
  cancelBooking,
  createBooking,
  createCourt,
  createDailySchedule,
  createManager,
  getUpcomingDailySchedules,
  grantVip,
  registerPlayer,
  revokeVip,
  unbanPlayer,
} from './api/client'
import type {
  AddDailyScheduleCourtRequest,
  CreateBookingRequest,
  CreateCourtRequest,
  CreateDailyScheduleRequest,
  CreateManagerRequest,
  PlayerAdminActionRequest,
  RegisterPlayerRequest,
  RegisterPlayerResponse,
  UpcomingDailySchedule,
} from './api/types'

const initialFormState: RegisterPlayerRequest = {
  playerId: '',
  universityName: '',
}

const initialManagerState: CreateManagerRequest = {
  managerId: '',
  padelCompanyName: '',
}

const initialCourtState: CreateCourtRequest = {
  courtId: '',
  courtName: '',
}

const initialDailyScheduleState: CreateDailyScheduleRequest = {
  dailyScheduleId: '',
  managerId: '',
  windowStart: '',
  windowEnd: '',
}

const initialDailyScheduleCourtState: AddDailyScheduleCourtRequest = {
  dailyScheduleCourtId: '',
  courtId: '',
  isVipOnly: false,
}

const initialBookingState: CreateBookingRequest = {
  bookingId: '',
  playerId: '',
  slotStart: '',
  slotEnd: '',
}

const initialAdminActionState: PlayerAdminActionRequest = {
  managerId: '',
  reason: '',
}

const initialActivateState = {
  dailyScheduleId: '',
}

const initialBookingCancelState = {
  dailyScheduleId: '',
  dailyScheduleCourtId: '',
  bookingId: '',
}

const initialPlayerActionState = {
  playerId: '',
}

function App() {
  const [formState, setFormState] = useState<RegisterPlayerRequest>(
    initialFormState,
  )
  const [managerState, setManagerState] = useState<CreateManagerRequest>(
    initialManagerState,
  )
  const [managerStatus, setManagerStatus] = useState<string | null>(null)
  const [managerError, setManagerError] = useState<string | null>(null)
  const [managerLoading, setManagerLoading] = useState(false)
  const [courtState, setCourtState] = useState<CreateCourtRequest>(
    initialCourtState,
  )
  const [courtStatus, setCourtStatus] = useState<string | null>(null)
  const [courtError, setCourtError] = useState<string | null>(null)
  const [courtLoading, setCourtLoading] = useState(false)
  const [dailyScheduleState, setDailyScheduleState] =
    useState<CreateDailyScheduleRequest>(initialDailyScheduleState)
  const [dailyScheduleStatus, setDailyScheduleStatus] = useState<string | null>(
    null,
  )
  const [dailyScheduleError, setDailyScheduleError] = useState<string | null>(
    null,
  )
  const [dailyScheduleLoading, setDailyScheduleLoading] = useState(false)
  const [activateState, setActivateState] = useState(initialActivateState)
  const [activateStatus, setActivateStatus] = useState<string | null>(null)
  const [activateError, setActivateError] = useState<string | null>(null)
  const [activateLoading, setActivateLoading] = useState(false)
  const [dailyScheduleCourtState, setDailyScheduleCourtState] =
    useState<AddDailyScheduleCourtRequest>(initialDailyScheduleCourtState)
  const [dailyScheduleCourtTarget, setDailyScheduleCourtTarget] = useState('')
  const [dailyScheduleCourtStatus, setDailyScheduleCourtStatus] = useState<
    string | null
  >(null)
  const [dailyScheduleCourtError, setDailyScheduleCourtError] = useState<
    string | null
  >(null)
  const [dailyScheduleCourtLoading, setDailyScheduleCourtLoading] =
    useState(false)
  const [bookingState, setBookingState] =
    useState<CreateBookingRequest>(initialBookingState)
  const [bookingTarget, setBookingTarget] = useState({
    dailyScheduleId: '',
    dailyScheduleCourtId: '',
  })
  const [bookingStatus, setBookingStatus] = useState<string | null>(null)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingCancelState, setBookingCancelState] = useState(
    initialBookingCancelState,
  )
  const [bookingCancelStatus, setBookingCancelStatus] = useState<string | null>(
    null,
  )
  const [bookingCancelError, setBookingCancelError] = useState<string | null>(
    null,
  )
  const [bookingCancelLoading, setBookingCancelLoading] = useState(false)
  const [playerActionState, setPlayerActionState] = useState(
    initialPlayerActionState,
  )
  const [adminActionState, setAdminActionState] = useState(
    initialAdminActionState,
  )
  const [grantVipStatus, setGrantVipStatus] = useState<string | null>(null)
  const [grantVipError, setGrantVipError] = useState<string | null>(null)
  const [grantVipLoading, setGrantVipLoading] = useState(false)
  const [revokeVipStatus, setRevokeVipStatus] = useState<string | null>(null)
  const [revokeVipError, setRevokeVipError] = useState<string | null>(null)
  const [revokeVipLoading, setRevokeVipLoading] = useState(false)
  const [banStatus, setBanStatus] = useState<string | null>(null)
  const [banError, setBanError] = useState<string | null>(null)
  const [banLoading, setBanLoading] = useState(false)
  const [unbanStatus, setUnbanStatus] = useState<string | null>(null)
  const [unbanError, setUnbanError] = useState<string | null>(null)
  const [unbanLoading, setUnbanLoading] = useState(false)
  const [registerResult, setRegisterResult] =
    useState<RegisterPlayerResponse | null>(null)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [schedules, setSchedules] = useState<UpcomingDailySchedule[]>([])
  const [scheduleError, setScheduleError] = useState<string | null>(null)
  const [scheduleLoading, setScheduleLoading] = useState(false)
  const canSubmit = useMemo(() => {
    return formState.playerId.trim() && formState.universityName.trim()
  }, [formState.playerId, formState.universityName])
  const canCreateManager = useMemo(() => {
    return managerState.managerId.trim() && managerState.padelCompanyName.trim()
  }, [managerState.managerId, managerState.padelCompanyName])
  const canCreateCourt = useMemo(() => {
    return courtState.courtId.trim() && courtState.courtName.trim()
  }, [courtState.courtId, courtState.courtName])
  const canCreateDailySchedule = useMemo(() => {
    return (
      dailyScheduleState.dailyScheduleId.trim() &&
      dailyScheduleState.managerId.trim() &&
      dailyScheduleState.windowStart.trim() &&
      dailyScheduleState.windowEnd.trim()
    )
  }, [
    dailyScheduleState.dailyScheduleId,
    dailyScheduleState.managerId,
    dailyScheduleState.windowStart,
    dailyScheduleState.windowEnd,
  ])
  const canActivateSchedule = useMemo(() => {
    return activateState.dailyScheduleId.trim()
  }, [activateState.dailyScheduleId])
  const canAddCourtToSchedule = useMemo(() => {
    return (
      dailyScheduleCourtTarget.trim() &&
      dailyScheduleCourtState.dailyScheduleCourtId.trim() &&
      dailyScheduleCourtState.courtId.trim()
    )
  }, [
    dailyScheduleCourtTarget,
    dailyScheduleCourtState.dailyScheduleCourtId,
    dailyScheduleCourtState.courtId,
  ])
  const canCreateBooking = useMemo(() => {
    return (
      bookingTarget.dailyScheduleId.trim() &&
      bookingTarget.dailyScheduleCourtId.trim() &&
      bookingState.bookingId.trim() &&
      bookingState.playerId.trim() &&
      bookingState.slotStart.trim() &&
      bookingState.slotEnd.trim()
    )
  }, [
    bookingTarget.dailyScheduleId,
    bookingTarget.dailyScheduleCourtId,
    bookingState.bookingId,
    bookingState.playerId,
    bookingState.slotStart,
    bookingState.slotEnd,
  ])
  const canCancelBooking = useMemo(() => {
    return (
      bookingCancelState.dailyScheduleId.trim() &&
      bookingCancelState.dailyScheduleCourtId.trim() &&
      bookingCancelState.bookingId.trim()
    )
  }, [
    bookingCancelState.dailyScheduleId,
    bookingCancelState.dailyScheduleCourtId,
    bookingCancelState.bookingId,
  ])
  const canRunPlayerAction = useMemo(() => {
    return (
      playerActionState.playerId.trim() &&
      adminActionState.managerId.trim() &&
      adminActionState.reason.trim()
    )
  }, [
    playerActionState.playerId,
    adminActionState.managerId,
    adminActionState.reason,
  ])

  const generateGuid = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID()
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (value) => {
      const random = Math.random() * 16
      const digit = value === 'x' ? random : (random % 4) + 8
      return Math.floor(digit).toString(16)
    })
  }

  const loadSchedules = async () => {
    setScheduleLoading(true)
    setScheduleError(null)
    try {
      const response = await getUpcomingDailySchedules()
      setSchedules(response)
    } catch (error) {
      setScheduleError(
        error instanceof Error ? error.message : 'Failed to load schedules',
      )
    } finally {
      setScheduleLoading(false)
    }

  const handleManagerSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setManagerLoading(true)
    setManagerError(null)
    setManagerStatus(null)

    try {
      await createManager(managerState)
      setManagerStatus('Manager created.')
      setManagerState(initialManagerState)
    } catch (error) {
      setManagerError(
        error instanceof Error ? error.message : 'Failed to create manager',
      )
    } finally {
      setManagerLoading(false)
    }
  }

  const handleCourtSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCourtLoading(true)
    setCourtError(null)
    setCourtStatus(null)

    try {
      await createCourt(courtState)
      setCourtStatus('Court created.')
      setCourtState(initialCourtState)
    } catch (error) {
      setCourtError(
        error instanceof Error ? error.message : 'Failed to create court',
      )
    } finally {
      setCourtLoading(false)
    }
  }

  const handleDailyScheduleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setDailyScheduleLoading(true)
    setDailyScheduleError(null)
    setDailyScheduleStatus(null)

    try {
      await createDailySchedule(dailyScheduleState)
      setDailyScheduleStatus('Daily schedule created.')
      setDailyScheduleState(initialDailyScheduleState)
    } catch (error) {
      setDailyScheduleError(
        error instanceof Error
          ? error.message
          : 'Failed to create daily schedule',
      )
    } finally {
      setDailyScheduleLoading(false)
    }
  }

  const handleActivateSchedule = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setActivateLoading(true)
    setActivateError(null)
    setActivateStatus(null)

    try {
      await activateDailySchedule(activateState.dailyScheduleId)
      setActivateStatus('Daily schedule activated.')
      setActivateState(initialActivateState)
    } catch (error) {
      setActivateError(
        error instanceof Error
          ? error.message
          : 'Failed to activate daily schedule',
      )
    } finally {
      setActivateLoading(false)
    }
  }

  const handleDailyScheduleCourtSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setDailyScheduleCourtLoading(true)
    setDailyScheduleCourtError(null)
    setDailyScheduleCourtStatus(null)

    try {
      await addDailyScheduleCourt(
        dailyScheduleCourtTarget,
        dailyScheduleCourtState,
      )
      setDailyScheduleCourtStatus('Court added to schedule.')
      setDailyScheduleCourtState(initialDailyScheduleCourtState)
      setDailyScheduleCourtTarget('')
    } catch (error) {
      setDailyScheduleCourtError(
        error instanceof Error
          ? error.message
          : 'Failed to add court to schedule',
      )
    } finally {
      setDailyScheduleCourtLoading(false)
    }
  }

  const handleBookingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBookingLoading(true)
    setBookingError(null)
    setBookingStatus(null)

    try {
      await createBooking(
        bookingTarget.dailyScheduleId,
        bookingTarget.dailyScheduleCourtId,
        bookingState,
      )
      setBookingStatus('Booking created.')
      setBookingState(initialBookingState)
      setBookingTarget({ dailyScheduleId: '', dailyScheduleCourtId: '' })
    } catch (error) {
      setBookingError(
        error instanceof Error ? error.message : 'Failed to create booking',
      )
    } finally {
      setBookingLoading(false)
    }
  }

  const handleBookingCancel = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBookingCancelLoading(true)
    setBookingCancelError(null)
    setBookingCancelStatus(null)

    try {
      await cancelBooking(
        bookingCancelState.dailyScheduleId,
        bookingCancelState.dailyScheduleCourtId,
        bookingCancelState.bookingId,
      )
      setBookingCancelStatus('Booking canceled.')
      setBookingCancelState(initialBookingCancelState)
    } catch (error) {
      setBookingCancelError(
        error instanceof Error ? error.message : 'Failed to cancel booking',
      )
    } finally {
      setBookingCancelLoading(false)
    }
  }

  const handleGrantVip = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setGrantVipLoading(true)
    setGrantVipError(null)
    setGrantVipStatus(null)

    try {
      await grantVip(playerActionState.playerId, adminActionState)
      setGrantVipStatus('VIP granted.')
      setPlayerActionState(initialPlayerActionState)
      setAdminActionState(initialAdminActionState)
    } catch (error) {
      setGrantVipError(
        error instanceof Error ? error.message : 'Failed to grant VIP',
      )
    } finally {
      setGrantVipLoading(false)
    }
  }

  const handleRevokeVip = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRevokeVipLoading(true)
    setRevokeVipError(null)
    setRevokeVipStatus(null)

    try {
      await revokeVip(playerActionState.playerId, adminActionState)
      setRevokeVipStatus('VIP revoked.')
      setPlayerActionState(initialPlayerActionState)
      setAdminActionState(initialAdminActionState)
    } catch (error) {
      setRevokeVipError(
        error instanceof Error ? error.message : 'Failed to revoke VIP',
      )
    } finally {
      setRevokeVipLoading(false)
    }
  }

  const handleBanPlayer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBanLoading(true)
    setBanError(null)
    setBanStatus(null)

    try {
      await banPlayer(playerActionState.playerId, adminActionState)
      setBanStatus('Player banned.')
      setPlayerActionState(initialPlayerActionState)
      setAdminActionState(initialAdminActionState)
    } catch (error) {
      setBanError(
        error instanceof Error ? error.message : 'Failed to ban player',
      )
    } finally {
      setBanLoading(false)
    }
  }

  const handleUnbanPlayer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUnbanLoading(true)
    setUnbanError(null)
    setUnbanStatus(null)

    try {
      await unbanPlayer(playerActionState.playerId, adminActionState)
      setUnbanStatus('Player unbanned.')
      setPlayerActionState(initialPlayerActionState)
      setAdminActionState(initialAdminActionState)
    } catch (error) {
      setUnbanError(
        error instanceof Error ? error.message : 'Failed to unban player',
      )
    } finally {
      setUnbanLoading(false)
    }
  }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setRegisterLoading(true)
    setRegisterError(null)
    setRegisterResult(null)

    try {
      const result = await registerPlayer(formState)
      setRegisterResult(result)
      setFormState(initialFormState)
    } catch (error) {
      setRegisterError(
        error instanceof Error ? error.message : 'Failed to register player',
      )
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">ViaPadelClub</p>
          <h1>Backend API Playground</h1>
          <p>Register players and view upcoming daily schedules.</p>
        </div>
      </header>

      <section className="card">
        <div className="card-header">
          <h2>Register player</h2>
          <p>POST /api/players/register</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            Player ID (GUID)
            <input
              value={formState.playerId}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  playerId: event.target.value,
                }))
              }
              placeholder="e.g. 2f9a12e1-0f50-4d76-9ed6-5d8e2d0b8aa4"
            />
          </label>
          <label className="field">
            University/College Name
            <input
              value={formState.universityName}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  universityName: event.target.value,
                }))
              }
              placeholder="e.g. VIA University College"
            />
          </label>
          <button type="submit" disabled={!canSubmit || registerLoading}>
            {registerLoading ? 'Registering...' : 'Register player'}
          </button>
        </form>
        {registerError && <p className="status error">{registerError}</p>}
        {registerResult && (
          <div className="status success">
            <p>Player registered.</p>
            <dl>
              <div>
                <dt>Player ID</dt>
                <dd>{registerResult.playerId}</dd>
              </div>
              <div>
                <dt>University/College</dt>
                <dd>{registerResult.universityName}</dd>
              </div>
              <div>
                <dt>VIP</dt>
                <dd>{registerResult.isVip ? 'Yes' : 'Unknown'}</dd>
              </div>
              <div>
                <dt>Banned</dt>
                <dd>{registerResult.isBanned ? 'Yes' : 'Unknown'}</dd>
              </div>
            </dl>
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Create manager</h2>
          <p>POST /api/managers</p>
        </div>
        <form className="form" onSubmit={handleManagerSubmit}>
          <label className="field">
            Manager ID (GUID)
            <div className="field-row">
              <input
                value={managerState.managerId}
                onChange={(event) =>
                  setManagerState((current) => ({
                    ...current,
                    managerId: event.target.value,
                  }))
                }
                placeholder="Generate or paste manager GUID"
              />
              <button
                type="button"
                onClick={() =>
                  setManagerState((current) => ({
                    ...current,
                    managerId: generateGuid(),
                  }))
                }
              >
                Generate
              </button>
            </div>
          </label>
          <label className="field">
            Padel company name
            <input
              value={managerState.padelCompanyName}
              onChange={(event) =>
                setManagerState((current) => ({
                  ...current,
                  padelCompanyName: event.target.value,
                }))
              }
              placeholder="e.g. Padel Pro"
            />
          </label>
          <button type="submit" disabled={!canCreateManager || managerLoading}>
            {managerLoading ? 'Creating...' : 'Create manager'}
          </button>
        </form>
        {managerError && <p className="status error">{managerError}</p>}
        {managerStatus && <p className="status success">{managerStatus}</p>}
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Create court</h2>
          <p>POST /api/courts</p>
        </div>
        <form className="form" onSubmit={handleCourtSubmit}>
          <label className="field">
            Court ID (GUID)
            <div className="field-row">
              <input
                value={courtState.courtId}
                onChange={(event) =>
                  setCourtState((current) => ({
                    ...current,
                    courtId: event.target.value,
                  }))
                }
                placeholder="Generate or paste court GUID"
              />
              <button
                type="button"
                onClick={() =>
                  setCourtState((current) => ({
                    ...current,
                    courtId: generateGuid(),
                  }))
                }
              >
                Generate
              </button>
            </div>
          </label>
          <label className="field">
            Court name
            <input
              value={courtState.courtName}
              onChange={(event) =>
                setCourtState((current) => ({
                  ...current,
                  courtName: event.target.value,
                }))
              }
              placeholder="e.g. Court A"
            />
          </label>
          <button type="submit" disabled={!canCreateCourt || courtLoading}>
            {courtLoading ? 'Creating...' : 'Create court'}
          </button>
        </form>
        {courtError && <p className="status error">{courtError}</p>}
        {courtStatus && <p className="status success">{courtStatus}</p>}
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Create daily schedule</h2>
          <p>POST /api/daily-schedules</p>
        </div>
        <form className="form" onSubmit={handleDailyScheduleSubmit}>
          <label className="field">
            Daily schedule ID (GUID)
            <div className="field-row">
              <input
                value={dailyScheduleState.dailyScheduleId}
                onChange={(event) =>
                  setDailyScheduleState((current) => ({
                    ...current,
                    dailyScheduleId: event.target.value,
                  }))
                }
                placeholder="Generate or paste schedule GUID"
              />
              <button
                type="button"
                onClick={() =>
                  setDailyScheduleState((current) => ({
                    ...current,
                    dailyScheduleId: generateGuid(),
                  }))
                }
              >
                Generate
              </button>
            </div>
          </label>
          <label className="field">
            Manager ID (GUID)
            <input
              value={dailyScheduleState.managerId}
              onChange={(event) =>
                setDailyScheduleState((current) => ({
                  ...current,
                  managerId: event.target.value,
                }))
              }
              placeholder="Use a manager GUID" 
            />
          </label>
          <label className="field">
            Window start (ISO datetime)
            <input
              value={dailyScheduleState.windowStart}
              onChange={(event) =>
                setDailyScheduleState((current) => ({
                  ...current,
                  windowStart: event.target.value,
                }))
              }
              placeholder="2026-05-19T08:00:00Z"
            />
          </label>
          <label className="field">
            Window end (ISO datetime)
            <input
              value={dailyScheduleState.windowEnd}
              onChange={(event) =>
                setDailyScheduleState((current) => ({
                  ...current,
                  windowEnd: event.target.value,
                }))
              }
              placeholder="2026-05-19T18:00:00Z"
            />
          </label>
          <button
            type="submit"
            disabled={!canCreateDailySchedule || dailyScheduleLoading}
          >
            {dailyScheduleLoading ? 'Creating...' : 'Create schedule'}
          </button>
        </form>
        {dailyScheduleError && (
          <p className="status error">{dailyScheduleError}</p>
        )}
        {dailyScheduleStatus && (
          <p className="status success">{dailyScheduleStatus}</p>
        )}
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Activate daily schedule</h2>
          <p>POST /api/daily-schedules/{'{dailyScheduleId}'}/activate</p>
        </div>
        <form className="form" onSubmit={handleActivateSchedule}>
          <label className="field">
            Daily schedule ID (GUID)
            <input
              value={activateState.dailyScheduleId}
              onChange={(event) =>
                setActivateState({ dailyScheduleId: event.target.value })
              }
              placeholder="Enter schedule GUID"
            />
          </label>
          <button type="submit" disabled={!canActivateSchedule || activateLoading}>
            {activateLoading ? 'Activating...' : 'Activate schedule'}
          </button>
        </form>
        {activateError && <p className="status error">{activateError}</p>}
        {activateStatus && <p className="status success">{activateStatus}</p>}
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Add court to daily schedule</h2>
          <p>POST /api/daily-schedules/{'{dailyScheduleId}'}/courts</p>
        </div>
        <form className="form" onSubmit={handleDailyScheduleCourtSubmit}>
          <label className="field">
            Daily schedule ID (GUID)
            <input
              value={dailyScheduleCourtTarget}
              onChange={(event) => setDailyScheduleCourtTarget(event.target.value)}
              placeholder="Enter schedule GUID"
            />
          </label>
          <label className="field">
            Daily schedule court ID (GUID)
            <div className="field-row">
              <input
                value={dailyScheduleCourtState.dailyScheduleCourtId}
                onChange={(event) =>
                  setDailyScheduleCourtState((current) => ({
                    ...current,
                    dailyScheduleCourtId: event.target.value,
                  }))
                }
                placeholder="Generate or paste schedule court GUID"
              />
              <button
                type="button"
                onClick={() =>
                  setDailyScheduleCourtState((current) => ({
                    ...current,
                    dailyScheduleCourtId: generateGuid(),
                  }))
                }
              >
                Generate
              </button>
            </div>
          </label>
          <label className="field">
            Court ID (GUID)
            <input
              value={dailyScheduleCourtState.courtId}
              onChange={(event) =>
                setDailyScheduleCourtState((current) => ({
                  ...current,
                  courtId: event.target.value,
                }))
              }
              placeholder="Use a court GUID"
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={dailyScheduleCourtState.isVipOnly}
              onChange={(event) =>
                setDailyScheduleCourtState((current) => ({
                  ...current,
                  isVipOnly: event.target.checked,
                }))
              }
            />
            VIP only
          </label>
          <button
            type="submit"
            disabled={!canAddCourtToSchedule || dailyScheduleCourtLoading}
          >
            {dailyScheduleCourtLoading ? 'Adding...' : 'Add court'}
          </button>
        </form>
        {dailyScheduleCourtError && (
          <p className="status error">{dailyScheduleCourtError}</p>
        )}
        {dailyScheduleCourtStatus && (
          <p className="status success">{dailyScheduleCourtStatus}</p>
        )}
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Create booking</h2>
          <p>
            POST /api/daily-schedules/{'{dailyScheduleId}'}/courts/{'{dailyScheduleCourtId}'}/bookings
          </p>
        </div>
        <form className="form" onSubmit={handleBookingSubmit}>
          <label className="field">
            Daily schedule ID (GUID)
            <input
              value={bookingTarget.dailyScheduleId}
              onChange={(event) =>
                setBookingTarget((current) => ({
                  ...current,
                  dailyScheduleId: event.target.value,
                }))
              }
              placeholder="Enter schedule GUID"
            />
          </label>
          <label className="field">
            Daily schedule court ID (GUID)
            <input
              value={bookingTarget.dailyScheduleCourtId}
              onChange={(event) =>
                setBookingTarget((current) => ({
                  ...current,
                  dailyScheduleCourtId: event.target.value,
                }))
              }
              placeholder="Enter schedule court GUID"
            />
          </label>
          <label className="field">
            Booking ID (GUID)
            <div className="field-row">
              <input
                value={bookingState.bookingId}
                onChange={(event) =>
                  setBookingState((current) => ({
                    ...current,
                    bookingId: event.target.value,
                  }))
                }
                placeholder="Generate or paste booking GUID"
              />
              <button
                type="button"
                onClick={() =>
                  setBookingState((current) => ({
                    ...current,
                    bookingId: generateGuid(),
                  }))
                }
              >
                Generate
              </button>
            </div>
          </label>
          <label className="field">
            Player ID (GUID)
            <input
              value={bookingState.playerId}
              onChange={(event) =>
                setBookingState((current) => ({
                  ...current,
                  playerId: event.target.value,
                }))
              }
              placeholder="Use a player GUID"
            />
          </label>
          <label className="field">
            Slot start (ISO datetime)
            <input
              value={bookingState.slotStart}
              onChange={(event) =>
                setBookingState((current) => ({
                  ...current,
                  slotStart: event.target.value,
                }))
              }
              placeholder="2026-05-19T10:00:00Z"
            />
          </label>
          <label className="field">
            Slot end (ISO datetime)
            <input
              value={bookingState.slotEnd}
              onChange={(event) =>
                setBookingState((current) => ({
                  ...current,
                  slotEnd: event.target.value,
                }))
              }
              placeholder="2026-05-19T11:00:00Z"
            />
          </label>
          <button type="submit" disabled={!canCreateBooking || bookingLoading}>
            {bookingLoading ? 'Creating...' : 'Create booking'}
          </button>
        </form>
        {bookingError && <p className="status error">{bookingError}</p>}
        {bookingStatus && <p className="status success">{bookingStatus}</p>}
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Cancel booking</h2>
          <p>
            POST /api/daily-schedules/{'{dailyScheduleId}'}/courts/{'{dailyScheduleCourtId}'}/bookings/{'{bookingId}'}/cancel
          </p>
        </div>
        <form className="form" onSubmit={handleBookingCancel}>
          <label className="field">
            Daily schedule ID (GUID)
            <input
              value={bookingCancelState.dailyScheduleId}
              onChange={(event) =>
                setBookingCancelState((current) => ({
                  ...current,
                  dailyScheduleId: event.target.value,
                }))
              }
              placeholder="Enter schedule GUID"
            />
          </label>
          <label className="field">
            Daily schedule court ID (GUID)
            <input
              value={bookingCancelState.dailyScheduleCourtId}
              onChange={(event) =>
                setBookingCancelState((current) => ({
                  ...current,
                  dailyScheduleCourtId: event.target.value,
                }))
              }
              placeholder="Enter schedule court GUID"
            />
          </label>
          <label className="field">
            Booking ID (GUID)
            <input
              value={bookingCancelState.bookingId}
              onChange={(event) =>
                setBookingCancelState((current) => ({
                  ...current,
                  bookingId: event.target.value,
                }))
              }
              placeholder="Enter booking GUID"
            />
          </label>
          <button type="submit" disabled={!canCancelBooking || bookingCancelLoading}>
            {bookingCancelLoading ? 'Canceling...' : 'Cancel booking'}
          </button>
        </form>
        {bookingCancelError && (
          <p className="status error">{bookingCancelError}</p>
        )}
        {bookingCancelStatus && (
          <p className="status success">{bookingCancelStatus}</p>
        )}
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Player admin actions</h2>
          <p>Requires manager context and reason.</p>
        </div>
        <form className="form" onSubmit={handleGrantVip}>
          <label className="field">
            Player ID (GUID)
            <input
              value={playerActionState.playerId}
              onChange={(event) =>
                setPlayerActionState({ playerId: event.target.value })
              }
              placeholder="Enter player GUID"
            />
          </label>
          <label className="field">
            Manager ID (GUID)
            <input
              value={adminActionState.managerId}
              onChange={(event) =>
                setAdminActionState((current) => ({
                  ...current,
                  managerId: event.target.value,
                }))
              }
              placeholder="Enter manager GUID"
            />
          </label>
          <label className="field">
            Reason
            <input
              value={adminActionState.reason}
              onChange={(event) =>
                setAdminActionState((current) => ({
                  ...current,
                  reason: event.target.value,
                }))
              }
              placeholder="Why is this action taken?"
            />
          </label>
          <div className="actions">
            <button type="submit" disabled={!canRunPlayerAction || grantVipLoading}>
              {grantVipLoading ? 'Granting...' : 'Grant VIP'}
            </button>
            <button
              type="button"
              onClick={handleRevokeVip}
              disabled={!canRunPlayerAction || revokeVipLoading}
            >
              {revokeVipLoading ? 'Revoking...' : 'Revoke VIP'}
            </button>
            <button
              type="button"
              onClick={handleBanPlayer}
              disabled={!canRunPlayerAction || banLoading}
            >
              {banLoading ? 'Banning...' : 'Ban player'}
            </button>
            <button
              type="button"
              onClick={handleUnbanPlayer}
              disabled={!canRunPlayerAction || unbanLoading}
            >
              {unbanLoading ? 'Unbanning...' : 'Unban player'}
            </button>
          </div>
        </form>
        {grantVipError && <p className="status error">{grantVipError}</p>}
        {grantVipStatus && <p className="status success">{grantVipStatus}</p>}
        {revokeVipError && <p className="status error">{revokeVipError}</p>}
        {revokeVipStatus && (
          <p className="status success">{revokeVipStatus}</p>
        )}
        {banError && <p className="status error">{banError}</p>}
        {banStatus && <p className="status success">{banStatus}</p>}
        {unbanError && <p className="status error">{unbanError}</p>}
        {unbanStatus && <p className="status success">{unbanStatus}</p>}
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Upcoming daily schedules</h2>
          <p>GET /api/daily-schedules/upcoming</p>
        </div>
        <div className="actions">
          <button type="button" onClick={loadSchedules} disabled={scheduleLoading}>
            {scheduleLoading ? 'Loading...' : 'Load schedules'}
          </button>
        </div>
        {scheduleError && <p className="status error">{scheduleError}</p>}
        {!scheduleError && schedules.length === 0 && !scheduleLoading && (
          <p className="status muted">No schedules loaded yet.</p>
        )}
        {schedules.length > 0 && (
          <div className="list">
            {schedules.map((schedule) => (
              <article className="list-item" key={schedule.dailyScheduleId}>
                <div>
                  <h3>{schedule.dailyScheduleId}</h3>
                  <p className="muted">Manager {schedule.managerId}</p>
                </div>
                <div className="list-meta">
                  <span>{schedule.status}</span>
                  <span>
                    {schedule.windowStart} → {schedule.windowEnd}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
