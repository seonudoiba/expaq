import { apiClient } from '@/lib/api/client';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'PAYMENT' | 'REVIEW' | 'MESSAGE' | 'SYSTEM' | 'ACTIVITY' | 'HOST';
  read: boolean;
  createdAt: string;
  updatedAt: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPage {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  bookingUpdates: boolean;
  paymentUpdates: boolean;
  reviewUpdates: boolean;
  messageUpdates: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
}

export const notificationService = {
  /**
   * Get all notifications for current user
   */
  getNotifications: async (page = 0, size = 20, unreadOnly = false): Promise<NotificationPage> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });
      
      if (unreadOnly) {
        params.append('unreadOnly', 'true');
      }

      const response = await apiClient.get<NotificationPage>(`/api/notifications?${params}`);
      console.log('Notifications response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 0,
        first: true,
        last: true,
      };
    }
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get<{ count: number }>('/api/notifications/unread-count');
      console.log('Unread notifications count:', response.data.count);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
      return 0;
    }
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId: string): Promise<void> => {
    try {
      await apiClient.post(`/api/notifications/${notificationId}/read`);
      console.log('Notification marked as read:', notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<void> => {
    try {
      await apiClient.post('/api/notifications/mark-all-read');
      console.log('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Delete notification
   */
  deleteNotification: async (notificationId: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/notifications/${notificationId}`);
      console.log('Notification deleted:', notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Delete all notifications
   */
  deleteAllNotifications: async (): Promise<void> => {
    try {
      await apiClient.delete('/api/notifications');
      console.log('All notifications deleted');
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  },

  /**
   * Get notification preferences
   */
  getPreferences: async (): Promise<NotificationPreferences> => {
    try {
      const response = await apiClient.get<NotificationPreferences>('/api/notifications/preferences');
      console.log('Notification preferences:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        bookingUpdates: true,
        paymentUpdates: true,
        reviewUpdates: true,
        messageUpdates: true,
        marketingEmails: false,
        weeklyDigest: true,
      };
    }
  },

  /**
   * Update notification preferences
   */
  updatePreferences: async (preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
    try {
      const response = await apiClient.put<NotificationPreferences>('/api/notifications/preferences', preferences);
      console.log('Notification preferences updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  },

  /**
   * Send test notification
   */
  sendTestNotification: async (): Promise<void> => {
    try {
      await apiClient.post('/api/notifications/test');
      console.log('Test notification sent');
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  },

  /**
   * Subscribe to push notifications
   */
  subscribeToPush: async (subscription: PushSubscription): Promise<void> => {
    try {
      await apiClient.post('/api/notifications/push-subscription', {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!),
        },
      });
      console.log('Push notification subscription saved');
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  },

  /**
   * Unsubscribe from push notifications
   */
  unsubscribeFromPush: async (): Promise<void> => {
    try {
      await apiClient.delete('/api/notifications/push-subscription');
      console.log('Push notification subscription removed');
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      throw error;
    }
  },

  /**
   * Get notifications by type
   */
  getNotificationsByType: async (
    type: Notification['type'], 
    page = 0, 
    size = 20
  ): Promise<NotificationPage> => {
    try {
      const response = await apiClient.get<NotificationPage>(
        `/api/notifications/type/${type}?page=${page}&size=${size}`
      );
      console.log(`${type} notifications response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} notifications:`, error);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 0,
        first: true,
        last: true,
      };
    }
  },

  /**
   * Create manual notification (admin only)
   */
  createNotification: async (notification: {
    userId: string;
    title: string;
    message: string;
    type: Notification['type'];
    actionUrl?: string;
    metadata?: Record<string, any>;
  }): Promise<Notification> => {
    try {
      const response = await apiClient.post<Notification>('/api/notifications', notification);
      console.log('Notification created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  /**
   * Get notification statistics (admin only)
   */
  getNotificationStats: async (): Promise<{
    totalSent: number;
    totalRead: number;
    totalUnread: number;
    byType: Record<string, number>;
    byDay: Array<{ date: string; count: number }>;
  }> => {
    try {
      const response = await apiClient.get('/api/notifications/stats');
      console.log('Notification statistics:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification statistics:', error);
      return {
        totalSent: 0,
        totalRead: 0,
        totalUnread: 0,
        byType: {},
        byDay: [],
      };
    }
  },
};

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Push notification setup
export const setupPushNotifications = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registered:', registration);

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return false;
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      // Send subscription to server
      await notificationService.subscribeToPush(subscription);
      return true;

    } catch (error) {
      console.error('Error setting up push notifications:', error);
      return false;
    }
  }
  return false;
};

export default notificationService;