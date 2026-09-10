import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEOHead from '@/components/SEOHead/SEOHead'
import HeroBanner from '@/components/HeroBanner/HeroBanner'
import BookCard from '@/components/BookCard/BookCard'
import { books, type BookCategory } from '@/data/books'

const CATEGORIES: Array<'all' | BookCategory> = ['all', 'novel', 'education', 'children', 'other']

export default function Library() {
  const { t } = useTranslation('library')
  const [filter, setFilter] = useState<'all' | BookCategory>('all')

  const filtered = filter === 'all' ? books : books.filter((b) => b.category === filter)

  return (
    <>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
      />

      <HeroBanner
        titleKey="library:hero.title"
        subtitleKey="library:hero.subtitle"
        bgImage="/assets/gallery/gallery-1.webp"
      />

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('page.title')}</h2>
            <p className="section-subtitle">{t('page.subtitle')}</p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-cream-dark)', textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title" style={{ fontSize: 'var(--font-size-xl)' }}>{t('visit.title')}</h2>
          <p>{t('visit.text')}</p>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-brown-dark)' }}>
            {t('visit.location')}
          </p>
        </div>
      </section>
    </>
  )
}