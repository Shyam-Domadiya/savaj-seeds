import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Admin, { IAdmin } from '../models/Admin';

interface AuthRequest extends Request {
    admin?: IAdmin;
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

            req.admin = await Admin.findById(decoded.id).select('-password') as IAdmin;

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
};

export { protect };
