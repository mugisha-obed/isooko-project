import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaArrowLeft, FaClock, FaPlay, FaUser, FaBolt, FaFire, FaHeart, FaMusic, FaDumbbell, FaYoutube } from 'react-icons/fa'
import SEOHead from '@/components/SEOHead/SEOHead'

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

function getEmbedUrl(url: string): string | null {
  if (!url) return null
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  return null
}

export default function WorkoutPlayer() {
  const { workoutId } = useParams<{ workoutId: string }>()
  const { t } = useTranslation('gym')
  const { t: tc } = useTranslation('common')
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [related, setRelated] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/gym-workouts`)
      .then(r => r.json())
      .then((all: Workout[]) => {
        const found = all.find(w => w.id === workoutId) || null
        setWorkout(found)
        if (found) {
          setRelated(all.filter(w => w.id !== found.id && w.category === found.category).slice(0, 3))
        }
      })
      .catch(() => setWorkout(null))
      .finally(() => setLoading(false))
  }, [workoutId])

  if (loading) {
    return <div className="container" style={{ padding: 'var(--space-24) 0', textAlign: 'center' }}>Loading...</div>
  }

  if (!workout) {
    return (
      <div className="container" style={{ padding: 'var(--space-24) 0', textAlign: 'center' }}>
        <h1>{t('live.noSessions')}</h1>
        <Link to="/gym" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
          {tc('btn.back')}
        </Link>
      </div>
    )
  }

  const embedUrl = getEmbedUrl(workout.videoUrl)

  return (
    <>
      <SEOHead title={workout.title} description={workout.description} />

      <section className="section" style={{ paddingTop: 'var(--space-24)' }}>
        <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link to="/gym" className="btn btn-secondary" style={{ marginBottom: 'var(--space-6)' }}>
            <FaArrowLeft aria-hidden="true" /> {t('player.backToGym')}
          </Link>

          <div className="aspect-video rounded-2xl overflow-hidden bg-[#17191F] shadow-lg mb-8" style={{ position: 'relative' }}>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={workout.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 'none', position: 'absolute', inset: 0 }}
              />
            ) : workout.videoUrl ? (
              <video src={workout.videoUrl} controls className="w-full h-full object-contain" style={{ position: 'absolute', inset: 0 }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center flex-col gap-4">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <FaPlay size={32} className="text-white ml-1" aria-hidden="true" />
                </div>
                <span className="text-white/70 font-medium">{t('player.watchWorkout')}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EADFD3] text-[#17191F]">
              {CATEGORY_ICONS[workout.category]} {t(`category.${workout.category}`)}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${DIFFICULTY_COLORS[workout.difficulty] || ''}`}>
              {t(`difficulty.${workout.difficulty}`)}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-[#5C4A3E]">
              <FaClock aria-hidden="true" /> {workout.duration} {t('player.minutes')}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-[#17191F] mb-3">{workout.title}</h1>
          <p className="text-base text-[#5C4A3E] leading-relaxed mb-6">{workout.description}</p>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white shadow-sm border border-[#EADFD3] mb-8">
            <div className="w-12 h-12 rounded-full bg-[#4B9F46] text-white flex items-center justify-center text-lg font-bold" aria-hidden="true">
              {workout.trainer?.charAt(0).toUpperCase() || 'T'}
            </div>
            <div>
              <p className="text-sm text-[#5C4A3E]">{t('player.aboutTrainer')}</p>
              <p className="font-semibold text-[#17191F]">
                <FaUser aria-hidden="true" className="inline mr-1 text-[#4B9F46]" />
                {workout.trainer}
              </p>
            </div>
          </div>

          {workout.videoUrl && !getEmbedUrl(workout.videoUrl) && (
            <a
              href={workout.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4B9F46] text-white font-semibold text-sm no-underline hover:bg-[#3a7d37] transition-colors mb-8"
            >
              <FaYoutube aria-hidden="true" /> {t('player.startWorkout')}
            </a>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--color-cream-dark)' }}>
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'center' }}>{t('player.relatedWorkouts')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
              {related.map(w => (
                <Link key={w.id} to={`/gym/${w.id}`} className="no-underline group">
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-video bg-[#4B9F46]" style={{ background: CATEGORY_COLORS_FALLBACK(w.category) }}>
                      {w.thumbnail && <img src={w.thumbnail} alt={w.title} className="w-full h-full object-cover" loading="lazy" />}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <FaPlay className="text-[#17191F] ml-1" size={18} />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#17191F] group-hover:text-[#4B9F46] transition-colors">{w.title}</h3>
                      <p className="text-xs text-[#5C4A3E] mt-1">{w.duration} {t('player.minutes')} · {w.trainer}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function CATEGORY_COLORS_FALLBACK(category: string): string {
  return {
    strength: '#B6582A',
    cardio: '#ef4444',
    yoga: '#4B9F46',
    flexibility: '#3A86FF',
    dance: '#6A4C93',
  }[category] || '#4B9F46'
}