import AdminListPage from './AdminListPage'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'titleKey', label: 'Title Key' },
  { key: 'icon', label: 'Icon' },
]

const defaultItem = {
  id: '',
  icon: 'FaHeartbeat',
  titleKey: '',
  subtitleKey: '',
  descKey: '',
  offeringsKey: '',
}

export default function AdminPrograms() {
  return (
    <AdminListPage
      title="Programs"
      apiPath="/api/programs"
      columns={columns}
      defaultItem={defaultItem}
    />
  )
}
