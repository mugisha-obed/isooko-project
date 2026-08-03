import AdminListPage from './AdminListPage'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'src', label: 'Source' },
  { key: 'altKey', label: 'Alt Key' },
]

const defaultItem = {
  id: '',
  src: '/assets/gallery/gallery-placeholder.svg',
  altKey: '',
}

export default function AdminGallery() {
  return (
    <AdminListPage
      title="Gallery Images"
      apiPath="/api/gallery-images"
      columns={columns}
      defaultItem={defaultItem}
    />
  )
}
