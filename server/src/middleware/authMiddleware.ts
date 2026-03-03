import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin, { IAdmin } from '../models/Admin';

interface AuthRequest extends Request {
    admin?: IAdmin;
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let adminId: string | null = null;

    // 1. Check Authorization: Bearer <token> header (works through Next.js proxy)
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
            adminId = decoded.id;
        } catch {
            res.status(401).json({ message: 'Not authorized, invalid token' });
            return;
        }
    }

    // 2. Fall back to session cookie
    if (!adminId) {
        if (!req.session || !req.session.adminId) {
            res.status(401).json({ message: 'Not authorized, please log in' });
            return;
        }
        adminId = req.session.adminId;
    }

    try {
        const admin = await Admin.findById(adminId).select('-password') as IAdmin;
        if (!admin) {
            res.status(401).json({ message: 'Not authorized, admin not found' });
            return;
        }
        req.admin = admin;
        next();
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(401).json({ message: 'Not authorized, token invalid' });
    }
};

export { protect };
