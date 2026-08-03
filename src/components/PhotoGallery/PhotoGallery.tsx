import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Lightbox from '../Lightbox/Lightbox'
import type { GalleryImage } from '../../data/galleryImages'
import styles from './PhotoGallery.module.css'

interface PhotoGalleryProps {
  images: GalleryImage[]
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const { t } = useTranslation('impact')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const handleOpen = (index: number) => setLightboxIndex(index)
  const handleClose = () => setLightboxIndex(null)
  const handlePrev = () =>
    setLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : 0))
  const handleNext = () =>
    setLightboxIndex((i) => (i !== null ? Math.min(images.length - 1, i + 1) : 0))

  return (
    <>
      <div className={styles.grid} role="list">
        {images.map((img, index) => (
          <button
            key={img.id}
            className={styles.item}
            onClick={() => handleOpen(index)}
            role="listitem"
            aria-label={t(img.altKey)}
          >
            <img
              src={img.src}
              alt={t(img.altKey)}
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.overlay} aria-hidden="true" />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  )
}
