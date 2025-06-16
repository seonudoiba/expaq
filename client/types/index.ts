import { PaymentAnalytics } from "./payments";

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
export interface activityType {
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
export interface Schedule {
  timeSlots: string[] | null;
  availableDays: string[] | null;
  timeZone: string | null;
}
export interface ActivityType {
  id: string;
  name: string;
  image: string;
  activityCount: number;
}
export interface Activity {
  id: string;
  hostId: string;
  hostName: string;
  hostProfilePicture: string;
  hostCreatedAt: string;
  hostBio: string;
  title: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  activityType: activityType;
  schedule: Schedule;
  mediaUrls: string[];
  maxParticipants: number;
  minParticipants: number;
  durationMinutes: number;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  verified: boolean;
  startDate: string;
  endDate: string;
  locationPoint: string;
  address: string;
  city: City;
  country: Country;
}

export interface Review {
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
  activity: Activity;
  user: User;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  participants: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED"
}

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
  SYSTEM = "SYSTEM"
}

export interface AuthResponse {
  token: string;
  user: User;
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
  profilePictureUrl: string,
  bio: string,
}
export interface becomeHostRequest {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string,
  bio: string,
}

export interface CreateActivityRequest {
  title: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  schedule: {
    startDate: string;
    endDate: string;
    startTime: string;
    daysOfWeek: string[];
  };
  maxParticipants: number;
  // capacity: number;
  bookedCapacity: number;
  address: string;
  // isFeatured: boolean;
  city: {
    id: string;
  };
  country: {
    id: string;
  };
  activityType: {
    id: string;
  };
  minParticipants: number;
  durationMinutes: number;
  mediaUrls: string[];
  
}
export interface UpdateActivityRequest {
  title: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  schedule: {
    startDate: string;
    endDate: string;
    startTime: string;
    daysOfWeek: string[];
  };
  maxParticipants: number;
  capacity: number;
  bookedCapacity: number;
  address: string;
  isFeatured: boolean;
  city: {
    id: string;
  };
  country: {
    id: string;
  };
  activityType: {
    id: string;
  };
  minParticipants: number;
  durationMinutes: number;
  isActive: boolean;
  isVerified: boolean;
  mediaUrls: string[];
  locationPoint: string;
  startDate: string;
  endDate: string;

}

export interface CreateReviewRequest {
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
export interface Booking {
  id: string;
  activityId: string;
  activity: Activity;
  userId: string;
  user: User;
  date: string;
  time: string;
  participants: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  activityId: string;
  activity: Activity;
  userId: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface ActivitySearchParams {
  search?: string;
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
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