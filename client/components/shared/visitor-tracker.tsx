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
                    const response = await fetch(`${getApiUrl()}/visitors`, {
                        method: 'POST',
                    });
                    if (response.ok) {
                        sessionStorage.setItem('visitor_logged', 'true');
                    }
                }
            } catch (error) {
                // Silent fail for analytics
                console.error('Failed to log visitor:', error);
            }
        };

        logVisitor();
    }, []);

    return null;
}
