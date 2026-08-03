import AdminListPage from './AdminListPage'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'attribution', label: 'Attribution' },
  { key: 'quoteKey', label: 'Quote Key' },
]

const defaultItem = {
  id: '',
  quoteKey: '',
  attribution: '',
  roleKey: '',
}

export default function AdminTestimonials() {
  return (
    <AdminListPage
      title="Testimonials"
      apiPath="/api/testimonials"
      columns={columns}
      defaultItem={defaultItem}
    />
  )
}
