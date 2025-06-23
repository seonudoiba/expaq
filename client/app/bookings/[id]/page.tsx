import { Metadata } from 'next';
import BookingDetails from '@/components/bookings/BookingDetails';
import { use } from "react";

export const metadata: Metadata = {
  title: 'Booking Details | Expaq',
  description: 'View your booking details and manage your reservation',
};

export default function BookingDetailsPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = use(params);
  return (
    <div className="container mx-auto py-8">
      <BookingDetails bookingId={id} />
    </div>
  );
}
