import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEmployeeAuth } from '../../hooks/useEmployeeAuth'
import { useGeolocation } from '../../hooks/useGeolocation'
import { api } from '../../api'

interface EmployeeProfile {
  id: string
  name: string
  role: string
  department: string
  phone: string
  email: string
  startDate: string
  salary: number
  bankName: string
  bankAccount: string
  taxId: string
  username: string
  attendance: Attendance[]
  leaves: Leave[]
}

interface Attendance { id: string; employeeId: string; date: string; checkIn: string; checkOut: string; status: string; latitude?: string; longitude?: string; locationLabel?: string }
interface Leave { id: string; startDate: string; endDate: string; type: string; reason: string; status: string; adminNote?: string }

const today = () => new Date().toISOString().slice(0, 10)

export default function EmployeeDashboard() {
  const { token, logout, username } = useEmployeeAuth()
  const { getPosition } = useGeolocation()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<EmployeeProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [view, setView] = useState<'status' | 'attendance' | 'leave'>('status')

  const [leaveForm, setLeaveForm] = useState({ startDate: '', endDate: '', type: 'annual', reason: '' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.employee.me()
      setProfile(data)
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  if (!token) return null
  if (!username) return null

  if (loading) return <div style={centered}>Loading...</div>
  if (!profile) return <div style={centered}>Unable to load profile. <button onClick={logout}>Log out</button></div>

  const todayRec = profile.attendance.find(a => a.date === today())
  const approvedLeave = profile.leaves.find(l => l.status === 'approved' && l.startDate <= today() && l.endDate >= today())
  const onLeaveToday = !!approvedLeave

  let statusText = 'Not checked in'
  let statusColor = '#777'
  let statusBg = '#eee'
  let hours = ''
  if (onLeaveToday) {
    statusText = 'On approved leave'
    statusColor = '#856404'
    statusBg = '#fff3cd'
  } else if (todayRec) {
    if (todayRec.checkIn) hours = calcHours(todayRec.checkIn, todayRec.checkOut)
    if (todayRec.checkIn && !todayRec.checkOut) {
      statusText = 'Checked in'
      statusColor = '#2d6a4f'
      statusBg = '#e8f5e9'
    } else if (todayRec.checkIn && todayRec.checkOut) {
      statusText = 'Checked out'
      statusColor = '#2d6a4f'
      statusBg = '#e8f5e9'
    } else if (todayRec.status === 'absent') {
      statusText = 'Marked absent'
      statusColor = '#c33'
      statusBg = '#fde8e8'
    }
  }

  const doCheckIn = async () => {
    setMessage(null)
    const pos = await getPosition()
    try {
      await api.employee.markAttendance(profile.id, 'checkin', {
        latitude: pos?.latitude,
        longitude: pos?.longitude,
      })
      setMessage({ type: 'ok', text: 'Checked in successfully' })
      load()
    } catch (e: any) {
      setMessage({ type: 'err', text: e.message || 'Failed to check in' })
      load()
    }
  }

  const doCheckOut = async () => {
    setMessage(null)
    const pos = await getPosition()
    try {
      await api.employee.markAttendance(profile.id, 'checkout', {
        latitude: pos?.latitude,
        longitude: pos?.longitude,
      })
      setMessage({ type: 'ok', text: 'Checked out successfully' })
      load()
    } catch (e: any) {
      setMessage({ type: 'err', text: e.message || 'Failed to check out' })
      load()
    }
  }

  const submitLeave = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      await api.leave.create(leaveForm)
      setMessage({ type: 'ok', text: 'Leave request submitted' })
      setLeaveForm({ startDate: '', endDate: '', type: 'annual', reason: '' })
      load()
    } catch (e: any) {
      setMessage({ type: 'err', text: e.message || 'Failed to submit leave' })
    }
  }

  const isCheckedIn = !!todayRec?.checkIn && !todayRec?.checkOut
  const isCheckedOut = !!todayRec?.checkOut
  const statusTab = (
    <div>
      <div style={statusCard}>
        <div style={{ fontSize: 'var(--font-size-sm)', color: '#666' }}>Today's status</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>
          <span style={{ padding: '4px 14px', borderRadius: 'var(--radius-md)', background: statusBg, color: statusColor }}>{statusText}</span>
        </div>
        {hours && <div style={{ marginTop: 'var(--space-2)', color: '#666' }}>Hours worked: {hours}</div>}
        {todayRec && todayRec.latitude && (
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-sm)', color: '#2d6a4f' }}>
            Checked in from: {todayRec.locationLabel || `${todayRec.latitude}, ${todayRec.longitude}`}
          </div>
        )}
        <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
          <button onClick={doCheckIn} disabled={isCheckedIn || isCheckedOut || onLeaveToday}
            style={{ ...actionBtn, background: 'var(--color-green-dark)', color: '#fff', opacity: (isCheckedIn || isCheckedOut || onLeaveToday) ? 0.5 : 1 }}>
            Check In
          </button>
          <button onClick={doCheckOut} disabled={!isCheckedIn}
            style={{ ...actionBtn, background: onLeaveToday ? '#e0a800' : '#BC6C25', color: '#fff', opacity: isCheckedIn ? 1 : 0.5 }}>
            Check Out
          </button>
        </div>
        {onLeaveToday && <div style={{ marginTop: 'var(--space-3)', color: '#856404' }}>You are on approved leave today.</div>}
      </div>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-3)', color: 'var(--color-green-dark)' }}>My Profile</h2>
        <div style={infoGrid}>
          <Info label="Name" value={profile.name} />
          <Info label="Role" value={profile.role} />
          <Info label="Department" value={profile.department} />
          <Info label="Phone" value={profile.phone} />
          <Info label="Email" value={profile.email} />
          <Info label="Start Date" value={profile.startDate} />
          <Info label="Salary (RWF)" value={profile.salary ? String(profile.salary) : '—'} />
          <Info label="Bank" value={profile.bankName || '—'} />
          <Info label="Bank Account" value={profile.bankAccount || '—'} />
          <Info label="Tax ID" value={profile.taxId || '—'} />
        </div>
      </div>
    </div>
  )

  const attendanceTab = (
    <div>
      <h2 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-3)', color: 'var(--color-green-dark)' }}>Attendance History</h2>
      <div className="tab-card tab-scroll" style={tableWrap}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: 'var(--color-cream-dark)' }}>
            <th style={th}>Date</th><th style={th}>Check In</th><th style={th}>Check Out</th><th style={th}>Hours</th><th style={th}>Location</th><th style={th}>Status</th>
          </tr></thead>
          <tbody>
            {profile.attendance.slice().reverse().map(a => (
              <tr key={a.id} style={{ borderTop: '1px solid var(--color-cream-dark)' }}>
                <td style={td}>{a.date}</td>
                <td style={td}>{a.checkIn || '—'}</td>
                <td style={td}>{a.checkOut || '—'}</td>
                <td style={td}>{a.checkIn && a.checkOut ? calcHours(a.checkIn, a.checkOut) : '—'}</td>
                <td style={td}>{a.latitude ? (a.locationLabel || `${a.latitude}, ${a.longitude}`) : '—'}</td>
                <td style={td}><span style={{ ...statusPill, background: a.status === 'present' ? '#e8f5e9' : '#fde8e8', color: a.status === 'present' ? '#2d6a4f' : '#c33' }}>{a.status || '—'}</span></td>
              </tr>
            ))}
            {profile.attendance.length === 0 && <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: '#999' }}>No attendance records yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )

  const leaveTab = (
    <div>
      <h2 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-3)', color: 'var(--color-green-dark)' }}>Request Leave</h2>
      <form onSubmit={submitLeave} style={{ background: '#fff', padding: 'var(--space-5)', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: 520 }}>
        <div className="rd-grid-2">
          <div>
            <label style={label}>Start Date</label>
            <input type="date" required style={field} value={leaveForm.startDate} onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })} />
          </div>
          <div>
            <label style={label}>End Date</label>
            <input type="date" required style={field} value={leaveForm.endDate} onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })} />
          </div>
        </div>
        <div style={{ marginTop: 'var(--space-3)' }}>
          <label style={label}>Type</label>
          <select style={field} value={leaveForm.type} onChange={e => setLeaveForm({ ...leaveForm, type: e.target.value })}>
            <option value="annual">Annual</option>
            <option value="sick">Sick</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div style={{ marginTop: 'var(--space-3)' }}>
          <label style={label}>Reason</label>
          <textarea style={{ ...field, minHeight: 70 }} value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })} />
        </div>
        <button type="submit" style={{ ...actionBtn, background: 'var(--color-green-dark)', color: '#fff', marginTop: 'var(--space-4)' }}>Submit Request</button>
      </form>

      <h2 style={{ fontSize: 'var(--font-size-base)', margin: 'var(--space-6) 0 var(--space-3)', color: 'var(--color-green-dark)' }}>My Leave Requests</h2>
      <div className="tab-card tab-scroll" style={tableWrap}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: 'var(--color-cream-dark)' }}>
            <th style={th}>Start</th><th style={th}>End</th><th style={th}>Type</th><th style={th}>Reason</th><th style={th}>Status</th>
          </tr></thead>
          <tbody>
            {profile.leaves.slice().reverse().map(l => (
              <tr key={l.id} style={{ borderTop: '1px solid var(--color-cream-dark)' }}>
                <td style={td}>{l.startDate}</td>
                <td style={td}>{l.endDate}</td>
                <td style={td}>{l.type}</td>
                <td style={td}>{l.reason || '—'}</td>
                <td style={td}>
                  <span style={{ ...statusPill, background: l.status === 'approved' ? '#e8f5e9' : l.status === 'rejected' ? '#fde8e8' : '#fff3cd', color: l.status === 'approved' ? '#2d6a4f' : l.status === 'rejected' ? '#c33' : '#856404' }}>{l.status}</span>
                </td>
              </tr>
            ))}
            {profile.leaves.length === 0 && <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: '#999' }}>No leave requests yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" style={{ width: 200 }}>
        <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>My Dashboard</h2>
          <p style={{ margin: 'var(--space-2) 0 0', fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>{username}</p>
        </div>
        <nav style={{ flex: 1 }}>
          {([['status', 'Today'], ['attendance', 'My Attendance'], ['leave', 'Leave']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setView(key)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-1)', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: 'var(--font-size-sm)', background: view === key ? 'rgba(255,255,255,0.15)' : 'transparent', color: '#fff' }}>
              {label}
            </button>
          ))}
        </nav>
        <div style={{ padding: 'var(--space-3)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={logout}
            style={{ width: '100%', padding: 'var(--space-2) var(--space-3)', background: 'transparent', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
            Sign Out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <h1 style={{ margin: 0, color: 'var(--color-green-dark)' }}>Welcome, {profile.name.split(' ')[0]}</h1>
          <button onClick={() => navigate('/')} style={{ padding: 'var(--space-2) var(--space-4)', background: 'transparent', color: 'var(--color-green-dark)', border: '1px solid var(--color-green-dark)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
            View Site
          </button>
        </div>
        {message && (
          <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)', background: message.type === 'ok' ? '#e8f5e9' : '#fee', color: message.type === 'ok' ? '#2d6a4f' : '#c33' }}>
            {message.text}
          </div>
        )}
        {view === 'status' && statusTab}
        {view === 'attendance' && attendanceTab}
        {view === 'leave' && leaveTab}
      </main>
    </div>
  )
}

function calcHours(inTime: string, outTime?: string) {
  if (!outTime) return ''
  const [ih, im] = inTime.split(':').map(Number)
  const [oh, om] = outTime.split(':').map(Number)
  let mins = (oh * 60 + om) - (ih * 60 + im)
  if (mins < 0) mins += 24 * 60
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}

const centered: React.CSSProperties = { padding: 'var(--space-10)', textAlign: 'center' }
const statusCard: React.CSSProperties = { background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 'var(--space-6)', maxWidth: 520 }
const actionBtn: React.CSSProperties = { padding: 'var(--space-2) var(--space-5)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, fontSize: 'var(--font-size-base)' }
const infoGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }
const th: React.CSSProperties = { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)', fontWeight: 600 }
const td: React.CSSProperties = { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }
const tableWrap: React.CSSProperties = { background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
const label: React.CSSProperties = { display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }
const field: React.CSSProperties = { width: '100%', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-cream-dark)', borderRadius: 'var(--radius-sm)', boxSizing: 'border-box' }
const statusPill: React.CSSProperties = { padding: '2px 10px', borderRadius: 'var(--radius-sm)', fontSize: 12 }

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', padding: 'var(--space-3)' }}>
      <div style={{ fontSize: 'var(--font-size-sm)', color: '#888' }}>{label}</div>
      <div style={{ fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  )
}
