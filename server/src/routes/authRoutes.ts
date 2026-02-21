import express, { Request } from 'express';
import Admin from '../models/Admin';

const router = express.Router();

// Extend session type to include adminId
declare module 'express-session' {
    interface SessionData {
        adminId?: string;
    }
}

// @desc    Auth admin & create session
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
        // Store admin ID in the session (persisted to MongoDB via MongoStore)
        req.session.adminId = (admin._id as unknown) as string;

        res.json({
            _id: admin._id,
            email: admin.email,
            // No token — auth is now session-based
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Logout admin & destroy session
// @route   POST /api/auth/logout
// @access  Public
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('savaj.sid');
        res.json({ message: 'Logged out successfully' });
    });
});

// @desc    Get admin profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', async (req: any, res) => {
    const admin = await Admin.findById(req.admin._id);

    if (admin) {
        res.json({
            _id: admin._id,
            email: admin.email,
        });
    } else {
        res.status(404);
        throw new Error('Admin not found');
    }
});

export default router;
