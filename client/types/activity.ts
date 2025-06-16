/**
 * Activity related types
 */

import { City, Country } from './index';

export interface ActivityType {
  id: string;
  name: string;
  image: string;
  activityCount: number;
}

export interface Schedule {
  timeSlots: string[] | null;
  availableDays: string[] | null;
  timeZone: string | null;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  daysOfWeek?: string[];
}

export interface Location {
  id: string;
  name: string;
  image: string;
  countryId: string;
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
  activityType: ActivityType;
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

export interface CreateActivityRequest {
  title: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  schedule: Schedule;
  maxParticipants: number;
  bookedCapacity: number;
  address: string;
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
  schedule: Schedule;
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
