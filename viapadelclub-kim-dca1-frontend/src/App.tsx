import { type FormEvent, useMemo, useState } from 'react'
import './App.css'
import { getUpcomingDailySchedules, registerPlayer } from './api/client'
import type {
  RegisterPlayerRequest,
  RegisterPlayerResponse,
  UpcomingDailySchedule,
} from './api/types'

const initialFormState: RegisterPlayerRequest = {
  playerId: '',
  universityCollegeName: '',
  isVip: false,
}

function App() {
  const [formState, setFormState] = useState<RegisterPlayerRequest>(
    initialFormState,
  )
  const [registerResult, setRegisterResult] =
    useState<RegisterPlayerResponse | null>(null)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [schedules, setSchedules] = useState<UpcomingDailySchedule[]>([])
  const [scheduleError, setScheduleError] = useState<string | null>(null)
  const [scheduleLoading, setScheduleLoading] = useState(false)
  const canSubmit = useMemo(() => {
    return formState.playerId.trim() && formState.universityCollegeName.trim()
  }, [formState.playerId, formState.universityCollegeName])

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
              value={formState.universityCollegeName}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  universityCollegeName: event.target.value,
                }))
              }
              placeholder="e.g. VIA University College"
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={formState.isVip}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  isVip: event.target.checked,
                }))
              }
            />
            VIP player
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
                <dd>{registerResult.universityCollegeName}</dd>
              </div>
              <div>
                <dt>VIP</dt>
                <dd>{registerResult.isVip ? 'Yes' : 'No'}</dd>
              </div>
              <div>
                <dt>Banned</dt>
                <dd>{registerResult.isBanned ? 'Yes' : 'No'}</dd>
              </div>
            </dl>
          </div>
        )}
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
