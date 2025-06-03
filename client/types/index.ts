export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
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
  profilePicture: string | "/default-avatar.png";
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
  hostProfilePicture: string | null;
  title: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  activityType: string;
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
  city: Location;
  country: Location;
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
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
export interface becomeHostRequest {
  username: string;
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
  location: string;
  price: number;
  category: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
}

export interface CreateReviewRequest {
  activityId: string;
  rating: number;
  comment: string;
}