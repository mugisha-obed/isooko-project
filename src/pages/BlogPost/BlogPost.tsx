import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEOHead from '@/components/SEOHead/SEOHead'
import { blogPosts } from '@/data/blogPosts'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation('newsEvents')
  const { t: tc } = useTranslation('common')

  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="container" style={{ padding: 'var(--space-24) 0', textAlign: 'center' }}>
        <h1>{t('notFound')}</h1>
        <Link to="/news-events" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
          {tc('btn.back')}
        </Link>
      </div>
    )
  }

  const formattedDate = new Date(post.date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <>
      <SEOHead
        title={t(post.titleKey)}
        description={t(post.excerptKey)}
      />

      <article className="section">
        <div className="container" style={{ maxWidth: 760, margin: '0 auto' }}>
          <Link to="/news-events" className="btn btn-secondary" style={{ marginBottom: 'var(--space-6)' }}>
            ← {tc('btn.back')}
          </Link>

          <img
            src={post.featuredImage}
            alt=""
            style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}
          />

          <div style={{ display: 'flex', gap: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
            <time dateTime={post.date}>{formattedDate}</time>
            <span>{post.author}</span>
            <span>{t(`filter.${post.category}`)}</span>
          </div>

          <h1>{t(post.titleKey)}</h1>
          <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-muted)' }}>
            {t(post.excerptKey)}
          </p>

          <div style={{ marginTop: 'var(--space-8)' }}>
            {t(post.contentKey).split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </>
  )
}
