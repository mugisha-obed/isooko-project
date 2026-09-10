import AdminListPage from './AdminListPage'

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'duration', label: 'Duration (min)' },
  { key: 'trainer', label: 'Trainer' },
]

const defaultItem = {
  title: '',
  description: '',
  trainer: 'Isôoko Coach',
  category: 'strength',
  difficulty: 'beginner',
  duration: 30,
  thumbnail: '',
  videoUrl: '',
}

export default function AdminGymWorkouts() {
  return (
    <AdminListPage
      title="Gym Workouts"
      apiPath="/api/gym-workouts"
      columns={columns}
      defaultItem={defaultItem}
    />
  )
}