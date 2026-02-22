'use client';

import { useEffect } from 'react';
import { getApiUrl } from '@/lib/api-config';

export function VisitorTracker() {
    useEffect(() => {
        const logVisitor = async () => {
            try {
                // Only log once per session in the frontend to avoid strict mode double calls
                const logged = sessionStorage.getItem('visitor_logged');
                if (!logged) {
                    console.log('VisitorTracker: Sending log request...');
                    const response = await fetch(`${getApiUrl()}/visitors`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({})
                    });
                    if (response.ok) {
                        console.log('VisitorTracker: Successfully logged');
                        sessionStorage.setItem('visitor_logged', 'true');
                    } else {
                        console.error('VisitorTracker: Failed to log', response.status);
                    }
                }
            } catch (error) {
                // Silent fail for analytics
                console.error('Failed to log visitor:', error);
            }
        };

        logVisitor();

        // Tracker Heartbeat - sends a ping every 10 seconds to accumulate time spent
        const heartbeatInterval = setInterval(async () => {
            try {
                // only ping if we have successfully logged the session
                if (sessionStorage.getItem('visitor_logged') === 'true') {
                    await fetch(`${getApiUrl()}/visitors/time`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ timeSpent: 10 }), // Add 10 seconds
                        keepalive: true
                    });
                }
            } catch (error) {
                // Silently ignore ping errors
            }
        }, 10000); // 10 seconds

        return () => {
            clearInterval(heartbeatInterval);
        };
    }, []);

    return null;
}
