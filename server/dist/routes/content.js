import { Router } from 'express';
import { getAll, getById, createOne, updateOne, deleteOne } from '../store.js';
import { requireAdmin } from '../auth.js';
export function createContentRouter(collection) {
    const router = Router();
    router.get('/', async (_req, res) => {
        try {
            const items = await getAll(collection);
            res.json(items);
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.get('/:id', async (req, res) => {
        try {
            const item = await getById(collection, req.params.id);
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
            const item = await createOne(collection, req.body);
            res.status(201).json(item);
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.put('/:id', requireAdmin, async (req, res) => {
        try {
            const item = await updateOne(collection, req.params.id, req.body);
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
            const ok = await deleteOne(collection, req.params.id);
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
//# sourceMappingURL=content.js.map