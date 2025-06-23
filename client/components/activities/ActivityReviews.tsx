"use client";

import { useActivityReviews } from "@/hooks/use-activity-reviews";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { 
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Edit,
} from "lucide-react";
import { ActivityReview } from "@/types/reviews";
import type { ReviewStatistics } from "@/types/reviews";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatBookingDate } from "@/lib/utils/date-utils";

interface ActivityReviewsProps {
  activityId: string;
  pageSize?: number;
}

const ReviewSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <Skeleton className="h-20 w-full" />
    <div className="flex justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

const ReviewStatistics = ({ statistics }: { statistics: ReviewStatistics | undefined }) => {
  if (!statistics) return null;
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-2xl font-bold">{statistics.averageRating.toFixed(1)}</div>
          <RatingStars rating={Math.round(statistics.averageRating)} />
          <div className="text-sm text-gray-500 mt-1">{statistics.totalReviews} reviews</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-medium">Rating Breakdown</div>
          <div className="text-sm text-gray-600">
            {statistics.ratingPercentage.toFixed(0)}% positive
          </div>
        </div>
      </div>
      
      {/* Rating bars */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map(stars => {
          const count = statistics[`${getStarText(stars)}StarReviews`];
          const percentage = statistics.totalReviews > 0 
            ? (count / statistics.totalReviews) * 100
            : 0;
            
          return (
            <div key={stars} className="flex items-center gap-2">
              <div className="text-sm w-6">{stars}</div>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-sm text-gray-500 w-10">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function getStarText(num: number): string {
  switch(num) {
    case 5: return 'five';
    case 4: return 'four';
    case 3: return 'three';
    case 2: return 'two';
    case 1: return 'one';
    default: return '';
  }
}

function formatReviewDate(dateValue: string | number[] | null): string {
  if (!dateValue) return '';
  
  return formatBookingDate(dateValue);
}

const ReviewItem = ({ review }: { review: ActivityReview }) => {
  // Get initials for avatar
  const initials = review.userName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();
    
  return (
    <Card className="p-4 mb-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          {review.userProfilePicture ? (
            <AvatarImage src={review.userProfilePicture} alt={review.userName} />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h4 className="font-medium">{review.userName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <RatingStars rating={review.rating} />
                <span className="text-sm text-gray-500">
                  {formatReviewDate(review.createdAt)}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {review.verified && (
                <Badge variant="outline" className="flex items-center gap-1 text-green-700">
                  <CheckCircle className="h-3 w-3" />
                  <span className="text-xs">Verified</span>
                </Badge>
              )}
              
              {review.edited && (
                <Badge variant="outline" className="flex items-center gap-1 text-blue-700">
                  <Edit className="h-3 w-3" />
                  <span className="text-xs">Edited</span>
                </Badge>
              )}
            </div>
          </div>
          
          <p className="mt-3 text-gray-700">{review.comment}</p>
          
          {review.photos && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {review.photos.split(',').map((photoUrl, index) => (
                <div key={index} className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden">
                  <Image 
                    src={photoUrl.trim()}
                    alt={`Review photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          {review.editReason && (
            <div className="mt-2 text-xs text-gray-500">
              <span className="font-medium">Edit reason:</span> {review.editReason}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default function ActivityReviews({ activityId, pageSize = 5 }: ActivityReviewsProps) {
  const {
    reviews,
    statistics,
    pagination,
    isLoading,
  } = useActivityReviews(activityId, 0, pageSize);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>
      
      {/* Statistics Section */}
      <ReviewStatistics statistics={statistics} />
      
      {/* Reviews List */}
      <div>
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <ReviewSkeleton key={i} />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div>
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews yet for this activity.</p>
            <p className="text-gray-500 mt-2">Be the first to leave a review!</p>
          </div>
        )}
      </div>
        {/* Pagination */}
      {reviews.length > 0 && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={pagination.goToPreviousPage}
            disabled={!pagination.hasPrevious}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-sm text-gray-500">
            Page {pagination.currentPage + 1} of {pagination.totalPages}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={pagination.goToNextPage}
            disabled={!pagination.hasNext}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
