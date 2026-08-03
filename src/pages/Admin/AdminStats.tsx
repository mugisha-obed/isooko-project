import AdminListPage from './AdminListPage'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'value', label: 'Value' },
  { key: 'suffix', label: 'Suffix' },
  { key: 'labelKey', label: 'Label Key' },
]

const defaultItem = {
  id: '',
  value: 0,
  suffix: '+',
  labelKey: '',
}

export default function AdminStats() {
  return (
    <AdminListPage
      title="Impact Stats"
      apiPath="/api/impact-stats"
      columns={columns}
      defaultItem={defaultItem}
    />
  )
}
