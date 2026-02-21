import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { UAParser } from 'ua-parser-js';
import Visitor from '../models/Visitor';

import geoip from 'geoip-lite';

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

    // Parse User-Agent for real device data
    const parser = new UAParser(userAgent);
    const parsedObj = parser.getResult();

    // Parse IP for Geolocation
    let country = 'Unknown';
    let city = 'Unknown';

    if (actualIp && actualIp !== '127.0.0.1' && actualIp !== '::1' && actualIp !== 'Unknown IP') {
        const geo = geoip.lookup(actualIp as string);
        if (geo) {
            country = geo.country || 'Unknown';
            city = geo.city || 'Unknown';
        }
    }

    // Fallback logic for device/browser/os
    const os = parsedObj.os.name
        ? `${parsedObj.os.name} ${parsedObj.os.version || ''}`.trim()
        : 'Unknown OS';

    const browser = parsedObj.browser.name
        ? `${parsedObj.browser.name} ${parsedObj.browser.version || ''}`.trim()
        : 'Unknown Browser';

    const deviceType = parsedObj.device.type || (os.includes('Android') || os.includes('iOS') ? 'mobile' : 'desktop');
    const deviceName = parsedObj.device.vendor
        ? `${parsedObj.device.vendor} ${parsedObj.device.model || ''}`.trim()
        : deviceType.charAt(0).toUpperCase() + deviceType.slice(1);

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
            existingVisitor.os = os;
            existingVisitor.browser = browser;
            existingVisitor.device = deviceName;
            existingVisitor.country = country;
            existingVisitor.city = city;
            existingVisitor.totalVisits += 1;
            await existingVisitor.save();
        }
    } else if (actualIp !== 'Unknown IP') {
        // First time visitor
        await Visitor.create({
            ipAddress: actualIp as string,
            userAgent,
            os,
            browser,
            device: deviceName,
            country,
            city,
            visitedAt: now,
            readableDateStr,
            readableTimeStr,
            totalVisits: 1
        });
    }

    res.status(200).json({ success: true, message: 'Visitor logged' });
});

// @desc    Update a visitor's time spent on the site
// @route   PUT /api/visitors/time
// @access  Public
export const updateVisitorTime = asyncHandler(async (req: Request, res: Response) => {
    const ipAddress =
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        req.ip ||
        'Unknown IP';

    const actualIp = Array.isArray(ipAddress)
        ? ipAddress[0]
        : (typeof ipAddress === 'string' ? ipAddress.split(',')[0].trim() : ipAddress);

    // time increment in seconds, usually 5-10s heartbeats
    const { timeSpent } = req.body;

    if (actualIp === 'Unknown IP' || typeof timeSpent !== 'number') {
        res.status(400);
        throw new Error('Invalid request data');
    }

    const visitor = await Visitor.findOne({ ipAddress: actualIp as string });

    if (visitor) {
        // Increment the total time spent by the ping interval
        visitor.totalTimeSpent = (visitor.totalTimeSpent || 0) + timeSpent;
        await visitor.save();
        res.status(200).json({ success: true, message: 'Time updated' });
    } else {
        res.status(404);
        throw new Error('Visitor not found');
    }
});

// @desc    Get all visitor logs for Admin Panel
// @route   GET /api/visitors
// @access  Private/Admin
export const getVisitors = asyncHandler(async (req: Request, res: Response) => {
    const visitors = await Visitor.find({}).sort({ visitedAt: -1 }); // Sort by newest first
    res.status(200).json(visitors);
});
