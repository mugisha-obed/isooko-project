import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaBook, FaBookOpen, FaUser } from 'react-icons/fa'
import type { Book } from '../../data/books'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  const { t } = useTranslation('library')

  const dotColor =
    book.category === 'novel'
      ? 'bg-[#B6582A]'
      : book.category === 'education'
        ? 'bg-[#2D6A4F]'
        : 'bg-[#E9C46A]'

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className="relative h-44 flex items-center justify-center px-6"
        style={{ backgroundColor: book.cover }}
        aria-hidden="true"
      >
        <FaBook size={56} className="text-white/30" aria-hidden="true" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">{book.title}</h3>
          <p className="text-sm text-white/80 mt-1 line-clamp-1">{book.author}</p>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full inline-flex items-center gap-1 text-white ${book.category === 'novel' ? 'bg-[#B6582A]' : book.category === 'education' ? 'bg-[#2D6A4F]' : book.category === 'children' ? 'bg-[#3A86FF]' : 'bg-[#6A4C93]'}`}>
            <FaBookOpen aria-hidden="true" />
            {t(`categories.${book.category}`)}
          </span>
          <span className="text-xs text-[#5C4A3E]">· {book.year}</span>
        </div>
        <p className="text-sm text-[#5C4A3E] leading-relaxed flex-1">{t(book.descriptionKey)}</p>
        <div className="flex items-center justify-between mt-2 border-t border-[#EADFD3] pt-3">
          <span className="text-sm font-medium text-[#17191F] inline-flex items-center gap-2">
            <FaUser aria-hidden="true" className="text-[#4B9F46]" />
            {book.author}
          </span>
          <span className="text-sm text-[#5C4A3E]">{book.pages} {t('pages')}</span>
        </div>
        <Link
          to={`/library/${book.id}`}
          className="btn btn-primary w-full justify-center"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
          }}
        >
          <FaBookOpen aria-hidden="true" size={14} />
          {t('readNow')}
        </Link>
      </div>
    </article>
  )
}