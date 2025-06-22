import { format, isValid } from "date-fns";

/**
 * Helper function to safely format dates from various formats,
 * especially handling the backend's array format: [year, month, day, hour, minute, second, nanoseconds]
 * 
 * @param dateValue Date value that could be array, string, number or null
 * @returns Formatted date string or fallback message
 */
export const formatBookingDate = (dateValue: unknown): string => {
  try {
    // If it's null or undefined, return a fallback
    if (!dateValue) {
      return 'Date unavailable';
    }
    
    // If it's an array in format [year, month, day, hour, minute, second, nanoseconds]
    if (Array.isArray(dateValue) && dateValue.length >= 3) {
      // Extract and convert components to numbers
      const year = Number(dateValue[0]);
      const month = Number(dateValue[1]);
      const day = Number(dateValue[2]);
      const hour = dateValue.length > 3 ? Number(dateValue[3]) : 0;
      const minute = dateValue.length > 4 ? Number(dateValue[4]) : 0;
      const second = dateValue.length > 5 ? Number(dateValue[5]) : 0;
      
      console.log(`Creating date from array: ${year}-${month}-${day} ${hour}:${minute}:${second}`);
      
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
    if (typeof dateValue === 'number' || typeof dateValue === 'string') {
      const date = new Date(dateValue);
      
      // Check if the date is valid before formatting
      if (isValid(date)) {
        return format(date, 'MMM d, yyyy');
      }
    }
    
    // If we get here, the date couldn't be parsed correctly
    return 'Invalid date';
  } catch (error) {
    console.error("Error formatting date:", error, "Value was:", dateValue);
    return 'Date error';
  }
};

/**
 * Converts an array date [year, month, day, hour, minute, second, nanoseconds]
 * to a JavaScript Date object
 */
export const arrayToDate = (dateArray: number[]): Date | null => {
  if (!Array.isArray(dateArray) || dateArray.length < 3) {
    return null;
  }
  
  try {
    const year = Number(dateArray[0]);
    const month = Number(dateArray[1]);
    const day = Number(dateArray[2]);
    const hour = dateArray.length > 3 ? Number(dateArray[3]) : 0;
    const minute = dateArray.length > 4 ? Number(dateArray[4]) : 0;
    const second = dateArray.length > 5 ? Number(dateArray[5]) : 0;
    
    // Create a date using the components (month is 0-indexed in JavaScript)
    const date = new Date(year, month - 1, day, hour, minute, second);
    
    return isValid(date) ? date : null;
  } catch (error) {
    console.error("Error converting array to date:", error);
    return null;
  }
};
