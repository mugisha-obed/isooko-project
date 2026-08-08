import { useTranslation } from 'react-i18next'
import SEOHead from '@/components/SEOHead/SEOHead'
import HeroBanner from '@/components/HeroBanner/HeroBanner'
import VolunteerForm from '@/components/VolunteerForm/VolunteerForm'

export default function GetInvolved() {
  const { t } = useTranslation('getInvolved')

  return (
    <>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
      />

      <HeroBanner
        titleKey="getInvolved:hero.title"
        subtitleKey="getInvolved:hero.subtitle"
        ctaKey="getInvolved:hero.cta"
        ctaLink="#volunteer-form"
        bgImage="/assets/gallery/gallery-1.jpg"
      />

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('ways.title')}</h2>
            <p className="section-subtitle">{t('ways.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <h3>{t('ways.donate.title')}</h3>
              <p>{t('ways.donate.desc')}</p>
            </div>
            <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <h3>{t('ways.volunteer.title')}</h3>
              <p>{t('ways.volunteer.desc')}</p>
            </div>
            <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <h3>{t('ways.partner.title')}</h3>
              <p>{t('ways.partner.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="volunteer-form" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('volunteer.title')}</h2>
            <p className="section-subtitle">{t('volunteer.subtitle')}</p>
          </div>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <VolunteerForm />
          </div>
        </div>
      </section>
    </>
  )
}
