import { Request, Response, NextFunction } from 'express';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';
import Visitor from '../models/Visitor';

// Extend Express Session type
declare module 'express-session' {
    interface SessionData {
        visitorLogged?: boolean;
    }
}

export const visitorMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Only track if it's the first time in this session and not a static asset or API call to visitors
    if (req.session && !req.session.visitorLogged) {
        try {
            const rawIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
            let actualIp = Array.isArray(rawIp) ? rawIp[0] : (typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : rawIp);

            if (actualIp === '::1' || actualIp === '::ffff:127.0.0.1') {
                actualIp = '127.0.0.1';
            }

            const userAgent = req.headers['user-agent'] || 'Unknown';

            // Parse User-Agent
            const parser = new UAParser(userAgent);
            const parsedObj = parser.getResult();

            // Geolocation
            let country = 'Unknown';
            let city = 'Unknown';
            if (actualIp && actualIp !== '127.0.0.1' && actualIp !== 'Unknown IP') {
                const geo = geoip.lookup(actualIp as string);
                if (geo) {
                    country = geo.country || 'Unknown';
                    city = geo.city || 'Unknown';
                }
            }

            const os = parsedObj.os.name ? `${parsedObj.os.name} ${parsedObj.os.version || ''}`.trim() : 'Unknown OS';
            const browser = parsedObj.browser.name ? `${parsedObj.browser.name} ${parsedObj.browser.version || ''}`.trim() : 'Unknown Browser';
            const deviceType = parsedObj.device.type || (os.includes('Android') || os.includes('iOS') ? 'mobile' : 'desktop');
            const deviceName = parsedObj.device.vendor ? `${parsedObj.device.vendor} ${parsedObj.device.model || ''}`.trim() : deviceType.charAt(0).toUpperCase() + deviceType.slice(1);

            const now = new Date();
            const readableDateStr = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' });
            const readableTimeStr = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });

            if (actualIp !== 'Unknown IP') {
                const existingVisitor = await Visitor.findOne({ ipAddress: actualIp as string });

                if (existingVisitor) {
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
                    console.log(`[AutoTrack] Updated visitor: ${actualIp} (Total: ${existingVisitor.totalVisits})`);
                } else {
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
                    console.log(`[AutoTrack] Logged new visitor: ${actualIp} [${deviceName}]`);
                }

                // Mark session so we don't log on every request in this session
                req.session.visitorLogged = true;
            }
        } catch (error) {
            console.error('[AutoTrack] Error logging visitor:', error);
        }
    }
    next();
};
