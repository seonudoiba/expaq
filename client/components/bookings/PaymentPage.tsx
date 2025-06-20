"use client";

import { useBookingDetails, useInitiatePayment } from '@/hooks/use-bookings';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

interface PaymentPageProps {
  bookingId: string;
}

export default function PaymentPage({ bookingId }: PaymentPageProps) {
  const { data: booking, isLoading } = useBookingDetails(bookingId);
  const { mutate: initiatePayment, isLoading: isPaymentLoading } = useInitiatePayment();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-1/4" />
        </div>
      </Card>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">Booking not found</h3>
        <p className="text-gray-600 mb-4">Unable to process payment for this booking.</p>
        <Button asChild>
          <Link href="/bookings">Back to My Bookings</Link>
        </Button>
      </div>
    );
  }

  if (booking.status === 'COMPLETED') {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-green-700">This booking has already been paid for.</p>
          </div>
          <Button asChild>
            <Link href={`/bookings/${bookingId}`}>View Booking Details</Link>
          </Button>
        </div>
      </Card>
    );
  }

  const handlePayment = () => {
    initiatePayment(bookingId);
  };

  return (
    <>
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href={`/bookings/${bookingId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Booking
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Complete Payment</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="p-6 md:col-span-3">
          <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
          <div className="space-y-4">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 border rounded-lg text-left flex items-center gap-3 ${
                paymentMethod === 'card' ? 'border-primary ring-2 ring-primary/10' : ''
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-medium">Credit or Debit Card</p>
                <p className="text-sm text-gray-500">Pay securely with your card</p>
              </div>
              <div className="flex gap-2">
                <Image src="/visa.svg" alt="Visa" fill />
                <Image src="/mastercard.svg" alt="Mastercard" fill/>
                <Image src="/amex.svg" alt="American Express"/>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('paypal')}
              className={`w-full p-4 border rounded-lg text-left flex items-center gap-3 ${
                paymentMethod === 'paypal' ? 'border-primary ring-2 ring-primary/10' : ''
              }`}
            >
              <Image src="/paypal.svg" alt="PayPal" className="h-5" fill/>
              <div className="flex-1">
                <p className="font-medium">PayPal</p>
                <p className="text-sm text-gray-500">Pay with your PayPal account</p>
              </div>
            </button>
          </div>

          <div className="mt-6">
            <Button
              onClick={handlePayment}
              className="w-full"
              size="lg"
              disabled={isPaymentLoading}
            >
              {isPaymentLoading ? (
                'Processing...'
              ) : (
                <>
                  Pay ${booking.totalPrice}
                  <Lock className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-1">
            <Lock className="w-4 h-4" />
            Secure payment powered by Stripe
          </p>
        </Card>

        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Activity Price</span>
              <span>${booking.activity.price * booking.participants}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>${Math.round(booking.totalPrice * 0.1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>${Math.round(booking.totalPrice * 0.08)}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>${booking.totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="font-semibold">Booking Details</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Activity: {booking.activity.title}</p>
              <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
              <p>Time: {booking.time}</p>
              <p>Guests: {booking.participants}</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
