import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { getAll } from '../store.js'
import { generateToken, verifyToken } from '../auth.js'

const router = Router()

interface AdminUser {
  username: string
  passwordHash: string
}

interface EmployeeUser {
  id: string
  username: string
  passwordHash: string
}

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password required' })
      return
    }
    const admins = await getAll<AdminUser>('admins')
    const admin = admins.find(a => a.username === username)
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }
    const token = generateToken({ username: admin.username, role: 'admin' })
    res.json({ token, username: admin.username })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/login/employee', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password required' })
      return
    }
    const employees = await getAll<EmployeeUser>('employees')
    const employee = employees.find(e => e.username === username)
    if (!employee || !employee.passwordHash || !(await bcrypt.compare(password, employee.passwordHash))) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }
    const token = generateToken({ username: employee.username, role: 'employee', employeeId: employee.id })
    res.json({ token, username: employee.username, employeeId: employee.id })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/verify', (req, res) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ valid: false })
    return
  }
  try {
    const payload = verifyToken(header.slice(7))
    res.json({ valid: true, username: payload.username, role: payload.role, employeeId: payload.employeeId })
  } catch {
    res.status(401).json({ valid: false })
  }
})

export default router
