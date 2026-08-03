import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaBars, FaTimes } from 'react-icons/fa'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { key: 'nav.home',       path: '/' },
  { key: 'nav.about',      path: '/about' },
  { key: 'nav.programs',   path: '/programs' },
  { key: 'nav.impact',     path: '/impact' },
  { key: 'nav.getInvolved',path: '/get-involved' },
  { key: 'nav.newsEvents', path: '/news-events' },
  { key: 'nav.contact',    path: '/contact' },
]

export default function Navbar() {
  const { t } = useTranslation('common')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useFocusTrap(menuRef, menuOpen)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} aria-label="Isôooko Community Development — Home">
          <span className={styles.logoText}>Isôoko</span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map(({ key, path }) => (
            <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`} aria-current={undefined}>
              {t(key)}
            </NavLink>
          ))}
        </nav>

        <div className={styles.right}>
          <LanguageSwitcher />
          <Link to="/admin/login" className={styles.link} style={{ fontSize: 'var(--font-size-sm)' }}>Admin</Link>
          <button className={styles.burger} onClick={() => setMenuOpen(o => !o)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" ref={menuRef} className={styles.mobileMenu} role="dialog" aria-modal="true" aria-label="Navigation menu">
          {NAV_LINKS.map(({ key, path }) => (
            <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ''}`} onClick={() => setMenuOpen(false)}>
              {t(key)}
            </NavLink>
          ))}
          <div className={styles.mobileLang}><LanguageSwitcher /></div>
        </div>
      )}
    </header>
  )
}
