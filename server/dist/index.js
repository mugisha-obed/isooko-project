import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import contactRouter from './routes/contact.js';
import volunteerRouter from './routes/volunteer.js';
import authRouter from './routes/auth.js';
import { createContentRouter } from './routes/content.js';
import { seedAdmin } from './seed.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const isDev = process.env.NODE_ENV !== 'production';
const app = express();
app.use(cors({ origin: isDev ? ['http://localhost:5173'] : true }));
app.use(express.json({ limit: '5mb' }));
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
if (!isDev) {
    const distPath = join(__dirname, '..', '..', 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
        res.sendFile(join(distPath, 'index.html'));
    });
}
seedAdmin().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
//# sourceMappingURL=index.js.map