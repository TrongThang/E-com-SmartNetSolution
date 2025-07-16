"use client"
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useSSE = (onMessage) => {
    const connectSSE = useCallback(() => {
        const eventSource = new EventSource(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}sse/events`);

        eventSource.onopen = () => {
            console.log('SSE Connected');
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (onMessage) {
                    onMessage(data);
                }
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            eventSource.close();
            // Thử kết nối lại sau 5 giây
            setTimeout(connectSSE, 5000);
        };

        return eventSource;
    }, [onMessage]);

    useEffect(() => {
        const eventSource = connectSSE();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [connectSSE]);
};