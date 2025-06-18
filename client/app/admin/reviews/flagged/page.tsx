"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Star } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock data for flagged reviews
const mockFlaggedReviews = [
  {
    id: "rev-3",
    activityId: "act-789",
    activityTitle: "Salsa Dancing Masterclass",
    reviewerId: "user-101",
    reviewerName: "Sophia Rodriguez",
    hostId: "host-202",
    hostName: "Carlos Mendez",
    rating: 2,
    content: "The class was too advanced for beginners. The instructor moved too quickly and didn't provide enough guidance.",
    status: "flagged",
    createdAt: new Date("2023-11-05"),
    updatedAt: new Date("2023-11-05"),
    helpful: 3,
    reported: true,
    reportedBy: "host-202",
    reportedByName: "Carlos Mendez",
    reportReason: "Inaccurate review",
    reportDetails: "This reviewer only attended 10 minutes of the 2-hour class and left early.",
    images: [],
  },
  {
    id: "rev-5",
    activityId: "act-505",
    activityTitle: "History Walking Tour of Prague",
    reviewerId: "user-606",
    reviewerName: "Anna Novak",
    hostId: "host-707",
    hostName: "Josef Dvorak",
    rating: 1,
    content: "The tour was disappointing. The guide was frequently checking his phone and didn't seem to know much about the city's history.",
    status: "flagged",
    createdAt: new Date("2023-07-28"),
    updatedAt: new Date("2023-07-28"),
    helpful: 2,
    reported: true,
    reportedBy: "host-707",
    reportedByName: "Josef Dvorak",
    reportReason: "Offensive language",
    reportDetails: "Review contains inappropriate language about the guide's accent.",
    images: [],
  },
  {
    id: "rev-6",
    activityId: "act-606",
    activityTitle: "Sushi Making Workshop",
    reviewerId: "user-707",
    reviewerName: "Michael Brown",
    hostId: "host-808",
    hostName: "Hiro Tanaka",
    rating: 3,
    content: "The ingredients weren't fresh and the knives were dull. The chef seemed inexperienced and the venue was not very clean.",
    status: "flagged",
    createdAt: new Date("2023-09-10"),
    updatedAt: new Date("2023-09-10"),
    helpful: 5,
    reported: true,
    reportedBy: "host-808",
    reportedByName: "Hiro Tanaka",
    reportReason: "False information",
    reportDetails: "All ingredients are purchased fresh daily and knives are professionally sharpened. The venue undergoes daily professional cleaning.",
    images: [],
  },
  {
    id: "rev-7",
    activityId: "act-707",
    activityTitle: "Mountain Biking Adventure",
    reviewerId: "user-808",
    reviewerName: "Sarah Davis",
    hostId: "host-909",
    hostName: "Alex Thompson",
    rating: 1,
    content: "Horrible experience. The guide took us on dangerous trails without proper safety briefing. One person in our group got injured.",
    status: "flagged",
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2023-08-15"),
    helpful: 15,
    reported: true,
    reportedBy: "host-909",
    reportedByName: "Alex Thompson",
    reportReason: "Safety concerns",
    reportDetails: "This review makes false claims about safety. All participants sign safety waivers and receive thorough briefing. The injury mentioned was minor and due to the participant ignoring safety instructions.",
    images: [],
  },
];

// Review component with rating stars display
const ReviewRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
      <span className="ml-2 text-sm font-medium">{rating}/5</span>
    </div>
  );
};

export default function FlaggedReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  // Filter reviews based on search
  const filteredReviews = mockFlaggedReviews.filter((review) => {
    if (!searchQuery) return true;

    return (
      review.activityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reportReason.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handle bulk select
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReviews(filteredReviews.map((review) => review.id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleSelectReview = (reviewId: string, checked: boolean) => {
    if (checked) {
      setSelectedReviews([...selectedReviews, reviewId]);
    } else {
      setSelectedReviews(selectedReviews.filter((id) => id !== reviewId));
    }
  };

  // Review Actions
  const handleDismissFlag = (reviewId: string) => {
    console.log(`Dismissing flag for review: ${reviewId}`);
    // API call would go here
  };

  const handleRemoveReview = (reviewId: string) => {
    console.log(`Removing review: ${reviewId}`);
    // API call would go here
  };

  const handleWarnUser = (userId: string) => {
    console.log(`Warning user: ${userId}`);
    // API call would go here
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on ${selectedReviews.length} flagged reviews`);
    setSelectedReviews([]);
    // API call would go here
  };

  // Toggle expanded review details
  const toggleExpandReview = (reviewId: string) => {
    if (expandedReview === reviewId) {
      setExpandedReview(null);
    } else {
      setExpandedReview(reviewId);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Flagged Reviews</h1>
          <p className="text-gray-500">Manage reviews that have been reported by hosts or users</p>
        </div>

        {selectedReviews.length > 0 && (
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => handleBulkAction("dismiss")}
            >
              Dismiss Flags ({selectedReviews.length})
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleBulkAction("remove")}
            >
              Remove Reviews ({selectedReviews.length})
            </Button>
          </div>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Reviews Requiring Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by activity, reviewer, content, or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention Required</AlertTitle>
              <AlertDescription>
                These reviews have been flagged by hosts or users and require moderation action.
                Please review each case carefully before making a decision.
              </AlertDescription>
            </Alert>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          filteredReviews.length > 0 &&
                          selectedReviews.length === filteredReviews.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Flagged Reason</TableHead>
                    <TableHead>Flagged By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                      <React.Fragment key={review.id}>
                        <TableRow onClick={() => toggleExpandReview(review.id)} className="cursor-pointer hover:bg-gray-50">
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedReviews.includes(review.id)}
                              onCheckedChange={(checked) =>
                                handleSelectReview(review.id, checked === true)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span className="font-medium truncate max-w-[200px]">{review.activityTitle}</span>
                              <span className="text-gray-500 text-xs">Host: {review.hostName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{review.reviewerName}</span>
                              <span className="text-xs text-gray-500">ID: {review.reviewerId}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <ReviewRating rating={review.rating} />
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-red-500 text-red-500">
                              {review.reportReason}
                            </Badge>
                          </TableCell>
                          <TableCell>{review.reportedByName}</TableCell>
                          <TableCell>{format(review.createdAt, "MMM dd, yyyy")}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDismissFlag(review.id);
                                }}
                              >
                                Dismiss Flag
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveReview(review.id);
                                }}
                              >
                                Remove Review
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedReview === review.id && (
                          <TableRow className="bg-gray-50">
                            <TableCell colSpan={8} className="p-4">
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <h3 className="font-semibold">Review Content:</h3>
                                    <p className="text-gray-700 p-3 bg-gray-100 rounded-md">
                                      {review.content}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <h3 className="font-semibold">Flag Details:</h3>
                                    <p className="text-gray-700 p-3 bg-gray-100 rounded-md">
                                      {review.reportDetails}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    onClick={() => handleWarnUser(review.reviewerId)}
                                    variant="outline"
                                  >
                                    Warn Reviewer
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleRemoveReview(review.id);
                                      setExpandedReview(null);
                                    }}
                                    variant="destructive"
                                  >
                                    Remove & Notify Reviewer
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No flagged reviews found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
