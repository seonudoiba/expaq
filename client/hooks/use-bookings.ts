// "use client";

// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { bookingService } from '@/services/booking';
// import { useToast } from '@/components/ui/use-toast';
// import { CreateBookingRequest } from '@/types';

// export const useCreateBooking = () => {
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: CreateBookingRequest) => bookingService.createBooking(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['userBookings'] });
//       toast({
//         title: 'Booking Created',
//         description: 'Your booking has been created successfully.',
//       });
//     },
//     onError: (error: Error) => {
//       toast({
//         title: 'Error',
//         description: error.message || 'Failed to create booking',
//         variant: 'destructive',
//       });
//     },
//   });
// };

// export const useUserBookings = () => {
//   return useQuery({
//     queryKey: ['userBookings'],
//     queryFn: bookingService.getUserBookings,
//   });
// };

// export const useBookingDetails = (bookingId: string) => {
//   return useQuery({
//     queryKey: ['booking', bookingId],
//     queryFn: () => bookingService.getBookingById(bookingId),
//     enabled: !!bookingId,
//   });
// };

// export const useInitiatePayment = () => {
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (bookingId: string) => bookingService.initiatePayment(bookingId),
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ['userBookings'] });
//       // Redirect to payment URL if provided by the backend
//       if (data.paymentUrl) {
//         window.location.href = data.paymentUrl;
//       }
//     },
//     onError: (error: Error) => {
//       toast({
//         title: 'Payment Error',
//         description: error.message || 'Failed to initiate payment',
//         variant: 'destructive',
//       });
//     },
//   });
// };
