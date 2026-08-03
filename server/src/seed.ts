import bcrypt from 'bcryptjs'
import { getAll, upsertAll } from './store.js'

interface AdminUser {
  username: string
  passwordHash: string
}

export async function seedAdmin() {
  const existing = await getAll<AdminUser>('admins')
  if (existing.length > 0) return
  const passwordHash = await bcrypt.hash('admin123', 10)
  await upsertAll('admins', [
    { username: 'admin', passwordHash },
  ])
  console.log('Default admin created: admin / admin123')
}
