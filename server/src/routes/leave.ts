import { Router } from 'express'
import { getAll, getById, createOne, updateOne } from '../store.js'
import { requireAdmin, requireEmployee } from '../auth.js'

export function createLeaveRouter() {
  const router = Router()

  router.get('/', requireAdmin, async (_req, res) => {
    try {
      const items = await getAll('leave-requests')
      res.json(items)
    } catch {
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  router.get('/me', requireEmployee, async (req, res) => {
    try {
      const all = await getAll<any>('leave-requests')
      res.json(all.filter(l => l.employeeId === req.user!.employeeId))
    } catch {
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  router.post('/', requireEmployee, async (req, res) => {
    try {
      const { startDate, endDate, type, reason } = req.body
      if (!startDate || !endDate || !type) {
        res.status(400).json({ error: 'startDate, endDate and type are required' })
        return
      }
      const item = await createOne('leave-requests', {
        employeeId: req.user!.employeeId,
        startDate,
        endDate,
        type,
        reason: reason || '',
        status: 'pending',
      })
      res.status(201).json(item)
    } catch {
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  router.get('/:id', requireAdmin, async (req, res) => {
    try {
      const item = await getById('leave-requests', req.params.id)
      if (!item) { res.status(404).json({ error: 'Not found' }); return }
      res.json(item)
    } catch {
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  router.put('/:id/status', requireAdmin, async (req, res) => {
    try {
      const { status, adminNote } = req.body
      if (!['approved', 'rejected'].includes(status)) {
        res.status(400).json({ error: 'Status must be approved or rejected' })
        return
      }
      const item = await updateOne('leave-requests', req.params.id, {
        status,
        adminNote: adminNote || '',
      })
      if (!item) { res.status(404).json({ error: 'Not found' }); return }
      res.json(item)
    } catch {
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  return router
}
