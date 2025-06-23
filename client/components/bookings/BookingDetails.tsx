/* eslint-disable react/no-unescaped-entities */
"use client";

import { useBookingDetails, useInitiatePayment } from "@/hooks/use-bookings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Receipt,
  CreditCard,
  Star,
} from "lucide-react";
import { formatBookingDate } from "@/lib/utils/date-utils";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import {
  getSafeActivityImage,
  getSafeActivityTitle,
  getSafeParticipants,
  getSafeTime,
  isBookingCompleted,
} from "@/lib/utils/booking-utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReviewForm from "@/components/bookings/ReviewForm";

interface BookingDetailsProps {
  bookingId: string;
}

const BookingDetailsSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-1/3" />
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex gap-6">
          <Skeleton className="w-96 h-64 rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

export default function BookingDetails({ bookingId }: BookingDetailsProps) {
  const { toast } = useToast();
  const { data: booking, isLoading, error } = useBookingDetails(bookingId);
  const { mutate: initiatePayment, isPending: isPaymentLoading } =
    useInitiatePayment();
  // Add state for review dialog
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  if (error || !booking) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">Booking not found</h3>
        <p className="text-gray-600 mb-4">
          The booking you're looking for doesn't exist or you don't have access
          to it.
        </p>
        <Button asChild>
          <Link href="/bookings">Back to My Bookings</Link>
        </Button>
      </div>
    );
  }
  const handlePayment = () => {
    // Default to PAYSTACK as the payment method
    initiatePayment(bookingId);

    // Show a loading toast while payment is being initiated
    toast({
      title: "Initiating Payment",
      description: "You'll be redirected to the payment gateway shortly...",
    });
  };

  // Handle review submission success
  const handleReviewSuccess = () => {
    setIsReviewDialogOpen(false);
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });
  }; // Additional helper for status check
  const isCompleted = (
    booking: { status?: string } | null | undefined
  ): boolean => {
    // Direct string comparison
    if (booking && booking.status === "COMPLETED") {
      return true;
    }

    // We know the utility function can handle this type
    // but TypeScript doesn't, so we'll cast it
    return isBookingCompleted(booking as unknown as import("@/types").Booking);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500";
      case "COMPLETED":
        return "bg-green-600"; // Darker green for completed bookings
      case "PENDING":
        return "bg-yellow-500";
      case "CANCELLED":
        return "bg-red-500";
      case "PENDING_PAYMENT":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Booking Details</h1>
        <Badge className={getStatusColor(booking.status)}>
          {booking.status}
        </Badge>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex gap-6">
            <div className="w-96 h-64 relative rounded-lg overflow-hidden">
              <Image
                src={getSafeActivityImage(booking)}
                alt={getSafeActivityTitle(booking)}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-semibold">
                {getSafeActivityTitle(booking)}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>
                    {formatBookingDate(booking.date || booking.startDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span>{getSafeTime(booking)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span>{getSafeParticipants(booking)} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>Meeting point details provided after booking</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-gray-500" />
                  <span>
                    Activity Price ({booking.numberOfGuests} × $
                    {booking.totalPrice / booking.numberOfGuests})
                  </span>
                </div>
                <span>${booking.totalPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Service Fee</span>
                <span>${Math.round(booking.totalPrice * 0.1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Taxes</span>
                <span>${Math.round(booking.totalPrice * 0.08)}</span>
              </div>
              <div className="flex justify-between items-center font-semibold pt-2 border-t">
                <span>Total Amount</span>
                <span>${booking.totalPrice}</span>
              </div>
            </div>
            {booking.status === "PENDING" && (
              <div className="flex justify-end space-x-4 pt-4">
                <Button asChild variant="outline">
                  <Link href="/bookings">Back to Bookings</Link>
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isPaymentLoading}
                  className="min-w-[150px]"
                >
                  {isPaymentLoading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Now
                    </>
                  )}
                </Button>
              </div>
            )}{" "}
            {isCompleted(booking) && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <Badge className="bg-green-500">Paid</Badge>
                  <span>Payment completed successfully</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
      {/* Reviews Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Reviews</h3> {/* Debug info */}
          {/* <div className="text-xs text-gray-500">
            Status: "{booking.status}" | isCompleted helper:{" "}
            {isCompleted(booking) ? "true" : "false"} | isBookingCompleted:{" "}
            {isBookingCompleted(booking) ? "true" : "false"} | Direct check:{" "}
            {booking.status === "COMPLETED" ? "true" : "false"}
          </div> */}
          {isCompleted(booking) && (
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Leave a Review
            </Button>
          )}
        </div>
        <div className="mt-4">
          {/* Placeholder for reviews - will be populated from API once reviews are implemented */}
          <p className="text-gray-500 text-center py-4">
            No reviews yet. Be the first to leave a review!
          </p>
        </div>
      </Card>
      {/* Leave a Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Review Your Experience
            </DialogTitle>
          </DialogHeader>
          {booking && (
            <ReviewForm booking={booking} onSuccess={handleReviewSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
