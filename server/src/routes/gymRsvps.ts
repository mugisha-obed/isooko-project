import { Router } from 'express'
import { getAll, createOne, deleteOne } from '../store.js'
import { requireAdmin } from '../auth.js'

const router = Router()

router.get('/', requireAdmin, async (_req, res) => {
  try {
    const items = await getAll<Record<string, unknown>>('gym-rsvps')
    res.json(items)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:sessionId', requireAdmin, async (req, res) => {
  try {
    const items = await getAll<Record<string, unknown>>('gym-rsvps')
    res.json(items.filter(item => item.sessionId === req.params.sessionId))
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { sessionId, name, email } = req.body ?? {}
    if (!sessionId || !name || !email) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const sessions = await getAll<{ id: string; status?: string }>('gym-live-sessions')
    const session = sessions.find(s => s.id === sessionId && s.status !== 'cancelled')
    if (!session) {
      res.status(404).json({ error: 'Session not found' })
      return
    }

    const existing = await getAll<{ id: string; sessionId: string; email?: string }>('gym-rsvps')
    const duplicate = existing.find(
      r => r.sessionId === sessionId && String(r.email || '').toLowerCase() === String(email).toLowerCase(),
    )
    if (duplicate) {
      res.status(200).json({ success: true, id: duplicate.id, already: true })
      return
    }

    const entry = await createOne('gym-rsvps', { sessionId, name, email })
    res.status(201).json({ success: true, id: entry.id })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const ok = await deleteOne('gym-rsvps', req.params.id)
    if (!ok) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router