import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import styles from './Footer.module.css'

const NAV_LINKS = [
  { key: 'nav.home',       path: '/' },
  { key: 'nav.about',      path: '/about' },
  { key: 'nav.programs',   path: '/programs' },
  { key: 'nav.impact',     path: '/impact' },
  { key: 'nav.getInvolved',path: '/get-involved' },
  { key: 'nav.newsEvents', path: '/news-events' },
  { key: 'nav.contact',    path: '/contact' },
]

export default function Footer() {
  const { t } = useTranslation('common')
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.col}>
          <h3 className={styles.brand}>Isôoko</h3>
          <p className={styles.tagline}>{t('footer.tagline')}</p>
          <div className={styles.social}>
            <a href="https://www.instagram.com/isooko_cd/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram size={20} /></a>
            <a href="https://linkedin.com/company/is%C3%B4oko-community-development" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter size={20} /></a>
          </div>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('footer.quickLinks')}</h4>
          <nav aria-label="Footer navigation">
            {NAV_LINKS.map(({ key, path }) => (
              <Link key={path} to={path} className={styles.navLink}>{t(key)}</Link>
            ))}
          </nav>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('footer.connect')}</h4>
          <address className={styles.address}>
            <p>{t('footer.address')}</p>
            <p><a href="mailto:info@isookocommunity.org">{t('footer.email')}</a></p>
            <p><a href="tel:+250788000000">{t('footer.phone')}</a></p>
          </address>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>{t('footer.copyright', { year })}</p>
        </div>
      </div>
    </footer>
  )
}
