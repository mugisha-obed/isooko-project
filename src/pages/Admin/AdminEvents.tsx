import AdminListPage from './AdminListPage'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'titleKey', label: 'Title Key' },
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time' },
]

const defaultItem = {
  id: '',
  titleKey: '',
  date: '',
  time: '',
  locationKey: '',
  descKey: '',
}

export default function AdminEvents() {
  return (
    <AdminListPage
      title="Events"
      apiPath="/api/events"
      columns={columns}
      defaultItem={defaultItem}
    />
  )
}
