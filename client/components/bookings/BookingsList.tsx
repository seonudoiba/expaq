"use client";

// import { useUserBookings } from '@/hooks/use-bookings';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/services';

const BookingCard = ({ booking }: { booking: any }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        <div className="w-32 h-32 relative rounded-lg overflow-hidden">
          <Image
            src={booking.activity.mediaUrls[0]}
            alt={booking.activity.title}
            fill
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{booking.activity.title}</h3>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status}
            </Badge>
          </div>

          <div className="flex gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(booking.date), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{booking.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{booking.numberOfGuests} guests</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-lg font-semibold">
              ${booking.totalAmount}
            </div>
            <div className="space-x-2">
              {booking.paymentStatus === 'UNPAID' && (
                <Button asChild variant="default">
                  <Link href={`/bookings/${booking.id}/payment`}>
                    Pay Now
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href={`/bookings/${booking.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const BookingsListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="p-6">
        <div className="flex gap-4">
          <Skeleton className="w-32 h-32 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-6 w-20" />
              <div className="space-x-2">
                <Skeleton className="h-9 w-24 inline-block" />
                <Skeleton className="h-9 w-24 inline-block" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default function BookingsList() {
  // const { data: bookings, isLoading, error } = useUserBookings();

    const {
      data: bookings,
      error,
      isLoading,
    } = useQuery({
      queryKey: ["bookings"],
      queryFn: () => bookingService.getAllBookings(),
    });

  if (isLoading) {
    return <BookingsListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load bookings. Please try again later.</p>
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
        <p className="text-gray-600 mb-4">Start exploring activities and book your next adventure!</p>
        <Button asChild>
          <Link href="/activities">Browse Activities</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
