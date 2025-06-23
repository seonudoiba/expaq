import { Activity } from "./activity";
import { PaymentAnalytics } from "./payments";
import { Review } from "./review";

export interface User {
  id: string;
  userName: string;
  email: string;
  avatar?: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
  profilePictureUrl: string | null;
  bio: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface Role {
  id: string;
  name: "GUEST" | "ADMIN" | "HOST";
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  userName: string;
  lastName: string;
  profilePictureUrl: string | "/default-avatar.png";
  bio: string | "";
  roles: Role[];
  verified: boolean;
  active: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
export interface Location {
  id: string;
  name: string;
  image: string;
  countryId: string;
}
export interface City {
  id: string;
  name: string;
  image: string;
  countryId: string;
  activityCount: number;
}
export interface Country {
  id: string;
  name: string;
  image: string;
  cityCount: number;
  activityCount: number;
}

// Review interface has been consolidated into the types/review.ts file
export interface OldReview {
  id: string;
  content: string;
  rating: number;
  user: User;
  activity: Activity;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  activity?: Activity;            // Full activity object might be included or not
  activityId: string;
  activityTitle?: string;         // Direct flat field from API
  activityImage?: string;         // Direct flat field from API
  user?: User;
  userId: string;
  userName?: string;
  userEmail?: string;    
  numberOfGuests: number;         // Number of guests
  participants?: number;          // Legacy field, equivalent to numberOfGuests
  status: BookingStatus;
  startTime?: string;
  endTime?: string;
  date?: string;                  // Alternative date field
  time?: string;                  // Time field separate from date
  startDate?: string;             // Used in some API responses
  endDate?: string;               // Used in some API responses
  totalPrice: number;
  specialRequests?: string | null; // Optional field for special requests
  cancellationReason?: string | null; // Optional field for cancellation reason
  cancelledAt?: string | null;     // Optional field for cancellation date
  reviews?: Review[];             // Reviews for this booking
  createdAt: string | number[] | null; // API returns array format [year, month, day, hour, minute, second, nanoseconds]
  updatedAt: string | number[] | null;
}
export interface CreateBookingRequest {
  activityId: string;
  startTime: string;
  endTime: string;
  numberOfGuests: string;
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

// Review interface has been moved to types/review.ts

export interface Message {
  id: string;
  content: string;
  sender: User;
  receiver: User;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  content: string;
  user: User;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum NotificationType {
  BOOKING_CONFIRMED = "BOOKING_CONFIRMED",
  BOOKING_CANCELLED = "BOOKING_CANCELLED",
  NEW_MESSAGE = "NEW_MESSAGE",
  REVIEW_RECEIVED = "REVIEW_RECEIVED",
  SYSTEM = "SYSTEM",
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface BecomeHostRequest {
  displayName: string;
  phoneNumber: string;
  address: string;
  bio: string;
  identificationDocument: string;
  languages?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  bio: string;
}
export interface becomeHostRequest {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  bio: string;
}

export interface CreateReviewRequest {
  bookingId: string;
  photos?: string; // Optional photo URLs (comma-separated or JSON string)
  activityId: string;
  rating: number;
  comment: string;
}

export interface PaginatedUsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  content: UserProfile[];
}
// This Booking interface has been consolidated with the one above

export interface BookingWidgetProps {
  activity: {
    id: string;
    title: string;
    price: number;
    rating: number;
    reviews: number;
    maxGuests: number;
    duration: string;
    images: string[];
  };
}

// This Review interface has been consolidated with the one above

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}



export interface AnalyticsItem {
  label: string;
  name: string;
  value: string | number;
  percentage: number;
  isNegative?: boolean;
}

export interface PaymentAnalyticsProps {
  analytics: PaymentAnalytics;
  loading: boolean;
  totalRevenue: number;
  revenueGrowthRate: number;
  overallSuccessRate: number;
  successRateGrowth: number;
  averageTransactionAmount: number;
  averageTransactionGrowth: number;
  fraudRate: number;
  fraudRateChange: number;
  highRiskTransactions: number;
  highRiskTransactionsChange: number;
  averageRiskScore: number;
  riskScoreChange: number;
  averageTransactionTime: number;
  transactionTimeChange: number;
}
