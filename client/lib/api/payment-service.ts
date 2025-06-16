import { apiClient } from './client';
// /api/payments/analytics/host/{hostid}

import type {
PaymentAnalytics
} from '@/types/payments';

// Add an interceptor to include auth details with every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage'); // Replace with your auth token retrieval logic
  let tokenObject = null;
  if (token) {
    try {
      tokenObject = JSON.parse(token);
      tokenObject = tokenObject.state.token; 
    } catch (error) {
      console.error('Failed to parse token:', error);
    }
  }
  if (tokenObject) {
    config.headers.Authorization = `Bearer ${tokenObject}`;
  }
  return config;
});

// Payment Analytics Services
export const PaymentAnalyticsService = {

//   getCurrentUser: async (): Promise<User> => {
//     const response = await apiClient.get<User>('/api/auth/me');
//     return response.data;
//   },  
  getHostPaymentAnalytics: async (hostId: string): Promise<PaymentAnalytics> => {
    const response = await apiClient.get<PaymentAnalytics>(`/api/payments/analytics/host/${hostId}`);
    return response.data;
  },


};