import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { FaSignOutAlt, FaHome, FaTachometerAlt, FaNewspaper, FaCalendarAlt, FaUsers, FaLayerGroup, FaImages, FaChartBar, FaCommentDots, FaInbox, FaUserTie, FaClipboardCheck, FaTicketAlt, FaUmbrellaBeach, FaDumbbell, FaVideo, FaChalkboardTeacher } from 'react-icons/fa'

const SIDEBAR_LINKS = [
  { label: 'Dashboard', path: '/admin', end: true, icon: <FaTachometerAlt /> },
  { label: 'Gym Manager', path: '/admin/gym', icon: <FaChalkboardTeacher /> },
  { label: 'Gym Workouts', path: '/admin/gym-workouts', icon: <FaDumbbell /> },
  { label: 'Live Sessions', path: '/admin/gym-live-sessions', icon: <FaVideo /> },
  { label: 'Blog Posts', path: '/admin/blog-posts', icon: <FaNewspaper /> },
  { label: 'Events', path: '/admin/events', icon: <FaCalendarAlt /> },
  { label: 'Team Members', path: '/admin/team', icon: <FaUsers /> },
  { label: 'Programs', path: '/admin/programs', icon: <FaLayerGroup /> },
  { label: 'Gallery', path: '/admin/gallery', icon: <FaImages /> },
  { label: 'Impact Stats', path: '/admin/stats', icon: <FaChartBar /> },
  { label: 'Testimonials', path: '/admin/testimonials', icon: <FaCommentDots /> },
  { label: 'Submissions', path: '/admin/submissions', icon: <FaInbox /> },
  { label: 'Employees', path: '/admin/employees', icon: <FaUserTie /> },
  { label: 'Attendance', path: '/admin/attendance', icon: <FaClipboardCheck /> },
  { label: 'Daily Tokens', path: '/admin/tokens', icon: <FaTicketAlt /> },
  { label: 'Leave Requests', path: '/admin/leaves', icon: <FaUmbrellaBeach /> },
]

export default function AdminDashboard() {
  const { token, username, loading, logout } = useAuth()

  if (loading) return <div style={{ padding: 'var(--space-24)', textAlign: 'center' }}>Loading...</div>
  if (!token) return <Navigate to="/admin/login" replace />

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Isôoko Admin</h2>
          <p style={{ margin: 'var(--space-2) 0 0', fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>{username}</p>
        </div>
        <nav style={{ flex: 1 }}>
          {SIDEBAR_LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-3)',
                marginBottom: 'var(--space-1)',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)',
              })}
            >
              <span aria-hidden="true">{link.icon}</span>
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
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
