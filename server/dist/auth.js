import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'isooko-dev-secret-change-in-production';
export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
export function requireAdmin(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const payload = verifyToken(header.slice(7));
        if (payload.role !== 'admin') {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }
        req.user = payload;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
export function requireEmployee(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const payload = verifyToken(header.slice(7));
        if (payload.role !== 'employee' || !payload.employeeId) {
            res.status(403).json({ error: 'Employee access required' });
            return;
        }
        req.user = payload;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
//# sourceMappingURL=auth.js.map