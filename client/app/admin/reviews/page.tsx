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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { DateRangePicker, DateRange } from "@/components/ui/date-picker";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { AlertCircle, ArrowDown, ArrowUp, MoreHorizontal, Star } from "lucide-react";
import { format } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";

// Mock data for reviews
const mockReviews = [
  {
    id: "rev-1",
    activityId: "act-123",
    activityTitle: "Cooking Class: Italian Pasta Making",
    reviewerId: "user-456",
    reviewerName: "Emma Johnson",
    hostId: "host-789",
    hostName: "Marco Rossi",
    rating: 5,
    content: "Amazing experience! Marco was very knowledgeable and patient. The pasta we made was delicious!",
    status: "published",
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2023-10-15"),
    helpful: 12,
    reported: false,
    images: ["pasta1.jpg", "pasta2.jpg"],
  },
  {
    id: "rev-2",
    activityId: "act-456",
    activityTitle: "Tokyo Street Photography Tour",
    reviewerId: "user-789",
    reviewerName: "David Chen",
    hostId: "host-101",
    hostName: "Yuki Tanaka",
    rating: 4,
    content: "Great tour, learned a lot about photography techniques. The spots were fantastic for taking urban photos.",
    status: "published",
    createdAt: new Date("2023-09-20"),
    updatedAt: new Date("2023-09-20"),
    helpful: 8,
    reported: false,
    images: ["tokyo1.jpg"],
  },
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
    status: "published",
    createdAt: new Date("2023-11-05"),
    updatedAt: new Date("2023-11-05"),
    helpful: 3,
    reported: true,
    reportReason: "Inaccurate review",
    images: [],
  },
  {
    id: "rev-4",
    activityId: "act-202",
    activityTitle: "Wine Tasting in Napa Valley",
    reviewerId: "user-303",
    reviewerName: "Robert Williams",
    hostId: "host-404",
    hostName: "Claire Dubois",
    rating: 5,
    content: "Exceptional wine selection and Claire was an incredible host with deep knowledge of wines. Highly recommend!",
    status: "published",
    createdAt: new Date("2023-08-12"),
    updatedAt: new Date("2023-08-12"),
    helpful: 24,
    reported: false,
    images: ["wine1.jpg", "wine2.jpg", "wine3.jpg"],
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
    reportReason: "Offensive language",
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

export default function AdminReviewsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "createdAt",
    direction: "desc",
  });

  // Filter reviews based on current tab and search filters
  const filteredReviews = mockReviews
    .filter((review) => {
      // Tab filter
      if (selectedTab === "flagged" && !review.reported) return false;
      
      // Search query filter
      if (
        searchQuery &&
        !review.activityTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !review.reviewerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !review.content.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      
      // Status filter
      if (selectedStatus && review.status !== selectedStatus) return false;
      
      // Rating filter
      if (selectedRating && review.rating.toString() !== selectedRating) return false;
      
      // Date range filter
      if (
        dateRange?.from &&
        dateRange?.to &&
        (review.createdAt < dateRange.from || review.createdAt > dateRange.to)
      ) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      const key = sortConfig.key as keyof typeof a;
      const aValue = a[key];
      const bValue = b[key];
      if (aValue != null && bValue != null) {
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  
  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  // Handle bulk select
  const handleSelectAllReviews = (checked: boolean) => {
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
  const handleApprove = (reviewId: string) => {
    console.log(`Approving review: ${reviewId}`);
    // API call would go here
  };

  const handleReject = (reviewId: string) => {
    console.log(`Rejecting review: ${reviewId}`);
    // API call would go here
  };

  const handleFeature = (reviewId: string) => {
    console.log(`Featuring review: ${reviewId}`);
    // API call would go here
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on ${selectedReviews.length} reviews`);
    // API call would go here
    setSelectedReviews([]);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Reviews Management</h1>
        <div className="flex flex-col md:flex-row gap-2">
          {selectedReviews.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions ({selectedReviews.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Choose an action</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleBulkAction("approve")}>
                  Approve Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("reject")}>
                  Reject Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("feature")}>
                  Feature Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("delete")}>
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged Reviews
            <Badge className="ml-2 bg-red-500">
              {mockReviews.filter((review) => review.reported).length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search reviews by activity, reviewer, or content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Statuses</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="flagged">Flagged</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedRating} onValueChange={setSelectedRating}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Ratings</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="col-span-2">
                      <DateRangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        placeholder="Filter by date"
                      />
                      
                    </div>
                  </div>
                </div>

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
                            onCheckedChange={handleSelectAllReviews}
                          />
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort("activityTitle")}
                        >
                          <div className="flex items-center">
                            Activity
                            {sortConfig.key === "activityTitle" && (
                              sortConfig.direction === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Reviewer</TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort("rating")}
                        >
                          <div className="flex items-center">
                            Rating
                            {sortConfig.key === "rating" && (
                              sortConfig.direction === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort("createdAt")}
                        >
                          <div className="flex items-center">
                            Date
                            {sortConfig.key === "createdAt" && (
                              sortConfig.direction === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReviews.length > 0 ? (
                        filteredReviews.map((review) => (
                          <TableRow key={review.id}>
                            <TableCell>
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
                            <TableCell>{review.reviewerName}</TableCell>
                            <TableCell>
                              <ReviewRating rating={review.rating} />
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[250px] truncate">{review.content}</div>
                            </TableCell>
                            <TableCell>
                              {format(review.createdAt, "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`
                                  ${review.reported ? "bg-red-500" : "bg-green-500"}
                                `}
                              >
                                {review.reported ? "Flagged" : "Published"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleApprove(review.id)}>
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleReject(review.id)}>
                                    Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleFeature(review.id)}>
                                    Feature Review
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-500"
                                    onClick={() => console.log(`Delete review: ${review.id}`)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            No reviews found matching the current filters.
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
                        <PaginationLink href="#">3</PaginationLink>
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
        </TabsContent>

        <TabsContent value="flagged">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {/* Similar structure as above, but filtered for flagged reviews */}
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox />
                        </TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Reviewer</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Flagged Reason</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockReviews
                        .filter((review) => review.reported)
                        .map((review) => (
                          <TableRow key={review.id}>
                            <TableCell>
                              <Checkbox />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span className="font-medium truncate max-w-[200px]">{review.activityTitle}</span>
                                <span className="text-gray-500 text-xs">Host: {review.hostName}</span>
                              </div>
                            </TableCell>
                            <TableCell>{review.reviewerName}</TableCell>
                            <TableCell>
                              <ReviewRating rating={review.rating} />
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[250px] truncate">{review.content}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                                <span>{review.reportReason}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(review.createdAt, "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleApprove(review.id)}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => handleReject(review.id)}
                                >
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
