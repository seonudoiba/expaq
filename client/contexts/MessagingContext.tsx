"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { webSocketService, Message, Conversation, WebSocketEvent } from '@/services/websocket-service';
import { messagingService } from '@/services/messaging-service';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/components/ui/use-toast';

interface MessagingContextType {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  unreadCount: number;
  isConnected: boolean;
  isLoading: boolean;
  
  // Actions
  sendMessage: (receiverId: string, content: string, activityId?: string) => Promise<void>;
  markAsRead: (messageId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  loadMoreMessages: (conversationId: string) => void;
  deleteMessage: (messageId: string) => void;
  
  // Typing indicators
  typingUsers: Record<string, boolean>;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  
  // Online status
  onlineUsers: Set<string>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

interface MessagingProviderProps {
  children: ReactNode;
}

export function MessagingProvider({ children }: MessagingProviderProps) {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [messagePage, setMessagePage] = useState<Record<string, number>>({});

  // Fetch conversations
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: messagingService.getConversations,
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch unread count
  const { data: fetchedUnreadCount = 0 } = useQuery({
    queryKey: ['unread-count'],
    queryFn: messagingService.getUnreadCount,
    enabled: !!user,
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  useEffect(() => {
    setUnreadCount(fetchedUnreadCount);
  }, [fetchedUnreadCount]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (user && token) {
      webSocketService.connect(token)
        .then(() => {
          setIsConnected(true);
          // Request notification permission
          webSocketService.requestNotificationPermission();
        })
        .catch((error) => {
          console.error('Failed to connect to messaging service:', error);
          setIsConnected(false);
        });

      // Set up event listeners
      const handleMessage = (event: WebSocketEvent) => {
        const message = event.data as Message;
        
        // Add message to conversation
        setMessages(prev => ({
          ...prev,
          [message.conversationId || 'default']: [
            ...(prev[message.conversationId || 'default'] || []),
            message
          ]
        }));

        // Update unread count if message is not from current user
        if (message.senderId !== user.id) {
          setUnreadCount(prev => prev + 1);
        }

        // Refresh conversations
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      };

      const handleTyping = (event: WebSocketEvent) => {
        const { conversationId, userId, isTyping } = event.data;
        setTypingUsers(prev => ({
          ...prev,
          [`${conversationId}-${userId}`]: isTyping
        }));

        // Clear typing indicator after 3 seconds
        if (isTyping) {
          setTimeout(() => {
            setTypingUsers(prev => ({
              ...prev,
              [`${conversationId}-${userId}`]: false
            }));
          }, 3000);
        }
      };

      const handleUserOnline = (event: WebSocketEvent) => {
        const { userId } = event.data;
        setOnlineUsers(prev => new Set(prev).add(userId));
      };

      const handleUserOffline = (event: WebSocketEvent) => {
        const { userId } = event.data;
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      };

      const handleConnection = (event: WebSocketEvent) => {
        setIsConnected(event.data.connected);
      };

      const handleReadReceipt = (event: WebSocketEvent) => {
        const { messageId, conversationId } = event.data;
        
        // Update message read status
        setMessages(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map(msg =>
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        }));
      };

      // Subscribe to events
      webSocketService.on('message', handleMessage);
      webSocketService.on('typing', handleTyping);
      webSocketService.on('user_online', handleUserOnline);
      webSocketService.on('user_offline', handleUserOffline);
      webSocketService.on('connection', handleConnection);
      webSocketService.on('read_receipt', handleReadReceipt);

      return () => {
        // Cleanup event listeners
        webSocketService.off('message', handleMessage);
        webSocketService.off('typing', handleTyping);
        webSocketService.off('user_online', handleUserOnline);
        webSocketService.off('user_offline', handleUserOffline);
        webSocketService.off('connection', handleConnection);
        webSocketService.off('read_receipt', handleReadReceipt);
        
        webSocketService.disconnect();
      };
    }
  }, [user, token, queryClient]);

  // Load messages for conversations
  useEffect(() => {
    conversations.forEach(async (conversation) => {
      if (!messages[conversation.id]) {
        try {
          const messagesData = await messagingService.getConversationMessages(conversation.id);
          setMessages(prev => ({
            ...prev,
            [conversation.id]: messagesData.content
          }));
          setMessagePage(prev => ({
            ...prev,
            [conversation.id]: 0
          }));
        } catch (error) {
          console.error('Error loading messages for conversation:', conversation.id, error);
        }
      }
    });
  }, [conversations, messages]);

  const sendMessage = async (receiverId: string, content: string, activityId?: string) => {
    try {
      const message = await messagingService.sendMessage({
        receiverId,
        content,
        messageType: 'TEXT',
        activityId,
      });

      // Send via WebSocket for real-time delivery
      webSocketService.sendMessage({
        senderId: user?.id || '',
        receiverId,
        content,
        messageType: 'TEXT',
        read: false,
        conversationId: message.conversationId,
      });

      // Add to local state immediately for optimistic updates
      if (message.conversationId) {
        setMessages(prev => ({
          ...prev,
          [message.conversationId!]: [
            ...(prev[message.conversationId!] || []),
            message
          ]
        }));
      }

      // Refresh conversations
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const markAsRead = (messageId: string) => {
    messagingService.markMessageAsRead(messageId);
    webSocketService.markAsRead(messageId);
    
    // Update local unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markConversationAsRead = (conversationId: string) => {
    messagingService.markConversationAsRead(conversationId);
    
    // Mark all messages in conversation as read locally
    setMessages(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map(msg => ({ ...msg, read: true }))
    }));

    // Update unread count
    const conversationMessages = messages[conversationId] || [];
    const unreadInConversation = conversationMessages.filter(msg => !msg.read && msg.senderId !== user?.id).length;
    setUnreadCount(prev => Math.max(0, prev - unreadInConversation));
  };

  const loadMoreMessages = async (conversationId: string) => {
    try {
      const currentPage = messagePage[conversationId] || 0;
      const nextPage = currentPage + 1;
      
      const messagesData = await messagingService.getConversationMessages(conversationId, nextPage);
      
      if (messagesData.content.length > 0) {
        setMessages(prev => ({
          ...prev,
          [conversationId]: [
            ...messagesData.content,
            ...(prev[conversationId] || [])
          ]
        }));
        
        setMessagePage(prev => ({
          ...prev,
          [conversationId]: nextPage
        }));
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await messagingService.deleteMessage(messageId);
      
      // Remove from local state
      setMessages(prev => {
        const newMessages = { ...prev };
        Object.keys(newMessages).forEach(conversationId => {
          newMessages[conversationId] = newMessages[conversationId].filter(msg => msg.id !== messageId);
        });
        return newMessages;
      });

      toast({
        title: "Success",
        description: "Message deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const setTyping = (conversationId: string, isTyping: boolean) => {
    webSocketService.sendTyping(conversationId, isTyping);
  };

  const contextValue: MessagingContextType = {
    conversations,
    messages,
    unreadCount,
    isConnected,
    isLoading,
    sendMessage,
    markAsRead,
    markConversationAsRead,
    loadMoreMessages,
    deleteMessage,
    typingUsers,
    setTyping,
    onlineUsers,
  };

  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
}

export default MessagingContext;