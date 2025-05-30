import { apiClient } from './client';
import type {
  Activity,
  AuthResponse,
  CreateActivityRequest,
  CreateReviewRequest,
  LoginRequest,
  RegisterRequest,
  Review,
  User,
} from '@/types';

// Auth Services
export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/auth/me');
    return response.data;
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/api/auth/request-password-reset', { email });
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.get(`/api/auth/verify-email?token=${token}`);
  },
};

// Activity Services
export const activityService = {
  getAll: async (params?: {
    location?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Activity[]> => {
    const response = await apiClient.get<Activity[]>('/api/activities', { params });
    console.log('Activities:', response.data);
    return response.data;
  },

  getById: async (id: string): Promise<Activity> => {
    const response = await apiClient.get<Activity>(`/api/activities/${id}`);
    return response.data;
  },

  create: async (data: CreateActivityRequest): Promise<Activity> => {
    const response = await apiClient.post<Activity>('/api/activities', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateActivityRequest>): Promise<Activity> => {
    const response = await apiClient.put<Activity>(`/api/activities/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/activities/${id}`);
  },
};

// Review Services
export const reviewService = {
  create: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await apiClient.post<Review>('/api/v1/reviews', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateReviewRequest>): Promise<Review> => {
    const response = await apiClient.put<Review>(`/api/v1/reviews/${id}`, data);
    return response.data;
  },
};

// File Services
export const fileService = {
  upload: async (file: File, type?: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    if (type) formData.append('type', type);
    
    const response = await apiClient.post<string>('/api/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadMultiple: async (files: File[], type?: string): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (type) formData.append('type', type);
    
    const response = await apiClient.post<string[]>('/api/files/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
}; 