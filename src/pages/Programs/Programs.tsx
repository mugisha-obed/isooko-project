import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEOHead from '@/components/SEOHead/SEOHead'
import HeroBanner from '@/components/HeroBanner/HeroBanner'
import ProgramCard from '@/components/ProgramCard/ProgramCard'
import { programs } from '@/data/programs'

const LOGOS: Record<string, string> = {
  'women-empowerment': 'MWU',
  'youth-empowerment': 'IZI',
  'sports-wellness': '',
  'digital-literacy': '',
  'tuuza-mubyeyi': '',
}

export default function Programs() {
  const { t } = useTranslation('programs')
  const { t: tc } = useTranslation('common')

  return (
    <>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
      />

      <HeroBanner
        titleKey="programs:hero.title"
        subtitleKey="programs:hero.subtitle"
        bgImage="/assets/gallery/gallery-3.webp"
      />

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('overview.title')}</h2>
            <p className="section-subtitle">{t('overview.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </section>

      {programs.map((program) => (
        <section
          key={program.id}
          id={program.id}
          className="section"
          style={{ background: program.id === 'tuuza-mubyeyi' ? 'var(--color-cream-dark)' : undefined }}
        >
          <div className="container">
            <div className="section-header">
              <h2 className="section-title" style={{ fontSize: 'var(--font-size-xl)' }}>
                {t(`${program.id}.acronym`)}
                {LOGOS[program.id] && (
                  <span style={{
                    display: 'inline-block',
                    marginLeft: 'var(--space-3)',
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-green-dark)',
                    color: 'var(--color-white)',
                    fontSize: 'var(--font-size-sm)',
                    verticalAlign: 'middle',
                  }}>{LOGOS[program.id]}</span>
                )}
              </h2>
              <p className="section-subtitle">{t(`${program.id}.subtitle`)}</p>
            </div>

            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <p>{t(`${program.id}.intro`)}</p>
              <ul style={{ marginTop: 'var(--space-4)', paddingLeft: 'var(--space-6)' }}>
                {(t(`${program.id}.offerings`, { returnObjects: true }) as string[]).map(
                  (item: string, i: number) => (
                    <li key={i} style={{ marginBottom: 'var(--space-2)' }}>{item}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title">{tc('getInvolved.title')}</h2>
          <p>{tc('getInvolved.desc')}</p>
          <Link to="/get-involved" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
            {tc('btn.getInvolved')}
          </Link>
        </div>
      </section>
    </>
  )
}
