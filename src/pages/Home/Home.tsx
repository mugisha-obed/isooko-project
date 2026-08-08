import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEOHead from '@/components/SEOHead/SEOHead'
import HeroBanner from '@/components/HeroBanner/HeroBanner'
import ImpactCounter from '@/components/ImpactCounter/ImpactCounter'
import ProgramCard from '@/components/ProgramCard/ProgramCard'
import NewsCard from '@/components/NewsCard/NewsCard'
import { impactStats } from '@/data/impactStats'
import { programs } from '@/data/programs'
import { blogPosts } from '@/data/blogPosts'
import styles from './Home.module.css'

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

      <section className={styles.mission}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={styles.missionText}>
              <h2 className="section-title">{t('mission.title')}</h2>
              <p className={styles.missionBody}>{t('mission.body')}</p>
              <Link to="/about" className="btn btn-primary">
                {tc('btn.learnMore')}
              </Link>
            </div>
            <div className={styles.missionImage}>
              <img
                src="/assets/images/founding-story.webp"
                alt={t('mission.imageAlt')}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            {impactStats.map((stat) => (
              <ImpactCounter key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.programs}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('programs.title')}</h2>
            <p className="section-subtitle">{t('programs.subtitle')}</p>
          </div>
          <div className={styles.programsGrid}>
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.news}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('news.title')}</h2>
            <p className="section-subtitle">{t('news.subtitle')}</p>
          </div>
          <div className={styles.newsGrid}>
            {latestPosts.map((post) => (
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
          <div className={styles.newsFooter}>
            <Link to="/news-events" className="btn btn-secondary">
              {tc('btn.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>{t('cta.title')}</h2>
            <p className={styles.ctaText}>{t('cta.text')}</p>
            <div className={styles.ctaButtons}>
              <Link to="/get-involved" className="btn btn-white">
                {tc('btn.getInvolved')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
