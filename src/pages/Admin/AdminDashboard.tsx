import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { FaSignOutAlt, FaHome } from 'react-icons/fa'

const SIDEBAR_LINKS = [
  { label: 'Dashboard', path: '/admin', end: true },
  { label: 'Blog Posts', path: '/admin/blog-posts' },
  { label: 'Events', path: '/admin/events' },
  { label: 'Team Members', path: '/admin/team' },
  { label: 'Programs', path: '/admin/programs' },
  { label: 'Gallery', path: '/admin/gallery' },
  { label: 'Impact Stats', path: '/admin/stats' },
  { label: 'Testimonials', path: '/admin/testimonials' },
  { label: 'Submissions', path: '/admin/submissions' },
  { label: 'Employees', path: '/admin/employees' },
  { label: 'Attendance', path: '/admin/attendance' },
  { label: 'Leave Requests', path: '/admin/leaves' },
]

export default function AdminDashboard() {
  const { token, username, loading, logout } = useAuth()

  if (loading) return <div style={{ padding: 'var(--space-24)', textAlign: 'center' }}>Loading...</div>
  if (!token) return <Navigate to="/admin/login" replace />

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 240, background: 'var(--color-green-dark)', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Isôoko Admin</h2>
          <p style={{ margin: 'var(--space-2) 0 0', fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>{username}</p>
        </div>
        <nav style={{ flex: 1, padding: 'var(--space-3)' }}>
          {SIDEBAR_LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              style={({ isActive }) => ({
                display: 'block',
                padding: 'var(--space-2) var(--space-3)',
                marginBottom: 'var(--space-1)',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: 'var(--space-3)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <NavLink to="/" style={{ display: 'block', padding: 'var(--space-2) var(--space-3)', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-1)' }}>
            <FaHome style={{ marginRight: 8 }} />View Site
          </NavLink>
          <button onClick={logout} style={{ width: '100%', padding: 'var(--space-2) var(--space-3)', background: 'transparent', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--font-size-sm)', textAlign: 'left' }}>
            <FaSignOutAlt style={{ marginRight: 8 }} />Sign Out
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 'var(--space-6)', background: '#f8f6f3', overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
