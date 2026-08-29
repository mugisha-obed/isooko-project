import { Router } from 'express';
import { getAll, getById, createOne, updateOne, deleteOne } from '../store.js';
import { requireAdmin, requireEmployee } from '../auth.js';
export function createAttendanceRouter() {
    const router = Router();
    router.get('/', requireAdmin, async (_req, res) => {
        try {
            const items = await getAll('attendance');
            res.json(items);
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.get('/me', requireEmployee, async (req, res) => {
        try {
            const all = await getAll('attendance');
            res.json(all.filter(a => a.employeeId === req.user.employeeId));
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.get('/:id', requireAdmin, async (req, res) => {
        try {
            const item = await getById('attendance', req.params.id);
            if (!item) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.json(item);
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.post('/', requireAdmin, async (req, res) => {
        try {
            const item = await createOne('attendance', req.body);
            res.status(201).json(item);
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.put('/:id', requireAdmin, async (req, res) => {
        try {
            const item = await updateOne('attendance', req.params.id, req.body);
            if (!item) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.json(item);
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.delete('/:id', requireAdmin, async (req, res) => {
        try {
            const ok = await deleteOne('attendance', req.params.id);
            if (!ok) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.json({ success: true });
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    return router;
}
//# sourceMappingURL=attendance.js.map