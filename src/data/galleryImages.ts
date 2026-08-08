export interface GalleryImage {
  id: string
  src: string
  altKey: string
}

export const galleryImages: GalleryImage[] = [
  { id: 'g1', src: '/assets/gallery/gallery-1.jpg', altKey: 'gallery.alt1' },
  { id: 'g2', src: '/assets/gallery/gallery-2.jpg', altKey: 'gallery.alt2' },
  { id: 'g3', src: '/assets/gallery/gallery-3.jpg', altKey: 'gallery.alt3' },
  { id: 'g4', src: '/assets/gallery/gallery-4.jpg', altKey: 'gallery.alt4' },
  { id: 'g5', src: '/assets/gallery/gallery-5.jpg', altKey: 'gallery.alt5' },
]
