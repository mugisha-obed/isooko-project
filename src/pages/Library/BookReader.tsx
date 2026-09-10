import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaArrowLeft, FaArrowRight, FaList, FaMinus, FaPlus, FaBookOpen } from 'react-icons/fa'
import SEOHead from '@/components/SEOHead/SEOHead'
import { books } from '@/data/books'
import { getBookContent } from '@/data/bookContent'

export default function BookReader() {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('library')

  const book = books.find((b) => b.id === bookId)
  const content = book ? getBookContent(book.id) : undefined

  const [currentChapter, setCurrentChapter] = useState(0)
  const [fontSize, setFontSize] = useState(18)
  const [showToc, setShowToc] = useState(false)

  useEffect(() => {
    setCurrentChapter(0)
    window.scrollTo(0, 0)
  }, [bookId])

  if (!book || !content) {
    return (
      <>
        <SEOHead title={t('seo.title')} description={t('seo.description')} />
        <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <FaBookOpen size={64} style={{ color: 'var(--color-green-dark)', opacity: 0.3, margin: '0 auto 1rem' }} />
            <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-green-dark)', marginBottom: 'var(--space-4)' }}>
              {t('reader.noContent')}
            </h1>
            <Link to="/library" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
              <FaArrowLeft style={{ marginRight: 8 }} /> {t('reader.backToLibrary')}
            </Link>
          </div>
        </section>
      </>
    )
  }

  const chapter = content.chapters[currentChapter]
  const prev = currentChapter > 0
  const next = currentChapter < content.chapters.length - 1

  return (
    <>
      <SEOHead
        title={`${book.title} — ${t('seo.title')}`}
        description={t('seo.description')}
      />

      {/* Header */}
      <div style={{ background: book.cover, padding: 'var(--space-12) 0 var(--space-8)' }}>
        <div className="container">
          <Link
            to="/library"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'white',
              textDecoration: 'none',
              fontSize: 'var(--font-size-sm)',
              opacity: 0.9,
              marginBottom: 'var(--space-6)',
            }}
          >
            <FaArrowLeft /> {t('reader.backToLibrary')}
          </Link>
          <h1 style={{ color: 'white', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-2)' }}>
            {book.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'var(--font-size-base)' }}>
            {book.author} · {t('reader.publishedBy')} {book.year}
          </p>
        </div>
      </div>

      {/* Controls bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'white',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-3) 0',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <button
              onClick={() => setShowToc(!showToc)}
              className="btn"
              style={{ fontSize: 'var(--font-size-sm)' }}
              aria-label={t('reader.tableOfContents')}
            >
              <FaList style={{ marginRight: 6 }} />
              {t('reader.tableOfContents')}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-brown)' }}>{t('reader.fontSize')}</span>
            <button
              onClick={() => setFontSize((s) => Math.max(14, s - 2))}
              className="btn"
              aria-label="Decrease font size"
              style={{ padding: '6px 10px' }}
            >
              <FaMinus size={12} />
            </button>
            <span style={{ minWidth: 40, textAlign: 'center', fontSize: 'var(--font-size-sm)' }}>{fontSize}px</span>
            <button
              onClick={() => setFontSize((s) => Math.min(28, s + 2))}
              className="btn"
              aria-label="Increase font size"
              style={{ padding: '6px 10px' }}
            >
              <FaPlus size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Table of Contents panel */}
      {showToc && (
        <div
          style={{
            position: 'sticky',
            top: 52,
            zIndex: 15,
            background: 'white',
            borderBottom: '1px solid var(--color-border)',
            padding: 'var(--space-4) 0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div className="container">
            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-3)' }}>
              {t('reader.tableOfContents')}
            </h3>
            <ol style={{ paddingLeft: 'var(--space-5)', margin: 0, listStyle: 'decimal' }}>
              {content.chapters.map((ch, i) => (
                <li key={i} style={{ marginBottom: 'var(--space-2)' }}>
                  <button
                    onClick={() => {
                      setCurrentChapter(i)
                      setShowToc(false)
                      window.scrollTo(0, 0)
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 'var(--font-size-base)',
                      color: i === currentChapter ? 'var(--color-green-dark)' : 'var(--color-brown-dark)',
                      fontWeight: i === currentChapter ? 600 : 400,
                      padding: '4px 0',
                      textDecoration: i === currentChapter ? 'underline' : 'none',
                    }}
                  >
                    {t('reader.chapter')} {i + 1}: {ch.title}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Chapter content */}
      <section className="section" style={{ minHeight: '50vh' }}>
        <div className="container" style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-8)', color: 'var(--color-green-dark)' }}>
            {t('reader.chapter')} {currentChapter + 1}: {chapter.title}
          </h2>
          <div style={{ fontSize }}>
            {chapter.paragraphs.map((para, i) => (
              <p
                key={i}
                style={{
                  marginBottom: 'var(--space-6)',
                  lineHeight: 1.8,
                  color: 'var(--color-brown-dark)',
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Chapter navigation */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'var(--space-12)',
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            {prev ? (
              <button
                onClick={() => {
                  setCurrentChapter((c) => c - 1)
                  window.scrollTo(0, 0)
                }}
                className="btn btn-primary"
              >
                <FaArrowLeft style={{ marginRight: 8 }} /> {t('reader.previousChapter')}
              </button>
            ) : (
              <div />
            )}
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-brown)' }}>
              {currentChapter + 1} / {content.chapters.length}
            </span>
            {next ? (
              <button
                onClick={() => {
                  setCurrentChapter((c) => c + 1)
                  window.scrollTo(0, 0)
                }}
                className="btn btn-primary"
              >
                {t('reader.nextChapter')} <FaArrowRight style={{ marginLeft: 8 }} />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* End-of-book navigation */}
      {!next && (
        <section className="section" style={{ background: 'var(--color-cream-dark)', textAlign: 'center' }}>
          <div className="container">
            <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-4)' }}>
              ✨ {book.title}
            </p>
            <Link to="/library" className="btn btn-primary">
              <FaArrowLeft style={{ marginRight: 8 }} /> {t('reader.backToLibrary')}
            </Link>
          </div>
        </section>
      )}
    </>
  )
}