import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FaDumbbell, FaVideo, FaPlay, FaClock, FaUsers, FaHistory,
  FaCalendarAlt, FaExternalLinkAlt, FaLink, FaPlus, FaTrash, FaEdit, FaEnvelope,
} from 'react-icons/fa'
import { api } from '../../api'

interface Workout {
  id: string
  title: string
  description?: string
  trainer: string
  category: string
  difficulty: string
  duration: number
  videoUrl?: string
}

interface LiveSession {
  id: string
  title: string
  description?: string
  trainer: string
  scheduledAt: string
  duration: number
  joinUrl?: string
  status: string
  reminderMinutes?: number
}

interface Rsvp {
  id: string
  sessionId: string
  name: string
  email: string
  remindedAt?: string | null
  createdAt?: string
}

const CATEGORY_COLORS: Record<string, string> = {
  strength: '#B6582A',
  cardio: '#dc2626',
  yoga: '#4B9F46',
  flexibility: '#3A86FF',
  dance: '#6A4C93',
}

const EMPTY_SESSION = {
  title: '',
  description: '',
  trainer: 'Isôoko Coach',
  scheduledAt: '',
  duration: 45,
  joinUrl: '',
  status: 'upcoming',
  reminderMinutes: 30,
}

export default function AdminGymDashboard() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_SESSION })
  const [editId, setEditId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [w, l, r] = await Promise.all([
        api.get<Workout>('/api/gym-workouts'),
        api.get<LiveSession>('/api/gym-live-sessions'),
        api.get<Rsvp>('/api/gym-rsvps'),
      ])
      setWorkouts(Array.isArray(w) ? w : [])
      setSessions(Array.isArray(l) ? l : [])
      setRsvps(Array.isArray(r) ? r : [])
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const rsvpCount = (sessionId: string) => rsvps.filter(r => r.sessionId === sessionId).length
  const toggleList = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const now = new Date()

  const activeSessions = sessions
    .filter(s => {
      const start = new Date(s.scheduledAt).getTime()
      const end = start + (s.duration || 60) * 60 * 1000
      return now.getTime() >= start && now.getTime() <= end && s.status !== 'cancelled'
    })
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())

  const upcomingSessions = sessions
    .filter(s => new Date(s.scheduledAt) > now && s.status !== 'cancelled')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())

  const pastSessions = sessions
    .filter(s => new Date(s.scheduledAt).getTime() + (s.duration || 60) * 60 * 1000 < now.getTime() || s.status === 'cancelled')
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())

  const totalMinutes = workouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0)
  const totalTrainers = new Set([...workouts.map(w => w.trainer), ...sessions.map(s => s.trainer)]).size

  const setField = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }))

  const resetForm = () => {
    setForm({ ...EMPTY_SESSION })
    setEditId(null)
    setMessage('')
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const payload = {
      ...form,
      scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : '',
    }
    try {
      if (editId) {
        await api.update('/api/gym-live-sessions', editId, payload)
        setMessage('Session updated.')
      } else {
        await api.create('/api/gym-live-sessions', payload)
        setMessage('Live session scheduled.')
      }
      resetForm()
      load()
    } catch {
      setMessage('Something went wrong. Check the fields and try again.')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this live session?')) return
    try {
      await api.delete('/api/gym-live-sessions', id)
      load()
    } catch { /* ignore */ }
  }

  const startEdit = (s: LiveSession) => {
    setForm({
      title: s.title,
      description: s.description || '',
      trainer: s.trainer,
      scheduledAt: s.scheduledAt.slice(0, 16),
      duration: s.duration,
      joinUrl: s.joinUrl || '',
      status: s.status,
      reminderMinutes: s.reminderMinutes || 30,
    })
    setEditId(s.id)
    window.scrollTo(0, 0)
  }

  const statCard = (label: string, value: number, icon: React.ReactNode, color: string) => (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}1a`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
      <div>
        <p style={{ margin: 0, fontSize: 'var(--font-size-2xl)', fontWeight: 700, lineHeight: 1.1 }}>{value}</p>
        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: '#667' }}>{label}</p>
      </div>
    </div>
  )

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-cream-dark)',
    borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-sm)',
  }
  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }

  const attendeesFor = (sessionId: string) => rsvps.filter(r => r.sessionId === sessionId).sort((a, b) => new Date(a.remindedAt || a.createdAt || 0).getTime() - new Date(b.remindedAt || b.createdAt || 0).getTime())

  const Signups = ({ sessionId, dark }: { sessionId: string; dark?: boolean }) => {
    const members = attendeesFor(sessionId)
    const count = members.length
    const isOpen = !!expanded[sessionId]
    const subtle = dark ? 'rgba(255,255,255,0.7)' : '#667'
    const pillBg = dark ? 'rgba(255,255,255,0.12)' : '#e8f5e9'
    const pillColor = dark ? '#fff' : 'var(--color-green-dark)'
    if (count === 0) {
      return <span style={{ fontSize: 'var(--font-size-xs)', color: subtle }}>No reminder sign-ups yet</span>
    }
    return (
      <span style={{ fontSize: 'var(--font-size-xs)' }}>
        <button
          onClick={() => toggleList(sessionId)}
          style={{ background: pillBg, color: pillColor, border: 'none', borderRadius: 999, padding: '3px 10px', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <FaEnvelope size={11} /> {count} {count === 1 ? 'sign-up' : 'sign-ups'}
        </button>
        {isOpen && (
          <span style={{ display: 'block', marginTop: 'var(--space-2)', background: dark ? 'rgba(255,255,255,0.08)' : '#faf7f4', border: `1px solid ${dark ? 'rgba(255,255,255,0.15)' : 'var(--color-cream-dark)'}`, borderRadius: 'var(--radius-sm)', padding: 'var(--space-2)', color: subtle }}>
            {members.map(m => (
              <span key={m.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', padding: '2px 0', fontSize: 'var(--font-size-sm)' }}>
                <span>{m.name} · <span style={{ opacity: 0.85 }}>{m.email}</span></span>
                {m.remindedAt
                  ? <span style={{ color: '#4B9F46', fontWeight: 600 }}>reminded</span>
                  : <span style={{ color: '#c88a1a' }}>pending</span>}
              </span>
            ))}
          </span>
        )}
      </span>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <h1 style={{ margin: 0, color: 'var(--color-green-dark)' }}>Gym Manager</h1>
          <p style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--font-size-sm)', color: '#667' }}>Prepare live sessions and monitor all gym activity</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Link to="/admin/gym-workouts" className="btn" style={{ fontSize: 'var(--font-size-sm)' }}><FaDumbbell style={{ marginRight: 6 }} /> Manage Workouts</Link>
          <Link to="/admin/gym-live-sessions" className="btn" style={{ fontSize: 'var(--font-size-sm)', background: '#17191F', borderColor: '#17191F', color: '#fff' }}><FaVideo style={{ marginRight: 6 }} /> All Live Sessions</Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {statCard('Workout Videos', workouts.length, <FaDumbbell />, '#B6582A')}
        {statCard('Live Now', activeSessions.length, <FaPlay />, '#dc2626')}
        {statCard('Upcoming Live', upcomingSessions.length, <FaClock />, '#3A86FF')}
        {statCard('Completed', pastSessions.length, <FaHistory />, '#6A4C93')}
        {statCard('Trainers', totalTrainers, <FaUsers />, '#4B9F46')}
        {statCard('Minutes of Content', totalMinutes, <FaCalendarAlt />, '#E9C46A')}
      </div>

      {message && (
        <div style={{ padding: 'var(--space-3) var(--space-4)', background: editId ? '#fff8e1' : '#e8f5e9', color: '#333', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 420px) 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Live Session Preparation */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <FaVideo style={{ color: '#dc2626' }} /> {editId ? 'Edit Live Session' : 'Prepare a Live Session'}
          </h2>
          <p style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--font-size-sm)', color: '#667' }}>
            Schedule a session; the join link is opened when the session is live.
          </p>

          <div style={{ marginBottom: 'var(--space-3)' }}>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={e => setField('title', e.target.value)} placeholder="e.g. Community Zumba Live" />
          </div>
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }} value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Short description for members" />
          </div>
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <label style={labelStyle}>Trainer *</label>
            <input style={inputStyle} value={form.trainer} onChange={e => setField('trainer', e.target.value)} />
          </div>
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <label style={labelStyle}>Start Date &amp; Time *</label>
            <input style={inputStyle} type="datetime-local" value={form.scheduledAt} onChange={e => setField('scheduledAt', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <div>
              <label style={labelStyle}>Duration (min)</label>
              <input style={inputStyle} type="number" min={5} value={form.duration} onChange={e => setField('duration', Number(e.target.value))} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.status} onChange={e => setField('status', e.target.value)}>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active / Live</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={labelStyle}>Remind subscribers (min before start)</label>
            <input style={inputStyle} type="number" min={1} value={form.reminderMinutes} onChange={e => setField('reminderMinutes', Number(e.target.value))} />
          </div>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={labelStyle}>Join Link (Meet / Zoom / YouTube) *</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <FaLink style={{ color: '#999' }} />
              <input style={inputStyle} value={form.joinUrl} onChange={e => setField('joinUrl', e.target.value)} placeholder="https://meet.google.com/..." />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button onClick={handleSave} disabled={saving || !form.title || !form.scheduledAt || !form.joinUrl}
              style={{ padding: 'var(--space-2) var(--space-5)', background: 'var(--color-green-dark)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', opacity: saving || !form.title || !form.scheduledAt || !form.joinUrl ? 0.6 : 1 }}>
              <FaPlus /> {saving ? 'Saving...' : editId ? 'Update Session' : 'Schedule Session'}
            </button>
            {editId && (
              <button onClick={resetForm} style={{ padding: 'var(--space-2) var(--space-5)', background: '#eee', color: '#333', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Cancel</button>
            )}
          </div>
        </div>

        {/* Gym activity */}
        <div>
          {/* Live now */}
          <div style={{ background: '#17191F', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--font-size-lg)', color: '#fff', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#dc2626', display: 'inline-block', boxShadow: '0 0 0 4px rgba(220,38,38,0.3)' }} />
              On Air Right Now
              <span style={{ marginLeft: 'auto', fontSize: 'var(--font-size-sm)', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
                {activeSessions.length} {activeSessions.length === 1 ? 'session' : 'sessions'}
              </span>
            </h2>
            {activeSessions.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--font-size-sm)', margin: 0 }}>No session is airing right now. Schedule one to go live.</p>
            ) : (
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {activeSessions.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)', flexWrap: 'wrap' }}>
                    <span style={{ padding: '2px 10px', borderRadius: 999, background: '#dc2626', color: '#fff', fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>LIVE</span>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <p style={{ margin: 0, fontWeight: 600, color: '#fff' }}>{s.title}</p>
                      <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'rgba(255,255,255,0.7)' }}>{s.trainer}</p>
                      <div style={{ marginTop: 4 }}>
                        <Signups sessionId={s.id} dark />
                      </div>
                    </div>
                    <a href={s.joinUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: 'var(--space-1) var(--space-3)', background: '#4B9F46', color: '#fff', borderRadius: 999, fontSize: 'var(--font-size-sm)', textDecoration: 'none', fontWeight: 600 }}>
                      <FaExternalLinkAlt size={12} /> Join
                    </a>
                    <button onClick={() => startEdit(s)} title="Edit" style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}><FaEdit /></button>
                    <button onClick={() => handleDelete(s.id)} title="Delete" style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}><FaTrash /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--font-size-lg)', color: 'var(--color-green-dark)' }}>Upcoming Sessions</h2>
            {upcomingSessions.length === 0 ? (
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: '#667' }}>Nothing scheduled yet. Prepare a live session to the left.</p>
            ) : (
              <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                {upcomingSessions.map(s => {
                  const d = new Date(s.scheduledAt)
                  return (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-cream-dark)', flexWrap: 'wrap' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eef3ee', color: 'var(--color-green-dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-xs)', fontWeight: 700, flexShrink: 0 }}>
                        <span>{d.getDate()}</span>
                        <span style={{ fontSize: 10, textTransform: 'uppercase' }}>{d.toLocaleString('en', { month: 'short' })}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <p style={{ margin: 0, fontWeight: 600 }}>{s.title}</p>
                        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: '#667' }}>
                          {s.trainer} · {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {s.duration} min
                          {s.reminderMinutes ? ` · remind ${s.reminderMinutes}m before` : ''}
                        </p>
                        <div style={{ marginTop: 4 }}>
                          <Signups sessionId={s.id} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ padding: '2px 10px', borderRadius: 999, background: '#e8f5e9', color: 'var(--color-green-dark)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>{s.status}</span>
                        <button onClick={() => startEdit(s)} style={{ background: '#e8f5e9', color: 'var(--color-green-dark)', border: 'none', borderRadius: 'var(--radius-sm)', padding: 'var(--space-1) var(--space-3)', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}><FaEdit /> Edit</button>
                        <button onClick={() => handleDelete(s.id)} style={{ background: '#fde8e8', color: '#c33', border: 'none', borderRadius: 'var(--radius-sm)', padding: 'var(--space-1) var(--space-3)', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}><FaTrash /> Del</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent workouts */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: '0 0 var(--space-3)', fontSize: 'var(--font-size-lg)', color: 'var(--color-green-dark)' }}>Gym Workouts</h2>
            {loading ? (
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: '#667' }}>Loading...</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {workouts.map(w => (
                  <span key={w.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: '#faf7f4', border: '1px solid var(--color-cream-dark)', borderRadius: 999, fontSize: 'var(--font-size-sm)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[w.category] || '#4B9F46' }} />
                    {w.title}
                    <span style={{ color: '#999', fontSize: 'var(--font-size-xs)' }}>{w.duration}m</span>
                  </span>
                ))}
                {workouts.length === 0 && <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: '#667' }}>No workouts yet.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}