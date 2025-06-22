import { Booking, BookingStatus } from "@/types";
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
  return typeof booking.participants === 'number' ? booking.participants : 0;
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
    participants: getSafeParticipants(booking as Booking),
    totalPrice: typeof booking.totalPrice === 'number' ? booking.totalPrice : 0,
    createdAt: booking.createdAt || null,
    activity: booking.activity,
    startDate: booking.startDate,
    endDate: booking.endDate,
    date: booking.date,
    time: booking.time,
    userId: booking.userId || '',
    user: booking.user
  };
};
