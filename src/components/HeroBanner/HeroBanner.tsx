import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './HeroBanner.module.css'

interface HeroBannerProps {
  titleKey: string
  subtitleKey: string
  ctaKey?: string
  ctaLink?: string
  bgImage?: string
}

export default function HeroBanner({ titleKey, subtitleKey, ctaKey, ctaLink, bgImage }: HeroBannerProps) {
  const { t } = useTranslation()

  return (
    <section
      className={styles.hero}
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      <div className={styles.overlay} />
      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>{t(titleKey)}</h1>
        <p className={styles.subtitle}>{t(subtitleKey)}</p>
        {ctaKey && ctaLink && (
          <Link to={ctaLink} className={`btn btn-white ${styles.cta}`}>
            {t(ctaKey)}
          </Link>
        )}
      </div>
    </section>
  )
}
