import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaPlay, FaClock, FaBolt, FaFire, FaHeart, FaMusic, FaDumbbell, FaExternalLinkAlt } from 'react-icons/fa'
import SEOHead from '@/components/SEOHead/SEOHead'
import HeroBanner from '@/components/HeroBanner/HeroBanner'

interface Workout {
  id: string
  title: string
  description: string
  trainer: string
  category: string
  difficulty: string
  duration: number
  thumbnail: string
  videoUrl: string
}

interface LiveSession {
  id: string
  title: string
  description: string
  trainer: string
  scheduledAt: string
  duration: number
  joinUrl: string
  status: string
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  strength: <FaDumbbell />,
  cardio: <FaFire />,
  yoga: <FaHeart />,
  flexibility: <FaBolt />,
  dance: <FaMusic />,
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

const CATEGORY_COLORS: Record<string, string> = {
  strength: 'bg-[#B6582A]',
  cardio: 'bg-red-500',
  yoga: 'bg-[#4B9F46]',
  flexibility: 'bg-[#3A86FF]',
  dance: 'bg-[#6A4C93]',
}

export default function Gym() {
  const { t } = useTranslation('gym')
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([])
  const [filter, setFilter] = useState<'all' | string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/gym-workouts').then(r => r.json()),
      fetch('/api/gym-live-sessions').then(r => r.json()),
    ]).then(([w, l]) => {
      setWorkouts(Array.isArray(w) ? w : [])
      setLiveSessions(Array.isArray(l) ? l : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? workouts : workouts.filter(w => w.category === filter)

  const now = new Date()
  const activeSessions = liveSessions
    .filter(s => {
      const start = new Date(s.scheduledAt).getTime()
      const end = start + (s.duration || 60) * 60 * 1000
      return now.getTime() >= start && now.getTime() <= end && s.status !== 'cancelled'
    })
  const upcomingSessions = liveSessions
    .filter(s => new Date(s.scheduledAt) > now && s.status !== 'cancelled')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())

  const scheduledSessions = [...activeSessions, ...upcomingSessions]

  return (
    <>
      <SEOHead title={t('seo.title')} description={t('seo.description')} />

      <HeroBanner
        titleKey="gym:hero.title"
        subtitleKey="gym:hero.subtitle"
        ctaKey="gym:hero.cta"
        ctaLink="#workouts"
        bgImage="/assets/gallery/gallery-3.webp"
      />

      {/* Live Sessions */}
      {scheduledSessions.length > 0 && (
        <section className="section" style={{ background: 'linear-gradient(135deg, #17191F 0%, #2D6A4F 100%)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title" style={{ color: '#fff' }}>{t('live.title')}</h2>
              <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.8)' }}>{t('live.subtitle')}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
              {scheduledSessions.map(session => {
                const sessionDate = new Date(session.scheduledAt)
                const timeDiff = sessionDate.getTime() - now.getTime()
                const isLive = now.getTime() >= sessionDate.getTime()
                const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60))
                const minsLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
                return (
                  <div key={session.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/20">
                    <div className="flex items-center gap-2 mb-3">
                      {isLive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-wider animate-pulse">
                          {t('live.live')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#4B9F46] text-white text-xs font-bold uppercase tracking-wider">
                          {t('live.upcoming')}
                        </span>
                      )}
                      <span className="text-sm text-white/70">
                        {isLive
                          ? t('live.onNow')
                          : `${t('live.startsIn')} ${hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m` : `${minsLeft}m`}`}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{session.title}</h3>
                    <p className="text-sm text-white/70 mb-1">{session.trainer}</p>
                    <p className="text-sm text-white/60 mb-4">
                      {sessionDate.toLocaleDateString()} · {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {session.duration} min
                    </p>
                    <a
                      href={session.joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4B9F46] text-white font-semibold text-sm no-underline hover:bg-[#3a7d37] transition-colors"
                    >
                      <FaPlay aria-hidden="true" /> {t('live.joinLive')} <FaExternalLinkAlt aria-hidden="true" />
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Workout Library */}
      <section id="workouts" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('page.title')}</h2>
            <p className="section-subtitle">{t('page.subtitle')}</p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
            {(['all', 'strength', 'cardio', 'yoga', 'flexibility', 'dance'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="btn"
                style={{
                  background: filter === cat ? 'var(--color-green-dark)' : 'transparent',
                  color: filter === cat ? 'var(--color-white)' : 'var(--color-green-dark)',
                  borderColor: 'var(--color-green-dark)',
                }}
              >
                {cat !== 'all' && <span style={{ marginRight: 6 }}>{CATEGORY_ICONS[cat]}</span>}
                {t(`filter.${cat}`)}
              </button>
            ))}
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--color-brown-dark)' }}>{t('live.noSessions')}</p>
          ) : filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-brown-dark)' }}>{t('live.noSessions')}</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
              {filtered.map(workout => (
                <Link
                  key={workout.id}
                  to={`/gym/${workout.id}`}
                  className="no-underline group"
                >
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative aspect-video overflow-hidden" style={{ background: CATEGORY_COLORS[workout.category] || '#4B9F46' }}>
                      {workout.thumbnail ? (
                        <img src={workout.thumbnail} alt={workout.title} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaPlay size={48} className="text-white/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                          <FaPlay className="text-[#17191F] ml-1" size={20} />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${DIFFICULTY_COLORS[workout.difficulty] || ''}`}>
                          {t(`difficulty.${workout.difficulty}`)}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white ${CATEGORY_COLORS[workout.category] || ''}`}>
                          {CATEGORY_ICONS[workout.category]}
                          {t(`category.${workout.category}`)}
                        </span>
                        <span className="text-xs text-[#5C4A3E] flex items-center gap-1">
                          <FaClock aria-hidden="true" /> {workout.duration} {t('player.minutes')}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#17191F] leading-tight group-hover:text-[#4B9F46] transition-colors">{workout.title}</h3>
                      <p className="text-sm text-[#5C4A3E] leading-relaxed flex-1 line-clamp-2">{workout.description}</p>
                      <p className="text-xs font-medium text-[#4B9F46] mt-1">{workout.trainer}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: 'var(--color-cream-dark)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('howItWorks.title')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-8)', maxWidth: 800, margin: '0 auto' }}>
            {(['step1', 'step2', 'step3'] as const).map((step, i) => (
              <div key={step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#4B9F46] text-white text-2xl font-bold mb-4">{i + 1}</div>
                <h3 className="text-lg font-bold text-[#17191F] mb-2">{t(`howItWorks.${step}.title`)}</h3>
                <p className="text-sm text-[#5C4A3E] leading-relaxed">{t(`howItWorks.${step}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}