import bcrypt from 'bcryptjs';
import { getAll, setAdminPassword } from './store.js';
export async function seedAdmin() {
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);
    const existing = await getAll('admins');
    const admin = existing.find(a => a.username === 'admin');
    if (admin) {
        try {
            if (await bcrypt.compare(password, admin.passwordHash))
                return;
        }
        catch {
            // hash missing or invalid -> reset below
        }
        console.log(`Resetting admin password to: ${password}`);
    }
    else {
        console.log(`Default admin created: admin / ${password}`);
    }
    await setAdminPassword('admin', passwordHash);
}
//# sourceMappingURL=seed.js.map