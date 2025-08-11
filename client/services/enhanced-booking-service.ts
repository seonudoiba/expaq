import { apiClient } from '@/lib/api/client';
import { Booking, CreateBookingRequest } from '@/types';

export const enhancedBookingService = {
  /**
   * Create a new booking
   */
  create: async (bookingData: CreateBookingRequest): Promise<Booking> => {
    try {
      const response = await apiClient.post<Booking>("/api/bookings", bookingData);
      console.log('Booking created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  /**
   * Get all bookings for current user
   */
  getUserBookings: async (): Promise<Booking[]> => {
    try {
      const response = await apiClient.get<Booking[]>('/api/bookings/user');
      console.log('User bookings response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  },

  /**
   * Get upcoming bookings for current user
   */
  getUpcomingBookings: async (): Promise<Booking[]> => {
    try {
      const response = await apiClient.get<Booking[]>('/api/bookings/upcoming');
      console.log('Upcoming bookings response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      return [];
    }
  },

  /**
   * Get past bookings for current user
   */
  getPastBookings: async (): Promise<Booking[]> => {
    try {
      const response = await apiClient.get<Booking[]>('/api/bookings/past');
      console.log('Past bookings response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching past bookings:', error);
      return [];
    }
  },

  /**
   * Get specific booking by ID
   */
  getBookingById: async (bookingId: string): Promise<Booking> => {
    try {
      const response = await apiClient.get<Booking>(`/api/bookings/${bookingId}`);
      console.log('Booking details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  },

  /**
   * Cancel a booking
   */
  cancelBooking: async (bookingId: string, reason?: string): Promise<void> => {
    try {
      await apiClient.post(`/api/bookings/${bookingId}/cancel`, { reason });
      console.log('Booking cancelled:', bookingId);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  /**
   * Confirm a booking (for hosts)
   */
  confirmBooking: async (bookingId: string): Promise<void> => {
    try {
      await apiClient.post(`/api/bookings/${bookingId}/confirm`);
      console.log('Booking confirmed:', bookingId);
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw error;
    }
  },

  /**
   * Get bookings for host's activities
   */
  getHostBookings: async (activityId?: string): Promise<Booking[]> => {
    try {
      const url = activityId ? `/api/bookings/host/activity/${activityId}` : '/api/bookings/host';
      const response = await apiClient.get<Booking[]>(url);
      console.log('Host bookings response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching host bookings:', error);
      return [];
    }
  },

  /**
   * Get bookings by status
   */
  getBookingsByStatus: async (status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'): Promise<Booking[]> => {
    try {
      const response = await apiClient.get<Booking[]>(`/api/bookings/status/${status}`);
      console.log(`${status} bookings response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${status} bookings:`, error);
      return [];
    }
  },

  /**
   * Update booking payment information
   */
  updateBookingPayment: async (bookingId: string, paymentId: string, paymentStatus: string): Promise<void> => {
    try {
      await apiClient.post(`/api/bookings/${bookingId}/payment`, {
        paymentId,
        paymentStatus
      });
      console.log('Booking payment updated:', bookingId);
    } catch (error) {
      console.error('Error updating booking payment:', error);
      throw error;
    }
  },

  /**
   * Get booking statistics for admin/host
   */
  getBookingStats: async (): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  }> => {
    try {
      const response = await apiClient.get('/api/bookings/stats');
      console.log('Booking stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
      };
    }
  },
};

export default enhancedBookingService;