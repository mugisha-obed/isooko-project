import AdminListPage from './AdminListPage'

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'trainer', label: 'Trainer' },
  { key: 'scheduledAt', label: 'Scheduled (ISO)' },
  { key: 'duration', label: 'Duration (min)' },
  { key: 'status', label: 'Status' },
]

const defaultItem = {
  title: '',
  description: '',
  trainer: 'Isôoko Coach',
  scheduledAt: new Date().toISOString().slice(0, 16),
  duration: 45,
  joinUrl: '',
  status: 'upcoming',
  reminderMinutes: 30,
}

export default function AdminGymLiveSessions() {
  return (
    <AdminListPage
      title="Gym Live Sessions"
      apiPath="/api/gym-live-sessions"
      columns={columns}
      defaultItem={defaultItem}
    />
  )
}