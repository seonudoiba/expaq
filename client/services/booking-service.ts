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
    // const { activityId, date, time, numberOfGuests } = data;
    
    // // Convert the date and time to a full datetime string
    // const startTime = new Date(`${date} ${time}`);
    
    // // Calculate end time (assuming end time is based on activity duration)
    // // For now, we'll just add 2 hours as a default
    // const endTime = new Date(startTime);
    // endTime.setHours(endTime.getHours() + 2);
    
    // // Format the dates as required by the API
    // const formattedStartTime = startTime.toISOString().slice(0, 19).replace('T', ' ');
    // const formattedEndTime = endTime.toISOString().slice(0, 19).replace('T', ' ');
    
    // // Prepare the request body according to the API expectations
    // const requestBody = {
    //   activityId,
    //   startTime: formattedStartTime,
    //   endTime: formattedEndTime,
    //   numberOfGuests: numberOfGuests.toString()
    // };
    
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
    
    // For consistency with the useInitiatePayment hook that expects a paymentUrl
    // Map authorizationUrl to paymentUrl if it exists
    const responseData = response.data;
    if (responseData.authorizationUrl && !responseData.paymentUrl) {
      responseData.paymentUrl = responseData.authorizationUrl;
    }
    return responseData;
  }
  // //   return responseData;
  //  initiatePayment: async (bookingId: string, paymentMethod: string = 'PAYSTACK'): Promise<PaymentResponse> => {
  //   // Based on the error, the server expects bookingId as a query parameter
  //   const response = await apiClient.get<PaymentResponse>(
  //     `/api/payments/initialize?bookingId=${bookingId}&paymentMethod=${paymentMethod}`
  //   );
    
  //   // Log the response for debugging
  //   console.log("Payment initiation response:", response.data);
    
  //   // For consistency with the useInitiatePayment hook that expects a paymentUrl
  //   // Map authorizationUrl to paymentUrl if it exists
  //   const responseData = response.data;
  //   if (responseData.authorizationUrl && !responseData.paymentUrl) {
  //     responseData.paymentUrl = responseData.authorizationUrl;
  //   }
    
  //   return responseData;
  // },
};
