"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import { bookingService } from "@/services/booking-service";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function PaymentVerificationPage() {
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get params from URL
  const trxref = searchParams.get("trxref") || "";
  const reference = searchParams.get("reference") || "";
  const paymentId = searchParams.get("paymentId") || "";
  const bookingId = searchParams.get("bookingId") || "";

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // First, verify with Paystack using the transaction reference
        if (!trxref || !reference) {
          throw new Error("Missing transaction reference parameters");
        }

        // Call our backend to verify the payment with Paystack
        const paystackVerification = await bookingService.verifyPaystackPayment(trxref, reference);
        
        if (!paystackVerification || paystackVerification.status !== "COMPLETED") {
          throw new Error("Payment verification with payment provider failed");
        }

        // Now update our internal payment status in the database
        if (paymentId) {
          await bookingService.verifyPayment(paymentId);
        } else {
          console.warn("PaymentId not provided, skipping internal status update");
        }

        setIsSuccess(true);
        toast({
          title: "Payment Verified",
          description: "Your payment has been successfully verified.",
        });      } catch (error: unknown) {
        console.error("Payment verification failed:", error);
        let errorMessage = "Payment verification failed";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
        toast({          title: "Verification Failed",
          description: errorMessage || "There was a problem verifying your payment",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [trxref, reference, paymentId, toast]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-6">Verifying Payment</h1>
          <div className="flex justify-center my-8">
            <LoadingSpinner className="h-10 w-10 text-primary" />
          </div>
          <p className="text-gray-600">
            Please wait while we verify your payment with the payment provider...
          </p>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your payment has been successfully verified. Your booking is now confirmed.
          </p>
          <Button asChild size="lg" className="w-full">
            <Link href={`/bookings/${bookingId}`}>View Booking Details</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
        <p className="text-gray-600 mb-6">
          {error || "There was a problem verifying your payment. Please try again or contact support."}
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href={`/bookings/${bookingId}`}>View Booking</Link>
          </Button>
          <Button asChild size="lg" className="w-full">
            <Link href={`/bookings/${bookingId}/pay`}>Try Again</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
