import { Metadata } from 'next';
import PaymentPage from '@/components/bookings/PaymentPage';

export const metadata: Metadata = {
  title: 'Payment | Expaq',
  description: 'Complete your booking payment',
};

interface BookingPaymentPageProps {
  params: {
    id: string;
  };
}

export default function BookingPaymentPage({ params }: BookingPaymentPageProps) {
  return (
    <div className="container max-w-3xl mx-auto py-8">
      <PaymentPage bookingId={params.id} />
    </div>
  );
}
