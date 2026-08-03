import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { BlogPost } from '../../data/blogPosts'
import styles from './NewsCard.module.css'

interface NewsCardProps {
  post: BlogPost
}

function NewsCard({ post }: NewsCardProps) {
  const { t } = useTranslation('newsEvents')
  const { t: tc } = useTranslation('common')

  const formattedDate = new Date(post.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className={styles.card}>
      <Link to={`/news-events/${post.slug}`} className={styles.imageLink} tabIndex={-1} aria-hidden="true">
        <picture>
          <source srcSet={post.featuredImage} type="image/jpeg" />
          <img
            src={post.featuredImage}
            alt=""
            className={styles.image}
            loading="lazy"
          />
        </picture>
      </Link>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={`${styles.category} ${styles[post.category]}`}>
            {t(`filter.${post.category}`)}
          </span>
          <time dateTime={post.date} className={styles.date}>
            {formattedDate}
          </time>
        </div>
        <h3 className={styles.title}>
          <Link to={`/news-events/${post.slug}`} className={styles.titleLink}>
            {t(post.titleKey)}
          </Link>
        </h3>
        <p className={styles.excerpt}>{t(post.excerptKey)}</p>
        <div className={styles.footer}>
          <span className={styles.author}>{post.author}</span>
          <Link to={`/news-events/${post.slug}`} className={styles.readMore}>
            {tc('btn.readMore')} →
          </Link>
        </div>
      </div>
    </article>
  )
}

export default memo(NewsCard)
