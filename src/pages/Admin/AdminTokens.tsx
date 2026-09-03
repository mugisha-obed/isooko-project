import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api'

interface DailyToken {
  id: string
  date: string
  token: string
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export default function AdminTokens() {
  const [tokens, setTokens] = useState<DailyToken[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.tokens.list()
      setTokens(data)
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const todayToken = tokens.find(t => t.active && t.date === today())

  const generate = async () => {
    setBusy(true)
    setMessage(null)
    try {
      await api.tokens.create({ date: today() })
      setMessage({ type: 'ok', text: 'New daily token generated. Share it with your employees.' })
      await load()
    } catch (e: any) {
      setMessage({ type: 'err', text: e.message || 'Failed to generate token' })
    } finally {
      setBusy(false)
    }
  }

  const copy = async () => {
    if (!todayToken) return
    try {
      await navigator.clipboard.writeText(todayToken.token)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* ignore */ }
  }

  const remove = async (id: string) => {
    if (!confirm('Revoke this token? Employees will no longer be able to log in with it.')) return
    try {
      await api.tokens.delete(id)
      await load()
    } catch { /* ignore */ }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <h1 style={{ margin: 0, color: 'var(--color-green-dark)' }}>Daily Login Tokens</h1>
        <button onClick={generate} disabled={busy}
          style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-green-dark)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, opacity: busy ? 0.7 : 1 }}>
          {busy ? 'Generating...' : todayToken ? 'Regenerate Token' : 'Generate Token'}
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div style={{ fontSize: 'var(--font-size-sm)', color: '#666', marginBottom: 4 }}>Today's token ({today()})</div>
        {todayToken ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: 6, color: 'var(--color-green-dark)', fontFamily: 'monospace' }}>{todayToken.token}</span>
            <button onClick={copy} style={btn}>{copied ? 'Copied!' : 'Copy'}</button>
            <button onClick={generate} style={{ ...btn, background: '#fff3cd', color: '#856404' }} disabled={busy}>Regenerate</button>
          </div>
        ) : (
          <div style={{ color: '#999' }}>
            No active token for today. Click <strong>Generate Token</strong> to create one.
          </div>
        )}
        <p style={{ fontSize: 'var(--font-size-sm)', color: '#888', marginTop: 'var(--space-3)' }}>
          Employees sign in with their username and this token. Logging in marks their attendance with the GPS location where they checked in. The token works only for {today()}.
        </p>
      </div>

      {message && (
        <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)', background: message.type === 'ok' ? '#e8f5e9' : '#fee', color: message.type === 'ok' ? '#2d6a4f' : '#c33' }}>
          {message.text}
        </div>
      )}

      <h2 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-3)', color: 'var(--color-green-dark)' }}>Token history</h2>
      <div className="tab-card tab-scroll">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-cream-dark)' }}>
              <th style={th}>Date</th><th style={th}>Token</th><th style={th}>Status</th><th style={{ ...th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map(t => (
              <tr key={t.id} style={{ borderTop: '1px solid var(--color-cream-dark)' }}>
                <td style={td}>{t.date}</td>
                <td style={{ ...td, fontFamily: 'monospace', letterSpacing: 2 }}>{t.token}</td>
                <td style={td}>
                  <span style={{ padding: '2px 10px', borderRadius: 'var(--radius-sm)', fontSize: 12, background: t.active ? '#e8f5e9' : '#eee', color: t.active ? '#2d6a4f' : '#666' }}>
                    {t.active ? 'Active' : 'Revoked'}
                  </span>
                </td>
                <td style={{ ...td, textAlign: 'right' }}>
                  <button onClick={() => remove(t.id)} style={{ ...btn, background: '#fde8e8', color: '#c33' }}>Revoke</button>
                </td>
              </tr>
            ))}
            {tokens.length === 0 && <tr><td colSpan={4} style={{ padding: 'var(--space-8)', textAlign: 'center', color: '#999' }}>No tokens generated yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const th: React.CSSProperties = { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-sm)', fontWeight: 600 }
const td: React.CSSProperties = { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)' }
const btn: React.CSSProperties = { padding: 'var(--space-1) var(--space-3)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginRight: 8, background: '#e8f5e9', color: 'var(--color-green-dark)', fontWeight: 600 }