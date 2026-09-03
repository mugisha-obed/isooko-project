import express from 'express';
import cors from 'cors';
import contactRouter from './routes/contact.js';
import volunteerRouter from './routes/volunteer.js';
import authRouter from './routes/auth.js';
import { createContentRouter } from './routes/content.js';
import { createEmployeesRouter } from './routes/employees.js';
import { createAttendanceRouter } from './routes/attendance.js';
import { createLeaveRouter } from './routes/leave.js';
import { createTokensRouter } from './routes/tokens.js';
export const app = express();
app.use(cors({
    origin(origin, callback) {
        const allowed = (process.env.CORS_ORIGINS || '*').split(',').map(s => s.trim());
        if (!origin || allowed.includes('*') || allowed.includes(origin)) {
            return callback(null, true);
        }
        callback(null, false);
    },
}));
app.use(express.json({ limit: '5mb' }));
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, uptime: process.uptime() });
});
app.use('/api/auth', authRouter);
app.use('/api/contact', contactRouter);
app.use('/api/volunteer', volunteerRouter);
app.use('/api/blog-posts', createContentRouter('blog-posts'));
app.use('/api/events', createContentRouter('events'));
app.use('/api/team-members', createContentRouter('team-members'));
app.use('/api/programs', createContentRouter('programs'));
app.use('/api/gallery-images', createContentRouter('gallery-images'));
app.use('/api/impact-stats', createContentRouter('impact-stats'));
app.use('/api/testimonials', createContentRouter('testimonials'));
app.use('/api/contacts', createContentRouter('contacts'));
app.use('/api/volunteers', createContentRouter('volunteers'));
app.use('/api/employees', createEmployeesRouter());
app.use('/api/attendance', createAttendanceRouter());
app.use('/api/leave', createLeaveRouter());
app.use('/api/tokens', createTokensRouter());
//# sourceMappingURL=app.js.map