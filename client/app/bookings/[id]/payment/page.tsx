import { Metadata } from 'next';
import PaymentPage from '@/components/bookings/PaymentPage';
import { use } from "react";

export const metadata: Metadata = {
  title: 'Payment | Expaq',
  description: 'Complete your booking payment',
};



export default function BookingPaymentPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = use(params);

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <PaymentPage bookingId={id} />
    </div>
  );
}
