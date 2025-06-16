
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, Flag } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewsListProps {
  activityId: string;
}

const ReviewsList = ({ activityId }: ReviewsListProps) => {
  const [showAll, setShowAll] = useState(false);
  console.log(activityId)
  
  // Mock reviews data
  const reviews = [
    {
      id: '1',
      user: {
        name: 'Emily Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        location: 'San Francisco, CA'
      },
      rating: 5,
      date: new Date('2024-01-15'),
      title: 'Amazing sunset experience!',
      content: 'This was absolutely incredible! Sarah was an amazing guide and made sure everyone felt comfortable and safe. The sunset views from the water were breathtaking. Highly recommend this experience to anyone visiting Hawaii!',
      helpful: 12,
      verified: true
    },
    {
      id: '2',
      user: {
        name: 'Michael Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        location: 'Austin, TX'
      },
      rating: 5,
      date: new Date('2024-01-10'),
      title: 'Perfect for beginners',
      content: 'I had never kayaked before but Sarah made it so easy to learn. The equipment was top quality and the whole experience was well organized. The sunset was the cherry on top!',
      helpful: 8,
      verified: true
    },
    {
      id: '3',
      user: {
        name: 'Lisa Thompson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        location: 'Denver, CO'
      },
      rating: 4,
      date: new Date('2024-01-08'),
      title: 'Great activity, minor weather issues',
      content: 'Really enjoyed the kayaking experience. Sarah was knowledgeable and friendly. Unfortunately, it was a bit cloudy so we didn\'t get the full sunset experience, but that\'s not the host\'s fault. Would definitely book again!',
      helpful: 5,
      verified: true
    },
    {
      id: '4',
      user: {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        location: 'Seattle, WA'
      },
      rating: 5,
      date: new Date('2024-01-05'),
      title: 'Unforgettable memories',
      content: 'My wife and I booked this for our anniversary and it exceeded all expectations. The photos Sarah took of us with the sunset in the background are priceless. This is a must-do activity in Hawaii!',
      helpful: 15,
      verified: true
    }
  ];

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Reviews</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-gray-600">({reviews.length} reviews)</span>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="mb-8">
          <h4 className="font-medium mb-4">Rating breakdown</h4>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(r => r.rating === rating).length;
            const percentage = (count / reviews.length) * 100;
            
            return (
              <div key={rating} className="flex items-center space-x-3 mb-2">
                <span className="text-sm w-8">{rating}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user.avatar} alt={review.user.name} />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h5 className="font-medium">{review.user.name}</h5>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-gray-600">
                      {format(review.date, 'MMM yyyy')}
                    </span>
                    <span className="text-sm text-gray-600">{review.user.location}</span>
                  </div>
                  
                  <h6 className="font-medium mb-2">{review.title}</h6>
                  <p className="text-gray-600 mb-4">{review.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {reviews.length > 3 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsList;
