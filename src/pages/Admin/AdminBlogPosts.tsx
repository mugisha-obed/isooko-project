import AdminListPage from './AdminListPage'

const columns = [
  { key: 'slug', label: 'Slug' },
  { key: 'titleKey', label: 'Title Key' },
  { key: 'category', label: 'Category' },
  { key: 'date', label: 'Date' },
  { key: 'author', label: 'Author' },
]

const defaultItem = {
  slug: '',
  titleKey: '',
  excerptKey: '',
  contentKey: '',
  date: new Date().toISOString().slice(0, 10),
  author: 'Isôoko Community Development',
  featuredImage: '/assets/gallery/gallery-placeholder.svg',
  category: 'news',
}

export default function AdminBlogPosts() {
  return (
    <AdminListPage
      title="Blog Posts"
      apiPath="/api/blog-posts"
      columns={columns}
      defaultItem={defaultItem}
    />
  )
}
