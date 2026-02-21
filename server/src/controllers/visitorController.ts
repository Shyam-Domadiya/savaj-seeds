import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Visitor from '../models/Visitor';

// @desc    Log a visitor's IP address
// @route   POST /api/visitors
// @access  Public
export const logVisitor = asyncHandler(async (req: Request, res: Response) => {
    const ipAddress =
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        req.ip ||
        'Unknown IP';

    const actualIp = Array.isArray(ipAddress)
        ? ipAddress[0]
        : (typeof ipAddress === 'string' ? ipAddress.split(',')[0].trim() : ipAddress);

    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Current Date 
    const now = new Date();

    // Format the time directly into Indian Standard Time (IST) strings to store in the DB
    // Since India is UTC +5:30
    const readableDateStr = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' });
    const readableTimeStr = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });

    // Try to find if this IP already exists
    const existingVisitor = await Visitor.findOne({ ipAddress: actualIp as string });

    if (existingVisitor && actualIp !== 'Unknown IP') {
        // Only update 'visitedAt' if last visit was more than 1 hour ago
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (existingVisitor.visitedAt < oneHourAgo) {
            existingVisitor.visitedAt = now;
            existingVisitor.readableDateStr = readableDateStr;
            existingVisitor.readableTimeStr = readableTimeStr;
            existingVisitor.totalVisits += 1;
            await existingVisitor.save();
        }
    } else if (actualIp !== 'Unknown IP') {
        // First time visitor
        await Visitor.create({
            ipAddress: actualIp as string,
            userAgent,
            visitedAt: now,
            readableDateStr,
            readableTimeStr,
            totalVisits: 1
        });
    }

    res.status(200).json({ success: true, message: 'Visitor logged' });
});

// @desc    Get all visitor logs for Admin Panel
// @route   GET /api/visitors
// @access  Private/Admin
export const getVisitors = asyncHandler(async (req: Request, res: Response) => {
    const visitors = await Visitor.find({}).sort({ visitedAt: -1 }); // Sort by newest first
    res.status(200).json(visitors);
});
