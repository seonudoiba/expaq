import { Activity } from "./activity";
import { User } from "./index";

/**
 * Interface representing a review of an activity 
 */
export interface ActivityReview {
  id: string;
  bookingId: string | null;
  activityId: string;
  activityTitle: string;
  userId: string;
  userName: string;
  userProfilePicture: string | null;
  rating: number;
  comment: string;
  photos?: string;
  blockchainTxHash: string | null;
  editReason: string | null;
  editedAt: string | number[] | null;
  createdAt: string | number[] | null;
  updatedAt: string | number[] | null;
  edited: boolean;
  verified: boolean;
  
  // These fields may be populated when review is fetched with relations
  activity?: Activity;
  user?: User;
}

/**
 * Interface for review statistics
 */
export interface ReviewStatistics {
  averageRating: number;
  totalReviews: number;
  fiveStarReviews: number;
  fourStarReviews: number;
  threeStarReviews: number;
  twoStarReviews: number;
  oneStarReviews: number;
  verifiedReviews: number;
  editedReviews: number;
  ratingPercentage: number;
  [key: string]: number;
}

/**
 * Interface for paginated review response
 */
export interface ActivityReviewsResponse {
  reviews: ActivityReview[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  statistics: ReviewStatistics;
}
