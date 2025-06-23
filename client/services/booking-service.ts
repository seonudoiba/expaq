import { apiClient } from '@/lib/api/client';
import { Booking, CreateBookingRequest } from '@/types';

export interface CreateBookingDTO {
  activityId: string;
  date: string;
  time: string;
  numberOfGuests: number;
}

export interface PaymentResponse {
  paymentIntentId?: string;
  clientSecret?: string | null;
  redirectUrl?: string | null;
  status?: string;
  message?: string | null;
  access_code?: string | null;
  provider?: 'PAYSTACK' | 'STRIPE';
  authorizationUrl?: string | null; // This is equivalent to paymentUrl for Paystack
  accessCode?: string | null;
  paymentUrl?: string; // We'll map authorizationUrl to this for consistency
}

export const bookingService = {
  createBooking: async (data: CreateBookingRequest): Promise<Booking> => {
    const response = await apiClient.post<Booking>('/api/bookings', data);
    return response.data;
  },
    getUserBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get<Booking[]>(`/api/bookings/my-bookings`);
    console.log("API Response bookings:", response.data);
    return response.data;
  },
    getBookingById: async (bookingId: string): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/api/bookings/${bookingId}`);
    console.log("API Response booking detail:", response.data);
    return response.data;
  },
  
  cancelBooking: async (bookingId: string): Promise<Booking> => {
    const response = await apiClient.patch<Booking>(`/api/bookings/${bookingId}/cancel`);
    return response.data;
  },  
    
  initiatePayment: async (bookingId: string, paymentMethod: string = 'PAYSTACK'): Promise<PaymentResponse> => {
    // Based on the error message, the server expects bookingId as a GET query parameter
    const response = await apiClient.post<PaymentResponse>(
      `/api/payments/initialize`,{bookingId, paymentMethod} // Sending bookingId and paymentMethod in the request body
    );
    
    // Log the response for debugging
    console.log("Payment initiation response:", response.data);
    
    const responseData = response.data;
    if (responseData.authorizationUrl && !responseData.paymentUrl) {
      responseData.paymentUrl = responseData.authorizationUrl;
    }
    return responseData;
  },  verifyPayment: async (paymentId: string): Promise<PaymentResponse> => {
    const response = await apiClient.put<PaymentResponse>(`/api/payments/${paymentId}/status?status=COMPLETED`);
    console.log("Payment verification response:", response.data);
    return response.data;
  },
  verifyPaystackPayment: async (trxref: string, reference: string): Promise<PaymentResponse> => {
    const response = await apiClient.get<PaymentResponse>(`/api/payments/verify?trxref=${trxref}&reference=${reference}`);
    console.log("Paystack verification response:", response.data);
    return response.data;
  }
};
