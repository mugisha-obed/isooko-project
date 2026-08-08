import { useTranslation } from 'react-i18next'
import SEOHead from '@/components/SEOHead/SEOHead'
import HeroBanner from '@/components/HeroBanner/HeroBanner'
import ContactForm from '@/components/ContactForm/ContactForm'

export default function Contact() {
  const { t } = useTranslation('contact')

  return (
    <>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
      />

      <HeroBanner
        titleKey="contact:hero.title"
        subtitleKey="contact:hero.subtitle"
        bgImage="/assets/gallery/gallery-2.jpg"
      />

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'start' }}>
            <div>
              <h2 className="section-title">{t('info.title')}</h2>
              <p>{t('info.desc')}</p>
              <address style={{ fontStyle: 'normal', marginTop: 'var(--space-6)' }}>
                <p><strong>{t('info.addressLabel')}</strong><br />{t('info.address')}</p>
                <p style={{ marginTop: 'var(--space-4)' }}><strong>{t('info.emailLabel')}</strong><br /><a href="mailto:info@isookocommunity.org">info@isookocommunity.org</a></p>
                <p style={{ marginTop: 'var(--space-4)' }}><strong>{t('info.phoneLabel')}</strong><br /><a href="tel:+250788000000">+250 788 000 000</a></p>
              </address>
            </div>
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
