import { apiClient } from '@/lib/api/client';
import { Message, Conversation } from './websocket-service';

export interface CreateMessageRequest {
  receiverId: string;
  content: string;
  messageType?: 'TEXT' | 'IMAGE' | 'FILE';
  activityId?: string;
}

export interface MessagePage {
  content: Message[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export const messagingService = {
  /**
   * Get all conversations for current user
   */
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await apiClient.get<Conversation[]>('/api/messages/conversations');
      console.log('Conversations response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  /**
   * Get messages for a specific conversation
   */
  getConversationMessages: async (conversationId: string, page = 0, size = 20): Promise<MessagePage> => {
    try {
      const response = await apiClient.get<MessagePage>(
        `/api/messages/conversations/${conversationId}/messages?page=${page}&size=${size}`
      );
      console.log('Conversation messages response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
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
   * Send a new message
   */
  sendMessage: async (messageData: CreateMessageRequest): Promise<Message> => {
    try {
      const response = await apiClient.post<Message>('/api/messages', messageData);
      console.log('Message sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Get messages between current user and another user
   */
  getMessagesWithUser: async (userId: string, page = 0, size = 20): Promise<MessagePage> => {
    try {
      const response = await apiClient.get<MessagePage>(
        `/api/messages/user/${userId}?page=${page}&size=${size}`
      );
      console.log('Messages with user response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages with user:', error);
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
   * Mark message as read
   */
  markMessageAsRead: async (messageId: string): Promise<void> => {
    try {
      await apiClient.post(`/api/messages/${messageId}/read`);
      console.log('Message marked as read:', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  },

  /**
   * Mark all messages in conversation as read
   */
  markConversationAsRead: async (conversationId: string): Promise<void> => {
    try {
      await apiClient.post(`/api/messages/conversations/${conversationId}/read`);
      console.log('Conversation marked as read:', conversationId);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  },

  /**
   * Get unread message count
   */
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get<{ count: number }>('/api/messages/unread-count');
      console.log('Unread count response:', response.data);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  /**
   * Delete a message
   */
  deleteMessage: async (messageId: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/messages/${messageId}`);
      console.log('Message deleted:', messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  /**
   * Search messages
   */
  searchMessages: async (query: string, page = 0, size = 20): Promise<MessagePage> => {
    try {
      const response = await apiClient.get<MessagePage>(
        `/api/messages/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`
      );
      console.log('Message search response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching messages:', error);
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
   * Get messages related to an activity
   */
  getActivityMessages: async (activityId: string, page = 0, size = 20): Promise<MessagePage> => {
    try {
      const response = await apiClient.get<MessagePage>(
        `/api/messages/activity/${activityId}?page=${page}&size=${size}`
      );
      console.log('Activity messages response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity messages:', error);
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
   * Create or get conversation with a user
   */
  getOrCreateConversation: async (userId: string): Promise<Conversation> => {
    try {
      const response = await apiClient.post<Conversation>(`/api/messages/conversations/with/${userId}`);
      console.log('Conversation created/retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating/retrieving conversation:', error);
      throw error;
    }
  },

  /**
   * Upload file for message
   */
  uploadMessageFile: async (file: File, messageType: 'IMAGE' | 'FILE' = 'FILE'): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', messageType.toLowerCase());

      const response = await apiClient.post<string>('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('File uploaded for message:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading message file:', error);
      throw error;
    }
  },
};

export default messagingService;