import { Metadata } from 'next';
import BookingDetails from '@/components/bookings/BookingDetails';

export const metadata: Metadata = {
  title: 'Booking Details | Expaq',
  description: 'View your booking details and manage your reservation',
};

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <BookingDetails bookingId={params.id} />
    </div>
  );
}
