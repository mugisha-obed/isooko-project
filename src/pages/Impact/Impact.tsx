import { useTranslation } from 'react-i18next'
import SEOHead from '@/components/SEOHead/SEOHead'
import HeroBanner from '@/components/HeroBanner/HeroBanner'
import ImpactCounter from '@/components/ImpactCounter/ImpactCounter'
import PhotoGallery from '@/components/PhotoGallery/PhotoGallery'
import { impactStats } from '@/data/impactStats'
import { testimonials } from '@/data/testimonials'
import { galleryImages } from '@/data/galleryImages'

export default function Impact() {
  const { t } = useTranslation('impact')

  return (
    <>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
      />

      <HeroBanner
        titleKey="impact:hero.title"
        subtitleKey="impact:hero.subtitle"
        bgImage="/assets/hero-impact.svg"
      />

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('stats.title')}</h2>
            <p className="section-subtitle">{t('stats.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-6)', textAlign: 'center' }}>
            {impactStats.map((stat) => (
              <ImpactCounter key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-cream-dark)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('testimonials.title')}</h2>
            <p className="section-subtitle">{t('testimonials.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
            {testimonials.map((item) => (
              <blockquote key={item.id} style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{ fontStyle: 'italic' }}>"{t(item.quoteKey)}"</p>
                <footer style={{ marginTop: 'var(--space-4)', fontWeight: 600 }}>
                  — {item.attribution}, {t(item.roleKey)}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('gallery.title')}</h2>
            <p className="section-subtitle">{t('gallery.subtitle')}</p>
          </div>
          <PhotoGallery images={galleryImages} />
        </div>
      </section>
    </>
  )
}
