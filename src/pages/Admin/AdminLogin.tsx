import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLogin() {
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      navigate('/admin')
    }
  }, [navigate, token])

  if (token) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/admin')
    } catch {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-cream)', padding: 'var(--space-4)' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 'var(--space-8)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 400 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--space-6)', color: 'var(--color-green-dark)' }}>Admin Login</h1>
        {error && <div style={{ background: '#fee', color: '#c33', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)', textAlign: 'center' }}>{error}</div>}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
            style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-cream-dark)', borderRadius: 'var(--radius-sm)' }} />
        </div>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-cream-dark)', borderRadius: 'var(--radius-sm)' }} />
        </div>
        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: 'var(--space-3)', background: 'var(--color-green-dark)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
