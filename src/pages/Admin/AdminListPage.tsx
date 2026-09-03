import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api'

interface Column {
  key: string
  label: string
  render?: (value: unknown, row: Record<string, unknown>) => string
}

interface Props {
  title: string
  apiPath: string
  columns: Column[]
  defaultItem: Record<string, unknown>
  onSave?: (item: Record<string, unknown>) => Record<string, unknown>
}

export default function AdminListPage({ title, apiPath, columns, defaultItem, onSave }: Props) {
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<Record<string, unknown>>(apiPath)
      setItems(data)
    } catch { /* ignore */ }
    setLoading(false)
  }, [apiPath])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!editing) return
    const data = onSave ? onSave(editing) : editing
    try {
      if (isNew) {
        await api.create(apiPath, data)
      } else {
        await api.update(apiPath, editing.id as string, data)
      }
      setEditing(null)
      setIsNew(false)
      load()
    } catch { /* ignore */ }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return
    try {
      await api.delete(apiPath, id)
      load()
    } catch { /* ignore */ }
  }

  const startEdit = (item: Record<string, unknown>) => {
    setEditing({ ...item })
    setIsNew(false)
  }

  const startNew = () => {
    setEditing({ ...defaultItem })
    setIsNew(true)
  }

  const setField = (key: string, value: unknown) => {
    setEditing(prev => prev ? { ...prev, [key]: value } : null)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <h1 style={{ margin: 0, color: 'var(--color-green-dark)' }}>{title}</h1>
        <button onClick={startNew} style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-green-dark)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}>
          + Add New
        </button>
      </div>

      <div className="tab-card tab-scroll">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-cream-dark)' }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{col.label}</th>
              ))}
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id as string} style={{ borderTop: '1px solid var(--color-cream-dark)' }}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
                    {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? '')}
                  </td>
                ))}
                <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right' }}>
                  <button onClick={() => startEdit(item)} style={{ padding: 'var(--space-1) var(--space-3)', background: '#e8f5e9', color: 'var(--color-green-dark)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginRight: 8 }}>Edit</button>
                  <button onClick={() => handleDelete(item.id as string)} style={{ padding: 'var(--space-1) var(--space-3)', background: '#fde8e8', color: '#c33', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={columns.length + 1} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#999' }}>No items yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', width: '90%', maxWidth: 600, maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>{isNew ? 'Add' : 'Edit'} {title.slice(0, -1)}</h2>
            {Object.entries(editing).filter(([k]) => k !== 'id' && k !== 'createdAt' && k !== 'updatedAt').map(([key, value]) => (
              <div key={key} style={{ marginBottom: 'var(--space-3)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600, fontSize: 'var(--font-size-sm)', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</label>
                {typeof value === 'boolean' ? (
                  <input type="checkbox" checked={value as boolean} onChange={e => setField(key, e.target.checked)}
                    style={{ width: 20, height: 20 }} />
                ) : (
                  <input type={typeof value === 'number' ? 'number' : 'text'} value={String(value ?? '')} onChange={e => setField(key, typeof value === 'number' ? Number(e.target.value) : e.target.value)}
                    style={{ width: '100%', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-cream-dark)', borderRadius: 'var(--radius-sm)' }} />
                )}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <button onClick={handleSave} style={{ padding: 'var(--space-2) var(--space-6)', background: 'var(--color-green-dark)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}>Save</button>
              <button onClick={() => setEditing(null)} style={{ padding: 'var(--space-2) var(--space-6)', background: '#eee', color: '#333', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
