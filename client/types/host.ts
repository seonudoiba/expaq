/**
 * Host related types
 */

import { Role } from './index';

export interface Host {
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
  verified: boolean;
}

export interface HostProfile {
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
