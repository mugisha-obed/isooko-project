import 'dotenv/config';
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { app } from './app.js';
import { seedAdmin, seedEmployee } from './seed.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const isDev = process.env.NODE_ENV !== 'production';
if (!isDev) {
    const distPath = join(__dirname, '..', '..', 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
        res.sendFile(join(distPath, 'index.html'));
    });
}
async function startServer() {
    try {
        await seedAdmin();
    }
    catch (error) {
        console.warn('Admin seed initialization failed:', error);
    }
    try {
        await seedEmployee();
    }
    catch (error) {
        console.warn('Employee seed initialization failed:', error);
    }
    try {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map