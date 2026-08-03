import { Router } from 'express';
import { saveSubmission } from '../store.js';
const router = Router();
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const entry = await saveSubmission('contacts', { name, email, subject, message });
        res.status(201).json({ success: true, id: entry.id });
    }
    catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=contact.js.map