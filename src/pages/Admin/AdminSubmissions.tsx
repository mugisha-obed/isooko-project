import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api'

type Tab = 'contacts' | 'volunteers'

export default function AdminSubmissions() {
  const [tab, setTab] = useState<Tab>('contacts')
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<Record<string, unknown>>(`/api/${tab}`)
      setItems(data)
    } catch { /* ignore */ }
    setLoading(false)
  }, [tab])

  useEffect(() => { load() }, [load])

  return (
    <div>
      <h1 style={{ color: 'var(--color-green-dark)', marginBottom: 'var(--space-6)' }}>Submissions</h1>
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        {(['contacts', 'volunteers'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: 'var(--space-2) var(--space-4)', background: tab === t ? 'var(--color-green-dark)' : '#fff', color: tab === t ? '#fff' : 'var(--color-green-dark)', border: '1px solid var(--color-green-dark)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize' }}>
            {t}
          </button>
        ))}
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="tab-card tab-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-cream-dark)' }}>
                {tab === 'contacts' ? (
                  <>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>Name</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>Email</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>Subject</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>Message</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>Date</th>
                  </>
                ) : (
                  <>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>Name</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>Email</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>Phone</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>Area</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>Message</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>Date</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id as string} style={{ borderTop: '1px solid var(--color-cream-dark)' }}>
                  {tab === 'contacts' ? (
                    <>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }}>{item.name as string}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }}>{item.email as string}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }}>{item.subject as string}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.message as string}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }}>{new Date(item.createdAt as string).toLocaleDateString()}</td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }}>{item.name as string}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }}>{item.email as string}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }}>{item.phone as string}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }}>{item.areaOfInterest as string}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.message as string}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }}>{new Date(item.createdAt as string).toLocaleDateString()}</td>
                    </>
                  )}
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#999' }}>No submissions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
