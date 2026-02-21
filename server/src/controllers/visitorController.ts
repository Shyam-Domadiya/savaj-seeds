import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Visitor from '../models/Visitor';

// @desc    Log a visitor's IP address
// @route   POST /api/visitors
// @access  Public
export const logVisitor = asyncHandler(async (req: Request, res: Response) => {
    // Get the IP address from headers or connection
    const ipAddress =
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        req.ip ||
        'Unknown IP';

    // Support picking the first IP if x-forwarded-for is a comma-separated list
    const actualIp = Array.isArray(ipAddress)
        ? ipAddress[0]
        : (typeof ipAddress === 'string' ? ipAddress.split(',')[0].trim() : ipAddress);

    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Optional: Check if we logged this IP in the last 1 hour to prevent spamming the database
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentVisit = await Visitor.findOne({
        ipAddress: actualIp as string,
        visitedAt: { $gte: oneHourAgo }
    });

    if (!recentVisit && actualIp !== 'Unknown IP') {
        await Visitor.create({
            ipAddress: actualIp as string,
            userAgent,
            visitedAt: new Date()
        });
    }

    res.status(200).json({ success: true, message: 'Visitor logged' });
});
