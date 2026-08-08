export interface BlogPost {
  slug: string
  titleKey: string
  excerptKey: string
  contentKey: string
  date: string
  author: string
  featuredImage: string
  category: 'news' | 'event'
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'first-aid-training-2026',
    titleKey: 'posts.firstAid.title',
    excerptKey: 'posts.firstAid.excerpt',
    contentKey: 'posts.firstAid.content',
    date: '2026-07-15',
    author: 'Isôoko Community Development',
    featuredImage: '/assets/gallery/gallery-1.jpg',
    category: 'news',
  },
  {
    slug: 'vocational-training-launch',
    titleKey: 'posts.vocational.title',
    excerptKey: 'posts.vocational.excerpt',
    contentKey: 'posts.vocational.content',
    date: '2026-06-22',
    author: 'Isôoko Community Development',
    featuredImage: '/assets/gallery/gallery-2.jpg',
    category: 'news',
  },
  {
    slug: 'financial-inclusion-fast',
    titleKey: 'posts.financial.title',
    excerptKey: 'posts.financial.excerpt',
    contentKey: 'posts.financial.content',
    date: '2026-07-13',
    author: 'Isôoko Community Development',
    featuredImage: '/assets/gallery/gallery-3.jpg',
    category: 'news',
  },
  {
    slug: 'english-club-masoro',
    titleKey: 'posts.englishClub.title',
    excerptKey: 'posts.englishClub.excerpt',
    contentKey: 'posts.englishClub.content',
    date: '2026-06-01',
    author: 'Isôoko Community Development',
    featuredImage: '/assets/gallery/gallery-4.jpg',
    category: 'event',
  },
]
