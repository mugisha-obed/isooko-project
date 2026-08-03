import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import type { GalleryImage } from '../../data/galleryImages'
import styles from './Lightbox.module.css'

interface LightboxProps {
  images: GalleryImage[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const { t } = useTranslation(['common', 'impact'])
  const containerRef = useRef<HTMLDivElement>(null)
  useFocusTrap(containerRef, true)

  const image = images[currentIndex]

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <div
        ref={containerRef}
        className={styles.content}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.close}
          onClick={onClose}
          aria-label={t('common:aria.lightboxClose')}
        >
          <FaTimes />
        </button>
        <button
          className={`${styles.navBtn} ${styles.prev}`}
          onClick={onPrev}
          aria-label={t('common:aria.lightboxPrev')}
          disabled={currentIndex === 0}
        >
          <FaChevronLeft />
        </button>
        <img
          src={image.src}
          alt={t(`impact:${image.altKey}`)}
          className={styles.image}
        />
        <button
          className={`${styles.navBtn} ${styles.next}`}
          onClick={onNext}
          aria-label={t('common:aria.lightboxNext')}
          disabled={currentIndex === images.length - 1}
        >
          <FaChevronRight />
        </button>
        <div className={styles.counter} aria-live="polite">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>,
    document.body
  )
}
