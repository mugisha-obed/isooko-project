import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ExpressPeerServer } from 'peer';
import { app } from './app.js';
import { seedAdmin, seedEmployee } from './seed.js';
import { runReminderCheck, startReminderScheduler } from './reminders.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const isDev = process.env.NODE_ENV !== 'production';
const server = createServer(app);
// Self-hosted WebRTC signalling for the gym live stream.
//
// The public PeerJS cloud was the single point of failure: if it was
// unreachable or throttled the broadcaster's peer never registered, so members
// placed a call into the void and saw "connecting" forever while the admin
// panel still showed ON AIR (that badge comes from our own heartbeat, not from
// PeerJS). Serving the signalling server from this same process removes the
// external dependency and keeps the handshake on one host.
const peerServer = ExpressPeerServer(server, {
    path: '/peerjs',
    allow_discovery: false,
    proxied: false,
});
// Mounted without a path prefix: the middleware matches on its own `path`
// option. Mounting it at '/peerjs' as well would strip the prefix and nothing
// would match.
app.use(peerServer);
// Must stay after the signalling routes above, otherwise the SPA catch-all
// would swallow /peerjs requests.
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
        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            // The client appends the literal 'peerjs' segment to its configured path,
            // so the real socket endpoint is /peerjs/peerjs, not /peerjs.
            console.log(`WebRTC signalling available at ws://localhost:${PORT}/peerjs/peerjs?key=peerjs`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
    runReminderCheck().catch(error => console.warn('Initial reminder check failed:', error));
    startReminderScheduler();
}
startServer();
//# sourceMappingURL=index.js.map