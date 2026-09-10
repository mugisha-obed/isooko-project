import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaArrowRight } from 'react-icons/fa'
import SEOHead from '@/components/SEOHead/SEOHead'
import HeroBanner from '@/components/HeroBanner/HeroBanner'
import ImpactCounter from '@/components/ImpactCounter/ImpactCounter'
import ProgramCard from '@/components/ProgramCard/ProgramCard'
import NewsCard from '@/components/NewsCard/NewsCard'
import { impactStats } from '@/data/impactStats'
import { programs } from '@/data/programs'
import { blogPosts } from '@/data/blogPosts'

export default function Home() {
  const { t } = useTranslation('home')
  const { t: tc } = useTranslation('common')

  const latestPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
      />

      <HeroBanner
        titleKey="home:hero.title"
        subtitleKey="home:hero.subtitle"
        ctaKey="home:hero.cta"
        ctaLink="/get-involved"
        bgImage="/assets/images/isoooko-community.webp"
      />

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#17191F] mb-4">{t('mission.title')}</h2>
              <p className="text-lg text-[#5C4A3E] mb-6 leading-relaxed">{t('mission.body')}</p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-10 py-4 text-lg rounded-full bg-[#FFFFFF] text-[#2D6A4F] no-underline hover:bg-[#2D6A4F] hover:text-white hover:shadow-lg hover:shadow-[#4B9F46]/25 active:scale-[0.98] transition-all duration-200"
              >
                {tc('btn.learnMore')} <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
            <div>
              <img
                src="/assets/images/founding-story.webp"
                alt={t('mission.imageAlt')}
                loading="lazy"
                className="rounded-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#4B9F46] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
            {impactStats.map((stat) => (
              <ImpactCounter key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#17191F] mb-4">{t('programs.title')}</h2>
            <p className="text-lg text-[#5C4A3E]">{t('programs.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-[#EADFD3] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#17191F] mb-4">{t('news.title')}</h2>
            <p className="text-lg text-[#5C4A3E]">{t('news.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/news-events"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#4B9F46] text-[#4B9F46] font-semibold no-underline hover:bg-[#4B9F46] hover:text-white hover:shadow-lg hover:shadow-[#4B9F46]/25 active:scale-[0.98] transition-all duration-200"
            >
              {tc('btn.viewAll')} <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#B6582A] py-16 md:py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
            <p className="text-lg text-white/90 mb-6">{t('cta.text')}</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/get-involved"
                className="btn btn-white min-w-[220px] justify-center px-8 py-3.5 text-lg hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
              >
                {tc('btn.getInvolved')} <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
