import { api } from './api';

export interface CreateBookingDTO {
  activityId: string;
  date: string;
  time: string;
  numberOfGuests: number;
}

export interface Booking {
  id: string;
  activityId: string;
  userId: string;
  date: string;
  time: string;
  numberOfGuests: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'UNPAID' | 'PAID';
  createdAt: string;
  activity: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
}

export const bookingService = {
  createBooking: async (data: CreateBookingDTO) => {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get<Booking[]>('/bookings/user');
    return response.data;
  },

  getBookingById: async (id: string) => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  initiatePayment: async (bookingId: string) => {
    const response = await api.post(`/payments/initiate/${bookingId}`);
    return response.data;
  }
};
