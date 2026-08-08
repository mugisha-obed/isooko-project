import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEOHead from '@/components/SEOHead/SEOHead'
import HeroBanner from '@/components/HeroBanner/HeroBanner'
import NewsCard from '@/components/NewsCard/NewsCard'
import { blogPosts } from '@/data/blogPosts'

const CATEGORIES = ['all', 'news', 'event'] as const

export default function NewsEvents() {
  const { t } = useTranslation('newsEvents')
  const [filter, setFilter] = useState<'all' | 'news' | 'event'>('all')

  const filtered = filter === 'all'
    ? blogPosts
    : blogPosts.filter((p) => p.category === filter)

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
      />

      <HeroBanner
        titleKey="newsEvents:hero.title"
        subtitleKey="newsEvents:hero.subtitle"
        bgImage="/assets/gallery/gallery-4.jpg"
      />

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('page.title')}</h2>
            <p className="section-subtitle">{t('page.subtitle')}</p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', marginBottom: 'var(--space-8)' }}>
            {CATEGORIES.map((cat) => (
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
                {t(`filter.${cat}`)}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
            {sorted.map((post) => (
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
