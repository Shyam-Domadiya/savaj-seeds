import { Request, Response, NextFunction } from 'express';
import Admin, { IAdmin } from '../models/Admin';

interface AuthRequest extends Request {
    admin?: IAdmin;
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Check if session exists and has adminId
    if (!req.session || !req.session.adminId) {
        res.status(401);
        throw new Error('Not authorized, no session');
    }

    try {
        const admin = await Admin.findById(req.session.adminId).select('-password') as IAdmin;

        if (!admin) {
            res.status(401);
            throw new Error('Not authorized, admin not found');
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(401);
        throw new Error('Not authorized, session invalid');
    }
};

export { protect };
