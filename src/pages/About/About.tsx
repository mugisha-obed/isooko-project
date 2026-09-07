import { useTranslation } from 'react-i18next'
import { FaBullseye, FaEye, FaLeaf } from 'react-icons/fa'
import SEOHead from '@/components/SEOHead/SEOHead'
import HeroBanner from '@/components/HeroBanner/HeroBanner'
import TeamMemberCard from '@/components/TeamMemberCard/TeamMemberCard'
import { teamMembers } from '@/data/teamMembers'
import styles from './About.module.css'

export default function About() {
  const { t } = useTranslation('about')

  return (
    <>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
      />

      <HeroBanner
        titleKey="about:hero.title"
        subtitleKey="about:hero.subtitle"
        bgImage="/assets/images/about-bg.webp"
      />

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('story.title')}</h2>
            <p className="section-subtitle">{t('story.subtitle')}</p>
          </div>
          <p>{t('story.body1')}</p>
          <p>{t('story.body2')}</p>
          <p>{t('story.body3')}</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-cream-dark)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('missionVision.title')}</h2>
          </div>
          <div className={styles.missionVisionGrid}>
            <div className={styles.missionVisionCard}>
              <FaBullseye style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-green-dark)', marginBottom: 'var(--space-3)' }} aria-hidden="true" />
              <h3>{t('missionVision.mission.title')}</h3>
              <p style={{ fontStyle: 'italic' }}>{t('missionVision.mission.text')}</p>
            </div>
            <div className={styles.missionVisionCard}>
              <FaEye style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-green-dark)', marginBottom: 'var(--space-3)' }} aria-hidden="true" />
              <h3>{t('missionVision.vision.title')}</h3>
              <p style={{ fontStyle: 'italic' }}>{t('missionVision.vision.text')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('sdgs.title')}</h2>
            <p className="section-subtitle">{t('sdgs.subtitle')}</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5, 8].map((n) => (
              <div key={n} className={styles.sdgPill}>
                <FaLeaf style={{ marginRight: 'var(--space-2)', verticalAlign: 'middle', color: 'var(--color-green-mid)' }} aria-hidden="true" />
                SDG {n} — {t(`sdgs.sdg${n}`)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-cream-dark)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('team.title')}</h2>
            <p className="section-subtitle">{t('team.subtitle')}</p>
          </div>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
