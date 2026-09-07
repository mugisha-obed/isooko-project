import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaInstagram, FaLinkedin, FaTwitter, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa'

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
    <footer className="bg-[#17191F] text-white/85 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
        <div>
          <h3 className="text-xl font-bold text-white mb-3">Isôoko</h3>
          <p className="text-sm leading-relaxed mb-6 text-white/70">{t('footer.tagline')}</p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/isooko_cd/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/70 no-underline hover:text-[#4B9F46] transition-colors"><FaInstagram size={20} /></a>
            <a href="https://linkedin.com/company/is%C3%B4oko-community-development" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white/70 no-underline hover:text-[#4B9F46] transition-colors"><FaLinkedin size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-white/70 no-underline hover:text-[#4B9F46] transition-colors"><FaTwitter size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-base font-semibold text-white mb-4 uppercase tracking-wide">{t('footer.quickLinks')}</h4>
          <nav aria-label="Footer navigation">
            {NAV_LINKS.map(({ key, path }) => (
              <Link key={path} to={path} className="block text-white/70 no-underline text-sm py-1 hover:text-[#4B9F46] transition-colors">{t(key)}</Link>
            ))}
          </nav>
        </div>

        <div>
          <h4 className="text-base font-semibold text-white mb-4 uppercase tracking-wide">{t('footer.connect')}</h4>
          <address className="not-italic">
            <p className="text-sm text-white/70 mb-2 flex items-start gap-2"><FaMapMarkerAlt className="text-[#4B9F46] mt-1 flex-shrink-0" aria-hidden="true" />{t('footer.address')}</p>
            <p className="text-sm text-white/70 mb-2 flex items-center gap-2"><FaEnvelope className="text-[#4B9F46] flex-shrink-0" aria-hidden="true" /><a href="mailto:info@isookocommunity.org" className="text-white/70 no-underline hover:text-[#4B9F46]">{t('footer.email')}</a></p>
            <p className="text-sm text-white/70 flex items-center gap-2"><FaPhoneAlt className="text-[#4B9F46] flex-shrink-0" aria-hidden="true" /><a href="tel:+250788000000" className="text-white/70 no-underline hover:text-[#4B9F46]">{t('footer.phone')}</a></p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/15 py-6 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <p className="text-sm text-white/50 m-0">{t('footer.copyright', { year })}</p>
        </div>
      </div>
    </footer>
  )
}
