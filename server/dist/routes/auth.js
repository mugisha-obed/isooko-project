import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getAll, createOne, updateOne } from '../store.js';
import { generateToken, verifyToken } from '../auth.js';
import { findValidToken } from './tokens.js';
const router = Router();
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password required' });
            return;
        }
        const admins = await getAll('admins');
        const admin = admins.find(a => a.username === username);
        if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = generateToken({ username: admin.username, role: 'admin' });
        res.json({ token, username: admin.username });
    }
    catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/login/employee', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password required' });
            return;
        }
        const employees = await getAll('employees');
        const employee = employees.find(e => e.username === username);
        if (!employee || !employee.passwordHash || !(await bcrypt.compare(password, employee.passwordHash))) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = generateToken({ username: employee.username, role: 'employee', employeeId: employee.id });
        res.json({ token, username: employee.username, employeeId: employee.id });
    }
    catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/login/token', async (req, res) => {
    try {
        const { username, token, date, latitude, longitude, locationLabel } = req.body;
        if (!username || typeof token !== 'string' || !token.trim()) {
            res.status(400).json({ error: 'Username and daily token required' });
            return;
        }
        const tokenDate = date || today();
        const dailyToken = await findValidToken(tokenDate, token);
        if (!dailyToken) {
            res.status(401).json({ error: 'Invalid or expired daily token' });
            return;
        }
        const employees = await getAll('employees');
        const employee = employees.find(e => e.username === username);
        if (!employee || !employee.active) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const authToken = generateToken({ username: employee.username, role: 'employee', employeeId: employee.id });
        const attendance = await markAttendanceWithLocation({
            employeeId: employee.id,
            date: tokenDate,
            latitude,
            longitude,
            locationLabel,
        });
        res.json({
            token: authToken,
            username: employee.username,
            employeeId: employee.id,
            attendance,
        });
    }
    catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/verify', (req, res) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ valid: false });
        return;
    }
    try {
        const payload = verifyToken(header.slice(7));
        res.json({ valid: true, username: payload.username, role: payload.role, employeeId: payload.employeeId });
    }
    catch {
        res.status(401).json({ valid: false });
    }
});
export default router;
function today() {
    return new Date().toISOString().slice(0, 10);
}
function timeNow() {
    return new Date().toTimeString().slice(0, 5);
}
function validCoord(value) {
    if (typeof value !== 'string' || value.trim() === '')
        return undefined;
    const num = Number(value);
    if (!Number.isFinite(num))
        return undefined;
    return value.trim();
}
/**
 * Checks the employee in for the day using the daily-token login.
 * A single attendance record per employee per day is kept (same rule as
 * the manual check-in). GPS coordinates recorded with the check-in let the
 * admin see where the employee logged in from.
 */
async function markAttendanceWithLocation(params) {
    const { employeeId, date, latitude, longitude, locationLabel } = params;
    const all = await getAll('attendance');
    const existing = all.find(a => a.employeeId === employeeId && a.date === date);
    const location = {
        latitude: validCoord(latitude),
        longitude: validCoord(longitude),
        locationLabel: typeof locationLabel === 'string' && locationLabel.trim() ? locationLabel.trim() : undefined,
    };
    if (existing) {
        if (!existing.checkIn) {
            return updateOne('attendance', existing.id, { checkIn: timeNow(), status: 'present', ...location });
        }
        return existing;
    }
    return createOne('attendance', {
        employeeId,
        date,
        checkIn: timeNow(),
        status: 'present',
        ...location,
    });
}
//# sourceMappingURL=auth.js.map