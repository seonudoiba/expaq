import { toast } from '@/components/ui/use-toast';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE';
  timestamp: string;
  read: boolean;
  conversationId?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebSocketEvent {
  type: 'MESSAGE' | 'TYPING' | 'READ_RECEIPT' | 'USER_ONLINE' | 'USER_OFFLINE' | 'NOTIFICATION';
  data: any;
  timestamp: string;
}

type EventCallback = (event: WebSocketEvent) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, EventCallback[]> = new Map();
  private isConnected = false;
  private token: string | null = null;

  constructor() {
    this.setupHeartbeat();
  }

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.token = token;
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081/ws';
        this.ws = new WebSocket(`${wsUrl}?token=${token}`);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connection', { connected: true });
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data: WebSocketEvent = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket connection closed');
          this.isConnected = false;
          this.emit('connection', { connected: false });
          this.reconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit('error', { error });
          reject(error);
        };

      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  private reconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.token) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(this.token!);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.log('Max reconnection attempts reached');
      toast({
        title: "Connection Lost",
        description: "Unable to reconnect to messaging service. Please refresh the page.",
        variant: "destructive",
      });
    }
  }

  private handleMessage(event: WebSocketEvent): void {
    console.log('Received WebSocket event:', event);

    switch (event.type) {
      case 'MESSAGE':
        this.emit('message', event.data);
        this.showMessageNotification(event.data);
        break;
      case 'TYPING':
        this.emit('typing', event.data);
        break;
      case 'READ_RECEIPT':
        this.emit('read_receipt', event.data);
        break;
      case 'USER_ONLINE':
        this.emit('user_online', event.data);
        break;
      case 'USER_OFFLINE':
        this.emit('user_offline', event.data);
        break;
      case 'NOTIFICATION':
        this.emit('notification', event.data);
        this.showSystemNotification(event.data);
        break;
      default:
        console.log('Unknown WebSocket event type:', event.type);
    }
  }

  private showMessageNotification(message: Message): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Message', {
        body: message.content,
        icon: '/favicon.ico',
        tag: message.conversationId || message.id,
      });
    }
  }

  private showSystemNotification(notification: any): void {
    toast({
      title: notification.title || "Notification",
      description: notification.message || notification.content,
      variant: notification.type === 'error' ? 'destructive' : 'default',
    });
  }

  sendMessage(message: Omit<Message, 'id' | 'timestamp'>): void {
    if (!this.isConnected || !this.ws) {
      toast({
        title: "Connection Error",
        description: "Not connected to messaging service",
        variant: "destructive",
      });
      return;
    }

    const event: WebSocketEvent = {
      type: 'MESSAGE',
      data: {
        ...message,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    this.ws.send(JSON.stringify(event));
  }

  sendTyping(conversationId: string, isTyping: boolean): void {
    if (!this.isConnected || !this.ws) return;

    const event: WebSocketEvent = {
      type: 'TYPING',
      data: {
        conversationId,
        isTyping,
      },
      timestamp: new Date().toISOString(),
    };

    this.ws.send(JSON.stringify(event));
  }

  markAsRead(messageId: string): void {
    if (!this.isConnected || !this.ws) return;

    const event: WebSocketEvent = {
      type: 'READ_RECEIPT',
      data: {
        messageId,
        readAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    this.ws.send(JSON.stringify(event));
  }

  on(eventType: string, callback: EventCallback): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(callback);
  }

  off(eventType: string, callback: EventCallback): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(eventType: string, data: any): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => callback({ type: eventType as any, data, timestamp: new Date().toISOString() }));
    }
  }

  private setupHeartbeat(): void {
    setInterval(() => {
      if (this.isConnected && this.ws) {
        this.ws.send(JSON.stringify({ type: 'PING', timestamp: new Date().toISOString() }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();
export default webSocketService;