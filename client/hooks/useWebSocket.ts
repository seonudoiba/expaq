import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { useAuth } from './useAuth';

export type NotificationType = 
    | 'BOOKING_CREATED'
    | 'BOOKING_UPDATED'
    | 'BOOKING_CANCELLED'
    | 'BOOKING_CONFIRMED'
    | 'MESSAGE_RECEIVED'
    | 'REVIEW_RECEIVED'
    | 'ACTIVITY_UPDATED'
    | 'SYSTEM_NOTIFICATION';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    data: Record<string, unknown>;
    read: boolean;
    readAt: string | null;
    createdAt: string;
}

interface WebSocketMessage {
    type: 'notification' | 'count';
    payload: Notification | number;
}

export const useWebSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
    const clientRef = useRef<Client | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const client = new Client({
            brokerURL: `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'}/ws`,
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            setIsConnected(true);
            console.log('Connected to WebSocket');

            // Subscribe to user-specific notification queue
            client.subscribe(`/user/queue/notifications`, (message) => {
                const notification = JSON.parse(message.body);
                setLastMessage({ type: 'notification', payload: notification });
            });

            // Subscribe to notification count updates
            client.subscribe(`/user/queue/notifications/count`, (message) => {
                const count = JSON.parse(message.body);
                setLastMessage({ type: 'count', payload: count });
            });
        };

        client.onStompError = (frame) => {
            console.error('STOMP error:', frame);
        };

        client.onWebSocketClose = () => {
            setIsConnected(false);
            console.log('Disconnected from WebSocket');
        };

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [user]);

    const sendMessage = (destination: string, message: unknown) => {
        if (clientRef.current && clientRef.current.connected) {
            clientRef.current.publish({
                destination,
                body: JSON.stringify(message),
            });
        }
    };

    return {
        isConnected,
        lastMessage,
        sendMessage,
    };
}; 