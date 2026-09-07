import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaArrowRight, FaNewspaper, FaCalendarDay } from 'react-icons/fa'
import type { BlogPost } from '../../data/blogPosts'

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

  const categoryClasses =
    post.category === 'news'
      ? 'bg-green-100 text-green-700'
      : 'bg-orange-100 text-orange-700'

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/news-events/${post.slug}`} className="block overflow-hidden aspect-[16/9]" tabIndex={-1} aria-hidden="true">
        <picture>
          <source srcSet={post.featuredImage} type="image/jpeg" />
          <img
            src={post.featuredImage}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </picture>
      </Link>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full inline-flex items-center gap-1 ${categoryClasses}`}>
            {post.category === 'news' ? <FaNewspaper aria-hidden="true" /> : <FaCalendarDay aria-hidden="true" />}
            {t(`filter.${post.category}`)}
          </span>
          <time dateTime={post.date} className="text-sm text-[#5C4A3E]">
            {formattedDate}
          </time>
        </div>
        <h3 className="text-xl text-[#17191F] font-bold leading-tight">
          <Link to={`/news-events/${post.slug}`} className="no-underline text-[#17191F] hover:text-[#4B9F46] transition-colors">
            {t(post.titleKey)}
          </Link>
        </h3>
        <p className="text-sm text-[#5C4A3E] leading-relaxed flex-1">{t(post.excerptKey)}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-medium text-[#5C4A3E]">{post.author}</span>
          <Link to={`/news-events/${post.slug}`} className="text-sm font-semibold text-[#4B9F46] no-underline hover:text-[#3a7d37] transition-colors inline-flex items-center gap-1">
            {tc('btn.readMore')} <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default memo(NewsCard)
