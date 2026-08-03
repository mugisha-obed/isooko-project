import { Router } from 'express';
import { saveSubmission } from '../store.js';
const router = Router();
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, areaOfInterest, message } = req.body;
        if (!name || !email || !areaOfInterest || !message) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const entry = await saveSubmission('volunteers', { name, email, phone: phone || '', areaOfInterest, message });
        res.status(201).json({ success: true, id: entry.id });
    }
    catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=volunteer.js.map