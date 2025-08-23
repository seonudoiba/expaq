/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService, Notification, NotificationPreferences } from '@/services/notification-service';
import { webSocketService, WebSocketEvent } from '@/services/websocket-service';
import { useAuthStore } from '@/lib/store/auth';
import { toast } from '@/components/ui/use-toast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  preferences: NotificationPreferences | null;
  
  // Actions
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  loadMoreNotifications: () => void;
  
  // Real-time
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Fetch notifications
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationService.getNotifications(page, 20),
    enabled: !!user,
  });

  // Fetch unread count
  const { data: fetchedUnreadCount = 0 } = useQuery({
    queryKey: ['notification-unread-count'],
    queryFn: notificationService.getUnreadCount,
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch preferences
  const { data: preferences, refetch: refetchPreferences } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: notificationService.getPreferences,
    enabled: !!user,
  });

  // Update notifications when data changes
  useEffect(() => {
    if (notificationsData) {
      if (page === 0) {
        setNotifications(notificationsData.content);
      } else {
        setNotifications(prev => [...prev, ...notificationsData.content]);
      }
      setHasMore(!notificationsData.last);
    }
  }, [notificationsData, page]);

  // Update unread count
  useEffect(() => {
    setUnreadCount(fetchedUnreadCount);
  }, [fetchedUnreadCount]);

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['notification-unread-count'] });
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-unread-count'] });
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
      
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      // Update local state
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      
      // Update unread count if the deleted notification was unread
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-unread-count'] });
      
      toast({
        title: "Success",
        description: "Notification deleted",
      });
      
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await notificationService.deleteAllNotifications();
      
      // Clear local state
      setNotifications([]);
      setUnreadCount(0);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-unread-count'] });
      
      toast({
        title: "Success",
        description: "All notifications deleted",
      });
      
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      toast({
        title: "Error",
        description: "Failed to delete all notifications",
        variant: "destructive",
      });
    }
  };

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    try {
      await notificationService.updatePreferences(newPreferences);
      
      // Refetch preferences
      refetchPreferences();
      
      toast({
        title: "Success",
        description: "Notification preferences updated",
      });
      
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
    }
  };

  const loadMoreNotifications = () => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  };

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    preferences: preferences || null,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    updatePreferences,
    loadMoreNotifications,
    isConnected,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;