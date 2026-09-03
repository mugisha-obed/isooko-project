import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api'

interface Employee { id: string; name: string; active: boolean }
interface Attendance { id: string; employeeId: string; date: string; checkIn: string; checkOut: string; status: string; latitude?: string; longitude?: string; locationLabel?: string }

export default function AdminAttendance() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [records, setRecords] = useState<Attendance[]>([])
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(true)
  const [mapFor, setMapFor] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [emps, att] = await Promise.all([
        (api.employee.list() as unknown as Promise<Employee[]>),
        api.attendance.list(),
      ])
      setEmployees(emps)
      setRecords(att)
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const dayRecords = records.filter(r => r.date === date)

  const recordFor = (id: string) => dayRecords.find(r => r.employeeId === id)

  const markPresent = async (employeeId: string) => {
    const existing = recordFor(employeeId)
    try {
      if (existing) {
        await api.attendance.update(existing.id, { employeeId, date, status: 'present', checkIn: existing.checkIn || now(), checkOut: existing.checkOut || '' })
      } else {
        await api.attendance.create({ employeeId, date, status: 'present', checkIn: now(), checkOut: '' })
      }
      load()
    } catch { /* ignore */ }
  }

  const markAbsent = async (employeeId: string) => {
    const existing = recordFor(employeeId)
    try {
      if (existing) {
        await api.attendance.update(existing.id, { employeeId, date, status: 'absent', checkIn: '', checkOut: '' })
      } else {
        await api.attendance.create({ employeeId, date, status: 'absent' })
      }
      load()
    } catch { /* ignore */ }
  }

  const deleteRecord = async (id: string) => {
    if (!confirm('Remove this attendance record?')) return
    try {
      await api.attendance.delete(id)
      load()
    } catch { /* ignore */ }
  }

  const present = dayRecords.filter(r => r.status === 'present').length

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <h1 style={{ margin: 0, color: 'var(--color-green-dark)' }}>Attendance</h1>
        <div className="rd-flex-end" style={{ alignItems: 'center' }}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-cream-dark)', borderRadius: 'var(--radius-sm)' }} />
          <span style={{ fontSize: 'var(--font-size-sm)', color: '#666' }}>{present} present · {employees.length} total</span>
        </div>
      </div>

      <div className="tab-card tab-scroll">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-cream-dark)' }}>
              <th style={th}>Employee</th>
              <th style={th}>Check In</th>
              <th style={th}>Check Out</th>
              <th style={th}>Location</th>
              <th style={th}>Status</th>
              <th style={{ ...th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.filter(e => e.active).map(emp => {
              const rec = recordFor(emp.id)
              return (
                <tr key={emp.id} style={{ borderTop: '1px solid var(--color-cream-dark)' }}>
                  <td style={td}>{emp.name}</td>
                  <td style={td}>{rec?.checkIn || '—'}</td>
                  <td style={td}>{rec?.checkOut || '—'}</td>
                  <td style={td}>
                    {rec?.latitude ? (
                      <div>
                        <div style={{ fontSize: 'var(--font-size-sm)' }}>{rec.locationLabel || `${rec.latitude}, ${rec.longitude}`}</div>
                        <button onClick={() => setMapFor(mapFor === rec.id ? null : rec.id)} style={{ padding: 0, border: 'none', background: 'none', color: 'var(--color-green-dark)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>
                          {mapFor === rec.id ? 'Hide map' : 'View map'}
                        </button>
                        {mapFor === rec.id && <MapEmbed latitude={rec.latitude} longitude={rec.longitude} />}
                      </div>
                    ) : (
                      <span style={{ color: '#999', fontSize: 'var(--font-size-sm)' }}>No location</span>
                    )}
                  </td>
                  <td style={td}>
                    <span style={{ padding: '2px 10px', borderRadius: 'var(--radius-sm)', fontSize: 12,
                      background: !rec ? '#eee' : rec.status === 'present' ? '#e8f5e9' : '#fde8e8',
                      color: !rec ? '#666' : rec.status === 'present' ? '#2d6a4f' : '#c33' }}>
                      {!rec ? 'Not marked' : rec.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <button onClick={() => markPresent(emp.id)} style={{ ...btn, background: '#e8f5e9', color: '#2d6a4f' }}>Present</button>
                    <button onClick={() => markAbsent(emp.id)} style={{ ...btn, background: '#fde8e8', color: '#c33' }}>Absent</button>
                    {rec && <button onClick={() => deleteRecord(rec.id)} style={{ ...btn, background: '#eee', color: '#666' }}>Clear</button>}
                  </td>
                </tr>
              )
            })}
            {employees.filter(e => e.active).length === 0 && (
              <tr><td colSpan={6} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#999' }}>No active employees</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MapEmbed({ latitude, longitude }: { latitude?: string; longitude?: string }) {
  if (!latitude || !longitude) return null
  const lat = Number(latitude)
  const lon = Number(longitude)
  const bbox = `${lon - 0.002},${lat - 0.002},${lon + 0.002},${lat + 0.002}`
  return (
    <iframe
      title="Attended location"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`}
      style={{ width: '100%', height: 180, border: '1px solid var(--color-cream-dark)', borderRadius: 'var(--radius-sm)', marginTop: 6 }}
      loading="lazy"
    />
  )
}

function now() { return new Date().toTimeString().slice(0, 5) }
const th: React.CSSProperties = { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)', fontWeight: 600 }
const td: React.CSSProperties = { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }
const btn: React.CSSProperties = { padding: 'var(--space-1) var(--space-3)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginRight: 8 }