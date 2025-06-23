import { Booking, BookingStatus } from "@/types";
import { Review } from "@/types/review";
import { format, isValid } from "date-fns";

/**
 * Helper function to safely format dates from various formats
 * @param dateValue Date value that could be string, array, number or null
 * @returns Formatted date string or fallback message
 */
export const formatBookingDate = (dateValue: string | number[] | number | null | undefined): string => {
  try {
    // If it's null or undefined, return a fallback
    if (!dateValue) {
      return 'Date unavailable';
    }
      // If it's an array in format [year, month, day, hour, minute, second, nanoseconds]
    if (Array.isArray(dateValue) && dateValue.length >= 3) {
      // Format: [year, month, day, hour, minute, second, nanoseconds]
      const year = Number(dateValue[0]);
      const month = Number(dateValue[1]);
      const day = Number(dateValue[2]);
      const hour = dateValue.length > 3 ? Number(dateValue[3]) : 0;
      const minute = dateValue.length > 4 ? Number(dateValue[4]) : 0;
      const second = dateValue.length > 5 ? Number(dateValue[5]) : 0;
      
      // Create a date using the components (month is 0-indexed in JavaScript)
      const date = new Date(year, month - 1, day, hour, minute, second);
      
      // Format the date
      if (isValid(date)) {
        return format(date, 'MMM d, yyyy');
      }
      return 'Invalid date array';
    }
    
    // If it's a string that looks like a timestamp, convert it
    if (typeof dateValue === 'string' && !isNaN(Number(dateValue))) {
      dateValue = Number(dateValue);
    }
    
    // Handle the case when dateValue is a number or string
    if (!Array.isArray(dateValue)) {
      const date = new Date(dateValue);
      
      // Check if the date is valid before formatting
    if (isValid(date)) {
      return format(date, 'MMM d, yyyy');
    }
    }
    // If we get here, the date couldn't be parsed correctly
    return 'Invalid date';
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Date error';
  }
};

/**
 * Gets a safe activity image URL from the booking
 * @param booking Booking object
 * @returns URL for the activity image
 */
export const getSafeActivityImage = (booking: Booking): string => {
  return booking.activityImage || 
    (booking.activity?.mediaUrls?.[0] || '/default-activity.jpg');
};

/**
 * Gets a safe activity title from the booking
 * @param booking Booking object
 * @returns Title of the activity
 */
export const getSafeActivityTitle = (booking: Booking): string => {
  return booking.activityTitle || 
    (booking.activity?.title || 'Unnamed Activity');
};

/**
 * Gets booking participants count safely
 * @param booking Booking object
 * @returns Number of participants
 */
export const getSafeParticipants = (booking: Booking): number => {
  return typeof booking.numberOfGuests === 'number' ? booking.numberOfGuests : 0;
};

/**
 * Gets booking price formatted safely
 * @param booking Booking object
 * @returns Formatted price string
 */
export const getSafePrice = (booking: Booking): string => {
  return typeof booking.totalPrice === 'number' ? 
    booking.totalPrice.toFixed(2) : '0.00';
};

/**
 * Gets booking time safely
 * @param booking Booking object
 * @returns Time string
 */
export const getSafeTime = (booking: Booking): string => {
  return booking.time || 
    (booking.startDate ? new Date(booking.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time not specified');
};

/**
 * Normalizes a booking object by ensuring all fields have valid values
 * @param booking Raw booking object from API
 * @returns Normalized booking object with safe values
 */
export const normalizeBooking = (booking: Partial<Booking>): Booking => {
  return {
    id: booking.id || '',
    activityId: booking.activityId || '',
    activityTitle: getSafeActivityTitle(booking as Booking),
    activityImage: getSafeActivityImage(booking as Booking),
    status: booking.status || ('pending' as BookingStatus),
    numberOfGuests: booking.numberOfGuests ?? 0,
    totalPrice: typeof booking.totalPrice === 'number' ? booking.totalPrice : 0,
    createdAt: booking.createdAt || null,
    updatedAt: booking.updatedAt || null,
    activity: booking.activity,
    startDate: booking.startDate || undefined,
    endDate: booking.endDate || undefined,
    date: booking.date || undefined,
    time: booking.time || undefined,
    userId: booking.userId || '',
    user: booking.user
  };
};

/**
 * Interface for review submission request
 */
export interface CreateReviewRequest {
  bookingId: string;
  activityId: string;
  comment: string;
  rating: number;
  photos?: string;  // Optional photo URLs (comma-separated or JSON string)
}

/**
 * Type for review response
 */
export type ReviewResponse = Review;

// /**
//  * Submit a review for a booking
//  * @param reviewData Review data including booking ID, activity ID, comment, and rating
//  * @param booking The booking object to validate completion status
//  * @param apiBaseUrl Optional base URL for the API
//  * @returns Promise that resolves to the created review
//  */
// export const submitBookingReview = async (
//   reviewData: CreateReviewRequest,
//   booking: Booking | null,
//   apiBaseUrl = '/api'
// ): Promise<ReviewResponse> => {
//   try {
//     // Validate input
//     if (!reviewData.bookingId) {
//       throw new Error('Booking ID is required');
//     }
//     if (!reviewData.activityId) {
//       throw new Error('Activity ID is required');
//     }
//     if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
//       throw new Error('Rating must be between 1 and 5');
//     }
    
//     // Validate that the booking is completed
//     if (!booking || !isBookingCompleted(booking)) {
//       throw new Error('Only completed bookings can be reviewed');
//     }
    
//     // Ensure the booking ID from the request matches the booking provided
//     if (booking.id !== reviewData.bookingId) {
//       throw new Error('Booking ID mismatch');
//     }
    
//     // Prepare request payload
//     const payload = {
//       bookingId: reviewData.bookingId,
//       activityId: reviewData.activityId,
//       comment: reviewData.comment || '', // Ensure comment is not undefined
//       rating: reviewData.rating,
//       photos: reviewData.photos || ''  // Include photos if provided
//     };    // Send POST request to the API
//     const response = await fetch(`${apiBaseUrl}/reviews`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}` // Add the JWT token
//       },
//       body: JSON.stringify(payload),
//       credentials: 'include' // Include cookies for authentication
//     });

//     // Check if response is ok
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || `Failed to submit review: ${response.status} ${response.statusText}`);
//     }

//     // Return the created review
//     return await response.json();
//   } catch (error) {
//     console.error('Error submitting review:', error);
//     throw error;
//   }
// };

/**
 * Checks if a booking has a completed status
 * @param booking The booking to check
 * @returns True if the booking is completed, false otherwise
 */
export const isBookingCompleted = (booking: Booking | null): boolean => {
  // Handle null/undefined booking
  if (!booking) {
    console.log("isBookingCompleted: booking is null or undefined");
    return false;
  }
  
  // Log the status for debugging
  console.log("isBookingCompleted: checking booking status", {
    status: booking.status,
    statusType: typeof booking.status,
    isString: typeof booking.status === 'string',
    upperCase: typeof booking.status === 'string' ? booking.status.toUpperCase() : 'N/A',
    directCheck: booking.status === "COMPLETED",
    enumCheck: booking.status === BookingStatus.COMPLETED
  });
  
  // Direct string comparison
  if (booking.status === "COMPLETED") {
    return true;
  }
  
  // Handle string representations with case insensitivity
  if (typeof booking.status === 'string') {
    return booking.status.toUpperCase() === 'COMPLETED';
  }
  
  // Handle enum representation
  return booking.status === BookingStatus.COMPLETED;
};
