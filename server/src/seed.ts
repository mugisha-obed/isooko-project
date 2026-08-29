import bcrypt from 'bcryptjs'
import { getAll, setAdminPassword, upsertAll } from './store.js'

interface AdminUser {
  username: string
  passwordHash: string
}

interface Employee {
  id: string
  username: string
  passwordHash: string
}

export async function seedAdmin() {
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const passwordHash = await bcrypt.hash(password, 10)

  const existing = await getAll<AdminUser>('admins')
  const admin = existing.find(a => a.username === 'admin')

  if (admin) {
    try {
      if (await bcrypt.compare(password, admin.passwordHash)) return
    } catch {
      // hash missing or invalid -> reset below
    }
    console.log(`Resetting admin password to: ${password}`)
  } else {
    console.log(`Default admin created: admin / ${password}`)
  }

  await setAdminPassword('admin', passwordHash)
}

export async function seedEmployee() {
  const employees = await getAll<Employee>('employees')
  const existing = employees.find(e => e.username === 'employee1')
  if (existing && existing.passwordHash) return

  const password = process.env.EMPLOYEE_PASSWORD || 'emp123'
  const passwordHash = await bcrypt.hash(password, 10)

  const data = existing
    ? employees.map(e => (e.username === 'employee1' ? { ...e, passwordHash } : e))
    : [...employees, {
        id: 'emp1',
        name: 'Example Employee',
        role: 'Field Officer',
        department: 'Programs',
        phone: '+250 700 000 000',
        email: 'employee@isooko.org',
        startDate: '2025-01-15',
        salary: 150000,
        bankName: 'Bank of Kigali',
        bankAccount: '0000000001',
        taxId: 'TAX-EMP-001',
        active: true,
        username: 'employee1',
        passwordHash,
      }]

  await upsertAll('employees', data)
  console.log(`Example employee created: employee1 / ${password}`)
}
