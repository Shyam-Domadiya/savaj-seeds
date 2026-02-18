"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Generate JWT
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin_1.default.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            email: admin.email,
            token: generateToken(admin._id),
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});
// @desc    Get admin profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', authMiddleware_1.protect, async (req, res) => {
    const admin = await Admin_1.default.findById(req.admin._id);
    if (admin) {
        res.json({
            _id: admin._id,
            email: admin.email,
        });
    }
    else {
        res.status(404);
        throw new Error('Admin not found');
    }
});
exports.default = router;
