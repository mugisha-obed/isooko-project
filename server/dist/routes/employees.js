import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getAll, getById, createOne, updateOne, deleteOne } from '../store.js';
import { requireAdmin, requireEmployee } from '../auth.js';
export function createEmployeesRouter() {
    const router = Router();
    router.get('/', requireAdmin, async (_req, res) => {
        try {
            const items = await getAll('employees');
            res.json(items.map(stripPassword));
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.get('/me', requireEmployee, async (req, res) => {
        try {
            const employee = await getById('employees', req.user.employeeId);
            if (!employee) {
                res.status(404).json({ error: 'Employee not found' });
                return;
            }
            const { passwordHash, ...safe } = employee;
            const attendance = await getAll('attendance');
            const leaves = await getAll('leave-requests');
            res.json({
                ...safe,
                attendance: attendance.filter(a => a.employeeId === employee.id),
                leaves: leaves.filter(l => l.employeeId === employee.id),
            });
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.get('/:id', requireAdmin, async (req, res) => {
        try {
            const item = await getById('employees', req.params.id);
            if (!item) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.json(stripPassword(item));
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.post('/', requireAdmin, async (req, res) => {
        try {
            const { passwordHash, password, ...rest } = req.body;
            const body = { ...rest, active: rest.active ?? true };
            const pass = passwordHash || password;
            if (pass) {
                body.passwordHash = await bcrypt.hash(pass, 10);
            }
            const item = await createOne('employees', body);
            res.status(201).json(stripPassword(item));
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.put('/:id', requireAdmin, async (req, res) => {
        try {
            const { passwordHash, password, ...rest } = req.body;
            const body = { ...rest };
            const pass = passwordHash || password;
            if (pass) {
                body.passwordHash = await bcrypt.hash(pass, 10);
            }
            const item = await updateOne('employees', req.params.id, body);
            if (!item) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            res.json(stripPassword(item));
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.delete('/:id', requireAdmin, async (req, res) => {
        try {
            const ok = await deleteOne('employees', req.params.id);
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
    router.get('/:id/attendance', requireAdmin, async (req, res) => {
        try {
            const all = await getAll('attendance');
            res.json(all.filter(a => a.employeeId === req.params.id));
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.get('/:id/leave', requireAdmin, async (req, res) => {
        try {
            const all = await getAll('leave-requests');
            res.json(all.filter(l => l.employeeId === req.params.id));
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.post('/:id/attendance', requireEmployee, async (req, res) => {
        try {
            if (req.user.employeeId !== req.params.id) {
                res.status(403).json({ error: 'You can only mark your own attendance' });
                return;
            }
            const employeeId = req.params.id;
            const date = req.body.date || today();
            const action = req.body.action || 'checkin';
            const all = await getAll('attendance');
            const existing = all.find(a => a.employeeId === employeeId && a.date === date);
            if (action === 'checkin') {
                if (existing && existing.checkIn) {
                    res.status(400).json({ error: 'Already checked in today' });
                    return;
                }
                const now = timeNow();
                const location = {
                    latitude: String(req.body.latitude || ''),
                    longitude: String(req.body.longitude || ''),
                    locationLabel: typeof req.body.locationLabel === 'string' ? req.body.locationLabel : '',
                };
                if (existing) {
                    const updated = await updateOne('attendance', existing.id, { checkIn: now, status: 'present', employeeId, ...location });
                    res.json(updated);
                }
                else {
                    const created = await createOne('attendance', { employeeId, date, checkIn: now, status: 'present', ...location });
                    res.status(201).json(created);
                }
                return;
            }
            if (action === 'checkout') {
                if (!existing || !existing.checkIn) {
                    res.status(400).json({ error: 'Not checked in today' });
                    return;
                }
                if (existing.checkOut) {
                    res.status(400).json({ error: 'Already checked out today' });
                    return;
                }
                const updated = await updateOne('attendance', existing.id, { checkOut: timeNow() });
                res.json(updated);
                return;
            }
            res.status(400).json({ error: 'Invalid action' });
        }
        catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    return router;
}
function stripPassword(item) {
    if (!item)
        return item;
    const { passwordHash, ...rest } = item;
    return rest;
}
function today() {
    return new Date().toISOString().slice(0, 10);
}
function timeNow() {
    return new Date().toTimeString().slice(0, 5);
}
//# sourceMappingURL=employees.js.map