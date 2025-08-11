import { apiClient } from '@/lib/api/client';

export interface SubscriptionPlan {
  type: 'BASIC' | 'PREMIUM' | 'PROFESSIONAL' | 'ENTERPRISE';
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: {
    maxActivities: number;
    maxPhotos: number;
    commissionRate: number;
    featuredListings: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
  };
}

export interface Subscription {
  id: string;
  planType: 'BASIC' | 'PREMIUM' | 'PROFESSIONAL' | 'ENTERPRISE';
  status: 'PENDING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED' | 'SUSPENDED';
  price: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  autoRenew: boolean;
  createdAt: string;
}

export interface SubscriptionLimits {
  maxActivities: number;
  maxPhotosPerActivity: number;
  commissionRate: number;
  hasAdvancedAnalytics: boolean;
  hasPrioritySupport: boolean;
  currentActivities: number;
}

export interface SubscriptionAnalytics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  pastDueSubscriptions: number;
  totalActiveRevenue: number;
  monthlyRecurringRevenue: number;
  yearlyRecurringRevenue: number;
  planDistribution: Record<string, number>;
}

export const subscriptionService = {
  /**
   * Get all available subscription plans
   */
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      const response = await apiClient.get<SubscriptionPlan[]>('/api/subscriptions/plans');
      console.log('Subscription plans:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }
  },

  /**
   * Get current user's active subscription
   */
  getCurrentSubscription: async (): Promise<Subscription | null> => {
    try {
      const response = await apiClient.get<Subscription>('/api/subscriptions/current');
      console.log('Current subscription:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      return null;
    }
  },

  /**
   * Get user's subscription history
   */
  getSubscriptionHistory: async (): Promise<Subscription[]> => {
    try {
      const response = await apiClient.get<Subscription[]>('/api/subscriptions/history');
      console.log('Subscription history:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription history:', error);
      return [];
    }
  },

  /**
   * Get user's subscription limits and current usage
   */
  getSubscriptionLimits: async (): Promise<SubscriptionLimits> => {
    try {
      const response = await apiClient.get<SubscriptionLimits>('/api/subscriptions/limits');
      console.log('Subscription limits:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription limits:', error);
      return {
        maxActivities: 5,
        maxPhotosPerActivity: 5,
        commissionRate: 0.10,
        hasAdvancedAnalytics: false,
        hasPrioritySupport: false,
        currentActivities: 0,
      };
    }
  },

  /**
   * Subscribe to a premium plan
   */
  subscribe: async (planType: string, billingCycle: string, paymentMethodId?: string): Promise<{ success: boolean; message: string; subscriptionId?: string }> => {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; subscriptionId?: string }>('/api/subscriptions/subscribe', {
        planType,
        billingCycle,
        paymentMethodId,
      });
      console.log('Subscription created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      return { success: false, message: 'Failed to create subscription' };
    }
  },

  /**
   * Change subscription plan
   */
  changePlan: async (planType: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('/api/subscriptions/change-plan', {
        planType,
      });
      console.log('Plan changed:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error changing plan:', error);
      return { success: false, message: 'Failed to change plan' };
    }
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async (reason?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('/api/subscriptions/cancel', {
        reason: reason || 'User requested',
      });
      console.log('Subscription cancelled:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return { success: false, message: 'Failed to cancel subscription' };
    }
  },

  /**
   * Reactivate cancelled subscription
   */
  reactivateSubscription: async (paymentMethodId?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('/api/subscriptions/reactivate', {
        paymentMethodId,
      });
      console.log('Subscription reactivated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      return { success: false, message: 'Failed to reactivate subscription' };
    }
  },

  /**
   * Check if user has access to a specific feature
   */
  checkFeatureAccess: async (featureName: string): Promise<{ feature: string; hasAccess: boolean }> => {
    try {
      const response = await apiClient.get<{ feature: string; hasAccess: boolean }>(`/api/subscriptions/feature-access/${featureName}`);
      console.log('Feature access check:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return { feature: featureName, hasAccess: false };
    }
  },

  /**
   * Check if user can create more activities
   */
  canCreateActivity: async (): Promise<{ canCreate: boolean; currentActivities: number; maxActivities: number }> => {
    try {
      const response = await apiClient.get<{ canCreate: boolean; currentActivities: number; maxActivities: number }>('/api/subscriptions/can-create-activity');
      console.log('Activity creation check:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking activity creation limit:', error);
      return { canCreate: false, currentActivities: 0, maxActivities: 0 };
    }
  },

  /**
   * Check if user can upload specified number of photos
   */
  canUploadPhotos: async (photoCount: number): Promise<{ canUpload: boolean; requestedPhotos: number; maxPhotosPerActivity: number }> => {
    try {
      const response = await apiClient.post<{ canUpload: boolean; requestedPhotos: number; maxPhotosPerActivity: number }>('/api/subscriptions/can-upload-photos', {
        photoCount,
      });
      console.log('Photo upload check:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking photo upload limit:', error);
      return { canUpload: false, requestedPhotos: photoCount, maxPhotosPerActivity: 0 };
    }
  },

  /**
   * Generate invoice for subscription
   */
  generateInvoice: async (subscriptionId: string): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/api/subscriptions/invoice/${subscriptionId}`);
      console.log('Invoice generated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error generating invoice:', error);
      return null;
    }
  },

  // Admin functions
  /**
   * Get subscription analytics (admin only)
   */
  getSubscriptionAnalytics: async (): Promise<SubscriptionAnalytics> => {
    try {
      const response = await apiClient.get<SubscriptionAnalytics>('/api/subscriptions/admin/analytics');
      console.log('Subscription analytics:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription analytics:', error);
      return {
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        cancelledSubscriptions: 0,
        pastDueSubscriptions: 0,
        totalActiveRevenue: 0,
        monthlyRecurringRevenue: 0,
        yearlyRecurringRevenue: 0,
        planDistribution: {},
      };
    }
  },

  /**
   * Get revenue analytics (admin only)
   */
  getRevenueAnalytics: async (period = 'month'): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/api/subscriptions/admin/revenue-analytics?period=${period}`);
      console.log('Revenue analytics:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      return {};
    }
  },

  /**
   * Get churn analytics (admin only)
   */
  getChurnAnalytics: async (): Promise<any> => {
    try {
      const response = await apiClient.get<any>('/api/subscriptions/admin/churn-analytics');
      console.log('Churn analytics:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching churn analytics:', error);
      return {};
    }
  },

  /**
   * Process all pending billing (admin only)
   */
  processAllBilling: async (): Promise<{ success: boolean; message?: string; result?: any }> => {
    try {
      const response = await apiClient.post<any>('/api/subscriptions/admin/process-billing');
      console.log('Billing processed:', response.data);
      return { success: true, result: response.data };
    } catch (error) {
      console.error('Error processing billing:', error);
      return { success: false, message: 'Failed to process billing' };
    }
  },

  /**
   * Expire overdue subscriptions (admin only)
   */
  expireOverdueSubscriptions: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post<string>('/api/subscriptions/admin/expire-overdue');
      console.log('Overdue subscriptions expired:', response.data);
      return { success: true, message: response.data };
    } catch (error) {
      console.error('Error expiring overdue subscriptions:', error);
      return { success: false, message: 'Failed to expire overdue subscriptions' };
    }
  },

  /**
   * Send billing reminders (admin only)
   */
  sendBillingReminders: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post<string>('/api/subscriptions/admin/send-reminders');
      console.log('Billing reminders sent:', response.data);
      return { success: true, message: response.data };
    } catch (error) {
      console.error('Error sending billing reminders:', error);
      return { success: false, message: 'Failed to send billing reminders' };
    }
  },

  /**
   * Get feature matrix for all plans (admin only)
   */
  getFeatureMatrix: async (): Promise<Record<string, Record<string, any>>> => {
    try {
      const response = await apiClient.get<Record<string, Record<string, any>>>('/api/subscriptions/admin/feature-matrix');
      console.log('Feature matrix:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching feature matrix:', error);
      return {};
    }
  },
};

export default subscriptionService;