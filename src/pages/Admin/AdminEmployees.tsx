import { useState, useEffect, useCallback, useMemo } from 'react'
import { api } from '../../api'

interface Employee {
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
  active: boolean
  username: string
}

const empty: Employee = {
  id: '',
  name: '',
  role: '',
  department: '',
  phone: '',
  email: '',
  startDate: '',
  salary: 0,
  bankName: '',
  bankAccount: '',
  taxId: '',
  active: true,
  username: '',
}

export default function AdminEmployees() {
  const [items, setItems] = useState<Employee[]>([])
  const [editing, setEditing] = useState<Employee | null>(null)
  const [password, setPassword] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [detail, setDetail] = useState<{ attendance: any[]; leave: any[] } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = (await api.employee.list()) as unknown as Employee[]
      setItems(data)
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!editing) return
    const payload: Record<string, unknown> = { ...editing }
    if (password) payload.password = password
    try {
      if (isNew) await api.employee.create(payload)
      else await api.employee.update(editing.id, payload)
      setEditing(null)
      setPassword('')
      setIsNew(false)
      load()
    } catch { /* ignore */ }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this employee?')) return
    try {
      await api.employee.delete(id)
      load()
    } catch { /* ignore */ }
  }

  const showDetail = async (id: string) => {
    setSelected(id)
    const [attendance, leave] = await Promise.all([
      api.employee.attendance(id).catch(() => [] as any[]),
      api.employee.leave(id).catch(() => [] as any[]),
    ])
    setDetail({ attendance, leave })
  }

  const setField = (key: keyof Employee, value: unknown) => {
    setEditing(prev => prev ? { ...prev, [key]: value } : null)
  }

  const departments = useMemo(() => Array.from(new Set(items.map(i => i.department).filter(Boolean))), [items])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ margin: 0, color: 'var(--color-green-dark)' }}>Employees</h1>
        <button onClick={() => { setEditing({ ...empty }); setIsNew(true); setPassword('') }} style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-green-dark)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}>
          + Add Employee
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-cream-dark)' }}>
              <th style={th}>Name</th>
              <th style={th}>Role</th>
              <th style={th}>Department</th>
              <th style={th}>Email</th>
              <th style={th}>Status</th>
              <th style={{ ...th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderTop: '1px solid var(--color-cream-dark)' }}>
                <td style={td}>{item.name}</td>
                <td style={td}>{item.role}</td>
                <td style={td}>{item.department}</td>
                <td style={td}>{item.email}</td>
                <td style={td}>
                  <span style={{ padding: '2px 10px', borderRadius: 'var(--radius-sm)', fontSize: 12, background: item.active ? '#e8f5e9' : '#fde8e8', color: item.active ? '#2d6a4f' : '#c33' }}>
                    {item.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ ...td, textAlign: 'right' }}>
                  <button onClick={() => showDetail(item.id)} style={btn}>Details</button>
                  <button onClick={() => { setEditing({ ...item }); setIsNew(false); setPassword('') }} style={btn}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ ...btn, background: '#fde8e8', color: '#c33' }}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#999' }}>No employees yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div style={modalOverlay} onClick={() => setEditing(null)}>
          <div style={modal} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>{isNew ? 'Add' : 'Edit'} Employee</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <Field label="Name">
                <input style={input} value={editing.name} onChange={e => setField('name', e.target.value)} />
              </Field>
              <Field label="Role">
                <input style={input} value={editing.role} onChange={e => setField('role', e.target.value)} />
              </Field>
              <Field label="Department">
                <input style={input} list="dept-list" value={editing.department} onChange={e => setField('department', e.target.value)} />
                <datalist id="dept-list">{departments.map(d => <option key={d} value={d} />)}</datalist>
              </Field>
              <Field label="Phone">
                <input style={input} value={editing.phone} onChange={e => setField('phone', e.target.value)} />
              </Field>
              <Field label="Email">
                <input style={input} value={editing.email} onChange={e => setField('email', e.target.value)} />
              </Field>
              <Field label="Start Date">
                <input style={input} type="date" value={editing.startDate} onChange={e => setField('startDate', e.target.value)} />
              </Field>
              <Field label="Salary (RWF)">
                <input style={input} type="number" value={editing.salary} onChange={e => setField('salary', Number(e.target.value))} />
              </Field>
              <Field label="Bank Name">
                <input style={input} value={editing.bankName} onChange={e => setField('bankName', e.target.value)} />
              </Field>
              <Field label="Bank Account">
                <input style={input} value={editing.bankAccount} onChange={e => setField('bankAccount', e.target.value)} />
              </Field>
              <Field label="Tax ID">
                <input style={input} value={editing.taxId} onChange={e => setField('taxId', e.target.value)} />
              </Field>
              <Field label="Username">
                <input style={input} value={editing.username} onChange={e => setField('username', e.target.value)} />
              </Field>
              <Field label={isNew ? 'Password' : 'New Password (leave blank to keep)'}>
                <input style={input} type="text" value={password} onChange={e => setPassword(e.target.value)} />
              </Field>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'var(--space-3)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
              <input type="checkbox" checked={editing.active} onChange={e => setField('active', e.target.checked)} style={{ width: 18, height: 18 }} />
              Active (can log in)
            </label>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <button onClick={handleSave} style={saveBtn}>Save</button>
              <button onClick={() => setEditing(null)} style={cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {selected && detail && (
        <div style={modalOverlay} onClick={() => { setSelected(null); setDetail(null) }}>
          <div style={{ ...modal, maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>Details — {items.find(i => i.id === selected)?.name}</h2>
            <h3 style={{ fontSize: 'var(--font-size-base)', margin: 'var(--space-3) 0' }}>Attendance</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: 'var(--color-cream-dark)' }}>
                <th style={th}>Date</th><th style={th}>In</th><th style={th}>Out</th><th style={th}>Status</th>
              </tr></thead>
              <tbody>
                {detail.attendance.slice().reverse().map(a => (
                  <tr key={a.id} style={{ borderTop: '1px solid var(--color-cream-dark)' }}>
                    <td style={td}>{a.date}</td><td style={td}>{a.checkIn || '—'}</td><td style={td}>{a.checkOut || '—'}</td><td style={td}>{a.status || '—'}</td>
                  </tr>
                ))}
                {detail.attendance.length === 0 && <tr><td colSpan={4} style={td}>No attendance records</td></tr>}
              </tbody>
            </table>
            <h3 style={{ fontSize: 'var(--font-size-base)', margin: 'var(--space-3) 0' }}>Leave Requests</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: 'var(--color-cream-dark)' }}>
                <th style={th}>Start</th><th style={th}>End</th><th style={th}>Type</th><th style={th}>Status</th>
              </tr></thead>
              <tbody>
                {detail.leave.map(l => (
                  <tr key={l.id} style={{ borderTop: '1px solid var(--color-cream-dark)' }}>
                    <td style={td}>{l.startDate}</td><td style={td}>{l.endDate}</td><td style={td}>{l.type}</td><td style={td}>{l.status}</td>
                  </tr>
                ))}
                {detail.leave.length === 0 && <tr><td colSpan={4} style={td}>No leave requests</td></tr>}
              </tbody>
            </table>
            <button onClick={() => { setSelected(null); setDetail(null) }} style={{ ...cancelBtn, marginTop: 'var(--space-4)' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

const th: React.CSSProperties = { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)', fontWeight: 600 }
const td: React.CSSProperties = { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }
const btn: React.CSSProperties = { padding: 'var(--space-1) var(--space-3)', background: '#e8f5e9', color: 'var(--color-green-dark)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginRight: 8 }
const input: React.CSSProperties = { width: '100%', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-cream-dark)', borderRadius: 'var(--radius-sm)' }
const saveBtn: React.CSSProperties = { padding: 'var(--space-2) var(--space-6)', background: 'var(--color-green-dark)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }
const cancelBtn: React.CSSProperties = { padding: 'var(--space-2) var(--space-6)', background: '#eee', color: '#333', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }
const modalOverlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modal: React.CSSProperties = { background: '#fff', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', width: '90%', maxWidth: 640, maxHeight: '80vh', overflow: 'auto' }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 'var(--space-3)' }}>
      <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{label}</label>
      {children}
    </div>
  )
}
