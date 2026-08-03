import AdminListPage from './AdminListPage'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'roleKey', label: 'Role Key' },
]

const defaultItem = {
  id: '',
  name: '',
  roleKey: '',
  photo: '/assets/team/team-placeholder.svg',
}

export default function AdminTeam() {
  return (
    <AdminListPage
      title="Team Members"
      apiPath="/api/team-members"
      columns={columns}
      defaultItem={defaultItem}
    />
  )
}
