import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api'

interface Leave { id: string; employeeId: string; startDate: string; endDate: string; type: string; reason: string; status: string; adminNote?: string }
interface Employee { id: string; name: string }

export default function AdminLeaves() {
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [lvs, emps] = await Promise.all([
        api.leave.list(),
        (api.employee.list() as unknown as Promise<Employee[]>),
      ])
      setLeaves(lvs)
      setEmployees(emps)
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const nameFor = (id: string) => employees.find(e => e.id === id)?.name || id

  const setStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.leave.setStatus(id, status)
      load()
    } catch { /* ignore */ }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 style={{ margin: 0, color: 'var(--color-green-dark)', marginBottom: 'var(--space-6)' }}>Leave Requests</h1>

      <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-cream-dark)' }}>
              <th style={th}>Employee</th>
              <th style={th}>Start</th>
              <th style={th}>End</th>
              <th style={th}>Type</th>
              <th style={th}>Reason</th>
              <th style={th}>Status</th>
              <th style={{ ...th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.slice().reverse().map(l => (
              <tr key={l.id} style={{ borderTop: '1px solid var(--color-cream-dark)' }}>
                <td style={td}>{nameFor(l.employeeId)}</td>
                <td style={td}>{l.startDate}</td>
                <td style={td}>{l.endDate}</td>
                <td style={td}>{l.type}</td>
                <td style={td}>{l.reason || '—'}</td>
                <td style={td}>
                  <span style={{ padding: '2px 10px', borderRadius: 'var(--radius-sm)', fontSize: 12,
                    background: l.status === 'approved' ? '#e8f5e9' : l.status === 'rejected' ? '#fde8e8' : '#fff3cd',
                    color: l.status === 'approved' ? '#2d6a4f' : l.status === 'rejected' ? '#c33' : '#856404' }}>
                    {l.status}
                  </span>
                </td>
                <td style={{ ...td, textAlign: 'right' }}>
                  {l.status === 'pending' && (
                    <>
                      <button onClick={() => setStatus(l.id, 'approved')} style={{ ...btn, background: '#e8f5e9', color: '#2d6a4f' }}>Approve</button>
                      <button onClick={() => setStatus(l.id, 'rejected')} style={{ ...btn, background: '#fde8e8', color: '#c33' }}>Reject</button>
                    </>
                  )}
                  {l.status !== 'pending' && <span style={{ fontSize: 'var(--font-size-sm)', color: '#999' }}>—</span>}
                </td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#999' }}>No leave requests</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const th: React.CSSProperties = { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)', fontWeight: 600 }
const td: React.CSSProperties = { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }
const btn: React.CSSProperties = { padding: 'var(--space-1) var(--space-3)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginRight: 8 }
