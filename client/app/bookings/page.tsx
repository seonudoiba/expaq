import { Metadata } from 'next';
import BookingsList from '@/components/bookings/BookingsList';

export const metadata: Metadata = {
  title: 'My Bookings | Expaq',
  description: 'View and manage your activity bookings',
};

export default function BookingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      <BookingsList />
    </div>
  );
}
