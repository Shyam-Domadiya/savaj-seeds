import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Generate JWT
const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            email: admin.email,
            token: generateToken((admin._id as unknown) as string),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get admin profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req: any, res) => {
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
