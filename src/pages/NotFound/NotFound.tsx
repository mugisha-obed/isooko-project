import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaCompass, FaHome } from 'react-icons/fa'
import SEOHead from '@/components/SEOHead/SEOHead'

export default function NotFound() {
  const { t } = useTranslation('common')

  return (
    <>
      <SEOHead title="404 — Page Not Found" />

      <div style={{ textAlign: 'center', padding: 'var(--space-24) var(--space-6)' }}>
        <FaCompass style={{ fontSize: '4rem', color: 'var(--color-green-dark)', marginBottom: 'var(--space-4)' }} aria-hidden="true" />
        <h1 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--color-green-dark)' }}>404</h1>
        <p style={{ fontSize: 'var(--font-size-xl)', margin: 'var(--space-4) 0 var(--space-8)' }}>
          {t('notFound')}
        </p>
        <Link to="/" className="btn btn-primary">
          <FaHome aria-hidden="true" /> {t('btn.home')}
        </Link>
      </div>
    </>
  )
}
