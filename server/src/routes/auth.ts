import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { getAll } from '../store.js'
import { generateToken, verifyToken } from '../auth.js'

const router = Router()

interface AdminUser {
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

router.get('/verify', (req, res) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ valid: false })
    return
  }
  try {
    const payload = verifyToken(header.slice(7))
    res.json({ valid: true, username: payload.username, role: payload.role })
  } catch {
    res.status(401).json({ valid: false })
  }
})

export default router
