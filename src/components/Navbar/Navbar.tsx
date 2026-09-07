import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaBars, FaTimes, FaLeaf } from 'react-icons/fa'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import { useFocusTrap } from '@/hooks/useFocusTrap'

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 flex items-center justify-between h-[72px]">
        <Link to="/" className="text-no-underline flex items-center gap-2" aria-label="Isôoko Community Development — Home">
          <FaLeaf aria-hidden="true" className="text-[#4B9F46]" />
          <span className={`text-xl font-bold ${scrolled ? 'text-[#17191F]' : 'text-white'}`}>Isôoko</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
          {NAV_LINKS.map(({ key, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `text-sm font-medium no-underline pb-0.5 border-b-2 transition-colors ${
                  isActive
                    ? 'border-[#4B9F46] text-[#4B9F46]'
                    : 'border-transparent hover:border-[#4B9F46] ' + (scrolled ? 'text-[#17191F]' : 'text-white')
                }`
              }
            >
              {t(key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link to="/admin/login" className={`hidden lg:inline text-xs font-medium no-underline ${scrolled ? 'text-[#5C4A3E]' : 'text-white/80'}`}>Admin</Link>
          <Link to="/employee/login" className={`hidden lg:inline text-xs font-medium no-underline ${scrolled ? 'text-[#5C4A3E]' : 'text-white/80'}`}>Staff</Link>
          <button
            className="lg:hidden bg-transparent border-none p-2 text-current"
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <FaTimes size={22} className={scrolled ? 'text-[#17191F]' : 'text-white'} /> : <FaBars size={22} className={scrolled ? 'text-[#17191F]' : 'text-white'} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" ref={menuRef} className="lg:hidden bg-[#17191F] px-6 py-6 flex flex-col gap-4" role="dialog" aria-modal="true" aria-label="Navigation menu">
          {NAV_LINKS.map(({ key, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `text-white text-lg font-medium no-underline py-2 border-b border-white/15 ${
                  isActive ? 'text-[#4B9F46]' : 'hover:text-[#4B9F46]'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {t(key)}
            </NavLink>
          ))}
          <div className="pt-4"><LanguageSwitcher /></div>
        </div>
      )}
    </header>
  )
}
