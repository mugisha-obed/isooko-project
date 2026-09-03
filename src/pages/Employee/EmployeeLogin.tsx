import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useEmployeeAuth } from '../../hooks/useEmployeeAuth'
import { useGeolocation } from '../../hooks/useGeolocation'

type Mode = 'token' | 'password'

export default function EmployeeLogin() {
  const { login, loginWithToken, token } = useEmployeeAuth()
  const { getPosition } = useGeolocation()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('token')
  const [username, setUsername] = useState('')
  const [tokenCode, setTokenCode] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      navigate('/employee')
    }
  }, [navigate, token])

  if (token) {
    return null
  }

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const pos = await getPosition()
      await loginWithToken({
        username,
        token: tokenCode,
        date: today(),
        latitude: pos?.latitude,
        longitude: pos?.longitude,
      })
      navigate('/employee')
    } catch (err: any) {
      setError(err?.message || 'Invalid daily token')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/employee')
    } catch {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  const tabBtn = (m: Mode, label: string) => (
    <button type="button" onClick={() => { setMode(m); setError('') }}
      style={{
        flex: 1, padding: 'var(--space-2)', border: 'none', borderRadius: 'var(--radius-sm)',
        cursor: 'pointer', fontWeight: 600, fontSize: 'var(--font-size-sm)',
        background: mode === m ? 'var(--color-green-dark)' : '#eee',
        color: mode === m ? '#fff' : '#555',
      }}>
      {label}
    </button>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-cream)', padding: 'var(--space-4)' }}>
      <form onSubmit={mode === 'token' ? handleTokenSubmit : handlePasswordSubmit} style={{ background: '#fff', padding: 'var(--space-8)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 400 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--space-2)', color: 'var(--color-green-dark)' }}>Employee Portal</h1>
        <p style={{ textAlign: 'center', marginBottom: 'var(--space-6)', color: '#777' }}>Sign in and mark your attendance</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-5)' }}>
          {tabBtn('token', 'Daily Token')}
          {tabBtn('password', 'Password')}
        </div>

        {error && <div style={{ background: '#fee', color: '#c33', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)', textAlign: 'center' }}>{error}</div>}

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username"
            style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-cream-dark)', borderRadius: 'var(--radius-sm)' }} />
        </div>

        {mode === 'token' ? (
          <>
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Daily Login Token</label>
              <input type="text" value={tokenCode} onChange={e => setTokenCode(e.target.value.toUpperCase())} required placeholder="e.g. A7K2MP9Q"
                style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-cream-dark)', borderRadius: 'var(--radius-sm)', textTransform: 'uppercase', letterSpacing: 2 }} />
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: '#888', marginBottom: 'var(--space-6)' }}>
              Enter the token given to you by your admin for today. Your GPS position is captured so your check-in location is recorded.
            </p>
          </>
        ) : (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
              style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-cream-dark)', borderRadius: 'var(--radius-sm)' }} />
          </div>
        )}

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: 'var(--space-3)', background: 'var(--color-green-dark)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Signing in...' : mode === 'token' ? 'Sign In & Check In' : 'Sign In'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
          <Link to="/admin/login" style={{ color: 'var(--color-green-dark)', fontSize: 'var(--font-size-sm)' }}>Admin login</Link>
        </div>
      </form>
    </div>
  )
}

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}