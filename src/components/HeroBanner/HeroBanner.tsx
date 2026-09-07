import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
      className="relative min-h-[60vh] md:min-h-[70vh] flex items-center bg-[#17191F] bg-cover bg-center pt-[72px]"
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-16 md:py-24 max-w-[800px]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {t(titleKey)}
        </h1>
        <p className="text-lg md:text-xl text-white/85 mb-8 max-w-[600px]">
          {t(subtitleKey)}
        </p>
        {ctaKey && ctaLink && (
          <Link
            to={ctaLink}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#17191F] font-semibold text-lg no-underline hover:bg-[#FDF6EF] transition-colors"
          >
            {t(ctaKey)}
          </Link>
        )}
      </div>
    </section>
  )
}
