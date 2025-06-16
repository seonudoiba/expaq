/**
 * Host related types
 */

import { Role, Activity } from './index';

export interface Host {
  id: string;
  userName: string;
  email: string;
  profilePictureUrl: string;
  bio: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  activitiesHosted: number;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  verified: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  activities?: Activity[];
}

export interface HostProfile {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  bio: string;
  roles: Role[];
  activitiesHosted: number;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  verified: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicHostResponse {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  bio: string;
  activitiesHosted: number;
  averageRating: number;
  totalReviews: number;
  verified: boolean;
  createdAt: string;
}
