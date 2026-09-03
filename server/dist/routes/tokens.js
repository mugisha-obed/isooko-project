import { Router } from 'express';
import { getAll, createOne, updateOne, deleteOne } from '../store.js';
import { requireAdmin } from '../auth.js';
const TOKEN_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function generateToken(length = 8) {
    let out = '';
    for (let i = 0; i < length; i++) {
        out += TOKEN_CHARS[Math.floor(Math.random() * TOKEN_CHARS.length)];
    }
    return out;
}
async function findByDate(date) {
    const all = await getAll('tokens');
    return all.filter(t => t.date === date);
}
/**
 * Validates that raw code belongs to an active daily token for the given date.
 * Comparison is case-insensitive so employees can type uppercase/lowercase freely.
 */
export async function findValidToken(date, value) {
    if (!date || typeof value !== 'string')
        return null;
    const normalized = value.trim().toUpperCase();
    const all = await getAll('tokens');
    return all.find(t => t.date === date && t.active !== false && String(t.token).toUpperCase() === normalized) || null;
}
export function createTokensRouter() {
    const router = Router();
    router.get('/', requireAdmin, async (_req, res) => {
        try {
            const items = await getAll('tokens');
            res.json(items.sort((a, b) => (a.date < b.date ? 1 : -1)));
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.get('/today', requireAdmin, async (req, res) => {
        try {
            const date = req.query.date || new Date().toISOString().slice(0, 10);
            const items = await findByDate(date);
            res.json(items);
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.post('/', requireAdmin, async (req, res) => {
        try {
            const date = req.body.date || new Date().toISOString().slice(0, 10);
            const token = req.body.token || generateToken();
            const existing = await findByDate(date);
            for (const item of existing) {
                await updateOne('tokens', item.id, { active: false });
            }
            const created = await createOne('tokens', {
                date,
                token: token.toUpperCase(),
                active: true,
            });
            res.status(201).json(created);
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.delete('/:id', requireAdmin, async (req, res) => {
        try {
            const ok = await deleteOne('tokens', req.params.id);
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
//# sourceMappingURL=tokens.js.map