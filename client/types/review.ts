import { User } from "./index";
import { Activity } from "./activity";

/**
 * Interface representing a review of an activity booking
 */
export interface Review {
  id: string;
  bookingId: string;
  activityId: string;
  userId: string;
  comment: string;
  rating: number;
  photos?: string;
  createdAt: string | number[] | null;
  updatedAt: string | number[] | null;
  
  // These fields may be populated when review is fetched with relations
  activity?: Activity;
  user?: User;
}
