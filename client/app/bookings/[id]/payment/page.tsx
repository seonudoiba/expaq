import { Metadata } from 'next';
import PaymentPage from '@/components/bookings/PaymentPage';

export const metadata: Metadata = {
  title: 'Payment | Expaq',
  description: 'Complete your booking payment',
};

export default function BookingPaymentPage({ params }: { params: { id: string } }) {
  return (
    <div className="container max-w-3xl mx-auto py-8">
      <PaymentPage bookingId={params.id} />
    </div>
  );
}
