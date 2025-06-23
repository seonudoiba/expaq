"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { isBookingCompleted } from "@/lib/utils/booking-utils";
import { reviewService } from "@/services/services";
import { CreateReviewRequest } from "@/types";
import StarRating from "@/components/ui/star-rating";
import { Booking } from "@/types";
import { AlertCircle } from "lucide-react";

interface ReviewFormProps {
  booking: Booking;
  onSuccess?: () => void;
}

export default function ReviewForm({ booking, onSuccess }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<{ comment: string; photos: string }>();

  // Check if the booking is completed
  const bookingCompleted = isBookingCompleted(booking);
  
  const onSubmit = useCallback(
    async (formData: { comment: string; photos: string }) => {
      if (rating === 0) {
        toast({
          title: "Rating Required",
          description: "Please add a star rating to submit your review.",
          variant: "destructive",
        });
        return;
      }
      
      if (!bookingCompleted) {
        toast({
          title: "Cannot Submit Review",
          description: "Only completed bookings can be reviewed.",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsSubmitting(true);
        
        const reviewData: CreateReviewRequest = {
          bookingId: booking.id,
          activityId: booking.activityId,
          comment: formData.comment,
          rating,
          photos: formData.photos || undefined
        };
        
        console.log('Submitting review data:', reviewData);
        const reviewResponse = await reviewService.create(reviewData);
        console.log('Review submitted successfully:', reviewResponse);
        
        toast({
          title: "Review Submitted",
          description: "Thank you for sharing your experience!",
        });
        
        // Reset form
        reset();
        setRating(0);
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }      
      } catch (error: unknown) {
        console.error('Error submitting review:', error);
        
        const errorMessage = error instanceof Error 
          ? error.message 
          : "There was a problem submitting your review.";
        
        toast({
          title: "Error Submitting Review",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [booking, bookingCompleted, rating, toast, reset, onSuccess]
  );
  return (
    <>
      {!bookingCompleted && (
        <div className="p-4 mb-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            This booking must be completed before you can submit a review.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rating">Your Rating</Label>
          <div className="py-2">
            <StarRating
              rating={rating}
              onChange={setRating}
              size="large"
              interactive={bookingCompleted}
            />
            {rating === 0 && bookingCompleted && (
              <p className="text-sm text-red-500 mt-1">Please select a rating</p>
            )}
          </div>
        </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Your Review</Label>
        <Textarea
          id="comment"
          {...register("comment", {
            required: "Please share your thoughts about the experience",
            maxLength: {
              value: 1000,
              message: "Review must not exceed 1000 characters",
            },
          })}
          placeholder="Share your experience with this activity..."
          rows={5}
        />
        {errors.comment && (
          <p className="text-sm text-red-500">{errors.comment.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="photos">Photos (Optional)</Label>
        <Input
          id="photos"
          {...register("photos")}
          type="text"
          placeholder="Enter photo URLs separated by commas"
        />
        <p className="text-sm text-gray-500">
          Add public URLs of photos separated by commas
        </p>
      </div>

      <div className="pt-2">        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !bookingCompleted}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
        {!bookingCompleted && (
          <p className="text-xs text-center text-gray-500 mt-2">
            You can only submit a review after the booking is completed
          </p>
        )}</div>
    </form>
    </>
  );
}
