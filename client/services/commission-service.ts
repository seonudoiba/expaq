import { apiClient } from '@/lib/api/client';

export interface Commission {
  id: string;
  bookingAmount: number;
  commissionRate: number;
  commissionAmount: number;
  hostEarnings: number;
  status: 'PENDING' | 'PROCESSED' | 'PAID_OUT' | 'CANCELLED' | 'DISPUTED' | 'ON_HOLD';
  processedAt?: string;
  paidOutAt?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  paymentReference?: string;
  booking: {
    id: string;
    totalAmount: number;
    bookingDate: string;
  };
  activity: {
    id: string;
    title: string;
    location: string;
  };
}

export interface CommissionSummary {
  totalEarnings: number;
  pendingEarnings: number;
  paidOutEarnings: number;
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  recentEarnings: number;
}

export interface CommissionAnalytics {
  totalCommissions: number;
  totalCommissionAmount: number;
  totalHostEarnings: number;
  averageCommissionRate: number;
  monthlyData?: Array<{
    year: number;
    month: number;
    totalCommission: number;
    totalHostEarnings: number;
    count: number;
  }>;
  topEarningHosts?: Array<{
    host: any;
    totalEarnings: number;
    commissionCount: number;
  }>;
}

export const commissionService = {
  /**
   * Get host commissions with pagination
   */
  getHostCommissions: async (page = 0, size = 20, status?: string): Promise<{ content: Commission[], totalElements: number }> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });
      
      if (status) {
        params.append('status', status);
      }
      
      const response = await apiClient.get<{ content: Commission[], totalElements: number }>(`/api/commissions/host?${params}`);
      console.log('Host commissions response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching host commissions:', error);
      return { content: [], totalElements: 0 };
    }
  },

  /**
   * Get host commission summary
   */
  getHostCommissionSummary: async (): Promise<CommissionSummary> => {
    try {
      const response = await apiClient.get<CommissionSummary>('/api/commissions/host/summary');
      console.log('Host commission summary:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching host commission summary:', error);
      return {
        totalEarnings: 0,
        pendingEarnings: 0,
        paidOutEarnings: 0,
        totalCommissions: 0,
        pendingCommissions: 0,
        paidCommissions: 0,
        recentEarnings: 0,
      };
    }
  },

  /**
   * Get host earnings breakdown
   */
  getHostEarnings: async (period = 'month'): Promise<any> => {
    try {
      const response = await apiClient.get<any>(`/api/commissions/host/earnings?period=${period}`);
      console.log('Host earnings:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching host earnings:', error);
      return {};
    }
  },

  /**
   * Create withdrawal request
   */
  createWithdrawalRequest: async (amount: number, method: string, details: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<string>('/api/commissions/host/withdraw-request', {
        amount,
        method,
        details,
      });
      console.log('Withdrawal request created:', response.data);
      return true;
    } catch (error) {
      console.error('Error creating withdrawal request:', error);
      return false;
    }
  },

  /**
   * Get host withdrawal history
   */
  getHostWithdrawals: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get<any[]>('/api/commissions/host/withdrawals');
      console.log('Host withdrawals:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching host withdrawals:', error);
      return [];
    }
  },

  /**
   * Get current commission rates
   */
  getCommissionRates: async (): Promise<Record<string, number>> => {
    try {
      const response = await apiClient.get<Record<string, number>>('/api/commissions/rates');
      console.log('Commission rates:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching commission rates:', error);
      return {};
    }
  },

  // Admin-only functions
  /**
   * Get all commissions (admin only)
   */
  getAllCommissions: async (page = 0, size = 20, status?: string, hostId?: string): Promise<{ content: Commission[], totalElements: number }> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });
      
      if (status) {
        params.append('status', status);
      }
      
      if (hostId) {
        params.append('hostId', hostId);
      }
      
      const response = await apiClient.get<{ content: Commission[], totalElements: number }>(`/api/commissions/admin/all?${params}`);
      console.log('All commissions response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all commissions:', error);
      return { content: [], totalElements: 0 };
    }
  },

  /**
   * Get platform commission summary (admin only)
   */
  getPlatformCommissionSummary: async (period?: string): Promise<any> => {
    try {
      const params = period ? `?period=${period}` : '';
      const response = await apiClient.get<any>(`/api/commissions/admin/summary${params}`);
      console.log('Platform commission summary:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching platform commission summary:', error);
      return {};
    }
  },

  /**
   * Process commission for booking (admin only)
   */
  processCommission: async (bookingId: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<string>(`/api/commissions/process/${bookingId}`);
      console.log('Commission processed:', response.data);
      return true;
    } catch (error) {
      console.error('Error processing commission:', error);
      return false;
    }
  },

  /**
   * Mark commission as paid out (admin only)
   */
  markAsPaidOut: async (commissionId: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<string>(`/api/commissions/admin/payout/${commissionId}`);
      console.log('Commission marked as paid out:', response.data);
      return true;
    } catch (error) {
      console.error('Error marking commission as paid out:', error);
      return false;
    }
  },

  /**
   * Process bulk payout (admin only)
   */
  processBulkPayout: async (commissionIds: string[]): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post<string>('/api/commissions/admin/bulk-payout', commissionIds);
      console.log('Bulk payout processed:', response.data);
      return { success: true, message: response.data };
    } catch (error) {
      console.error('Error processing bulk payout:', error);
      return { success: false, message: 'Failed to process bulk payout' };
    }
  },

  /**
   * Update commission rates (admin only)
   */
  updateCommissionRates: async (rates: Record<string, number>): Promise<boolean> => {
    try {
      const response = await apiClient.post<string>('/api/commissions/admin/rates', rates);
      console.log('Commission rates updated:', response.data);
      return true;
    } catch (error) {
      console.error('Error updating commission rates:', error);
      return false;
    }
  },

  /**
   * Get commission analytics (admin only)
   */
  getCommissionAnalytics: async (period?: string, groupBy?: string): Promise<CommissionAnalytics> => {
    try {
      const params = new URLSearchParams();
      if (period) params.append('period', period);
      if (groupBy) params.append('groupBy', groupBy);
      
      const response = await apiClient.get<CommissionAnalytics>(`/api/commissions/admin/analytics?${params}`);
      console.log('Commission analytics:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching commission analytics:', error);
      return {
        totalCommissions: 0,
        totalCommissionAmount: 0,
        totalHostEarnings: 0,
        averageCommissionRate: 0,
      };
    }
  },
};

export default commissionService;