"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@/icons";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity } from "@/types";

// Mock activities data
const activities: Partial<Activity>[] = [
  {
    id: "a1",
    hostId: "h1",
    hostName: "Michael Johnson",
    hostProfilePicture: "/default.png",
    title: "Italian Pasta Masterclass",
    description: "Learn to make authentic Italian pasta from scratch.",
    price: 55,
    activityType: { id: "t1", name: "Cooking Class", image: "", countryId: "" },
    mediaUrls: ["/cooking-class.jpg"],
    maxParticipants: 8,
    minParticipants: 2,
    durationMinutes: 180,
    averageRating: 4.8,
    totalReviews: 24,
    createdAt: "2024-01-10T14:30:00Z",
    active: true,
    verified: true,
  },
  {
    id: "a2",
    hostId: "h2",
    hostName: "Sarah Williams",
    hostProfilePicture: "/default.png",
    title: "Mountain Hiking Experience",
    description: "Guided mountain hike with spectacular views.",
    price: 40,
    activityType: { id: "t2", name: "Outdoor Adventure", image: "", countryId: "" },
    mediaUrls: ["/hero.jpg"],
    maxParticipants: 12,
    minParticipants: 4,
    durationMinutes: 240,
    averageRating: 4.7,
    totalReviews: 18,
    createdAt: "2024-02-15T09:15:00Z",
    active: true,
    verified: true,
  },
  {
    id: "a3",
    hostId: "h3",
    hostName: "Emma Davis",
    hostProfilePicture: "/default.png",
    title: "Mindfulness Yoga Retreat",
    description: "Rejuvenating yoga session focusing on mindfulness.",
    price: 30,
    activityType: { id: "t3", name: "Wellness", image: "", countryId: "" },
    mediaUrls: ["/hero1.jpg"],
    maxParticipants: 15,
    minParticipants: 3,
    durationMinutes: 90,
    averageRating: 4.6,
    totalReviews: 12,
    createdAt: "2024-03-05T11:45:00Z",
    active: true,
    verified: false,
  },
  {
    id: "a4",
    hostId: "h4",
    hostName: "David Brown",
    hostProfilePicture: "/default.png",
    title: "Hidden Gems City Tour",
    description: "Explore secret spots and local favorites in the city.",
    price: 35,
    activityType: { id: "t4", name: "City Tour", image: "", countryId: "" },
    mediaUrls: ["/discover.jpg"],
    maxParticipants: 10,
    minParticipants: 2,
    durationMinutes: 180,
    averageRating: 4.9,
    totalReviews: 32,
    createdAt: "2023-12-20T10:00:00Z",
    active: true,
    verified: true,
  },
  {
    id: "a5",
    hostId: "h5",
    hostName: "Anna Martinez",
    hostProfilePicture: "/default.png",
    title: "Spanish Language Immersion",
    description: "Interactive Spanish language session with cultural insights.",
    price: 25,
    activityType: { id: "t5", name: "Language Exchange", image: "", countryId: "" },
    mediaUrls: ["/language-xchange.jpg"],
    maxParticipants: 6,
    minParticipants: 1,
    durationMinutes: 120,
    averageRating: 4.5,
    totalReviews: 8,
    createdAt: "2024-04-10T13:30:00Z",
    active: false,
    verified: false,
  }
];

// Mock pending approval activities
const pendingActivities: Partial<Activity>[] = [
  {
    id: "a6",
    hostId: "h1",
    hostName: "Michael Johnson",
    hostProfilePicture: "/default.png",
    title: "French Pastry Workshop",
    description: "Learn to make exquisite French pastries.",
    price: 60,
    activityType: { id: "t1", name: "Cooking Class", image: "", countryId: "" },
    mediaUrls: ["/cooking-class.jpg"],
    maxParticipants: 6,
    minParticipants: 2,
    durationMinutes: 210,
    createdAt: "2024-06-05T15:30:00Z",
    active: false,
    verified: false,
  },
  {
    id: "a7",
    hostId: "h4",
    hostName: "David Brown",
    hostProfilePicture: "/default.png",
    title: "Nightlife Tour",
    description: "Explore the city's vibrant nightlife scene.",
    price: 45,
    activityType: { id: "t4", name: "City Tour", image: "", countryId: "" },
    mediaUrls: ["/discover.jpg"],
    maxParticipants: 8,
    minParticipants: 2,
    durationMinutes: 240,
    createdAt: "2024-06-08T09:45:00Z",
    active: false,
    verified: false,
  },
  {
    id: "a8",
    hostId: "h2",
    hostName: "Sarah Williams",
    hostProfilePicture: "/default.png",
    title: "Kayaking Adventure",
    description: "Guided kayaking experience through scenic waterways.",
    price: 55,
    activityType: { id: "t2", name: "Outdoor Adventure", image: "", countryId: "" },
    mediaUrls: ["/hero.jpg"],
    maxParticipants: 8,
    minParticipants: 2,
    durationMinutes: 180,
    createdAt: "2024-06-10T11:20:00Z",
    active: false,
    verified: false,
  }
];

// Mock activity categories
const categories = [
  { id: "t1", name: "Cooking Class", count: 42 },
  { id: "t2", name: "Outdoor Adventure", count: 38 },
  { id: "t3", name: "Wellness", count: 25 },
  { id: "t4", name: "City Tour", count: 31 },
  { id: "t5", name: "Language Exchange", count: 19 },
  { id: "t6", name: "Art & Craft", count: 22 },
  { id: "t7", name: "Music & Dance", count: 15 },
  { id: "t8", name: "Photography", count: 12 },
];

// Featured activities
const featuredActivities = [
  {
    activityId: "a1",
    title: "Italian Pasta Masterclass",
    featuredOrder: 1,
    startDate: "2024-06-01T00:00:00Z",
    endDate: "2024-07-31T23:59:59Z"
  },
  {
    activityId: "a2",
    title: "Mountain Hiking Experience",
    featuredOrder: 2,
    startDate: "2024-06-01T00:00:00Z",
    endDate: "2024-07-31T23:59:59Z"
  },
  {
    activityId: "a4",
    title: "Hidden Gems City Tour",
    featuredOrder: 3,
    startDate: "2024-06-15T00:00:00Z",
    endDate: "2024-08-15T23:59:59Z"
  }
];

export default function ActivitiesPage() {
  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Filter activities based on search term and filters
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      searchTerm === "" || 
      activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.hostName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "all" || 
      activity.activityType?.name === categoryFilter;
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && activity.active) ||
      (statusFilter === "inactive" && !activity.active) ||
      (statusFilter === "verified" && activity.verified) ||
      (statusFilter === "unverified" && !activity.verified);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Toggle selection of all activities
  const toggleSelectAll = () => {
    if (selectedActivities.length === filteredActivities.length) {
      setSelectedActivities([]);
    } else {
      setSelectedActivities(filteredActivities.map(activity => activity.id || ""));
    }
  };

  // Toggle selection of a single activity
  const toggleSelectActivity = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(selectedActivities.filter(id => id !== activityId));
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  // Format date to readable string
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Format duration to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Activity Management</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage all activities, categories, and featured listings.
        </p>
      </div>

      <Tabs defaultValue="activities" className="space-y-4">
        <TabsList className="bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="activities">All Activities</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* All Activities Tab */}
        <TabsContent value="activities">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Activities</CardTitle>
              <CardDescription>All experiences listed on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters and actions */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex flex-1 gap-4 flex-wrap">
                  <Input 
                    placeholder="Search activities..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 ml-auto">
                  <Button variant="outline">Export</Button>
                  <Button variant="default">Add Activity</Button>
                </div>
              </div>

              {/* Bulk actions */}
              {selectedActivities.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-4 flex items-center">
                  <span className="mr-4">{selectedActivities.length} activities selected</span>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Verify</Button>
                    <Button variant="outline" size="sm">Feature</Button>
                    <Button variant="destructive" size="sm">Deactivate</Button>
                  </div>
                </div>
              )}

              {/* Activities table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedActivities.length === filteredActivities.length && filteredActivities.length > 0} 
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No activities found matching the filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredActivities.map(activity => (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedActivities.includes(activity.id || "")} 
                              onCheckedChange={() => toggleSelectActivity(activity.id || "")}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                <Image 
                                  src={activity.mediaUrls?.[0] || "/default.png"} 
                                  alt={activity.title || ""}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{activity.title}</div>
                                <div className="text-xs text-gray-500 line-clamp-1">
                                  {activity.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                <Image 
                                  src={activity.hostProfilePicture || "/default.png"} 
                                  alt={activity.hostName || ""}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span>{activity.hostName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{activity.activityType?.name}</TableCell>
                          <TableCell>${activity.price}</TableCell>
                          <TableCell>{formatDuration(activity.durationMinutes || 0)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant={activity.active ? "secondary" : "default"}>
                                {activity.active ? "Active" : "Inactive"}
                              </Badge>
                              <Badge variant={activity.verified ? "outline" : "secondary"}>
                                {activity.verified ? "Verified" : "Unverified"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <span className="sr-only">Actions</span>
                                  <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View activity</DropdownMenuItem>
                                <DropdownMenuItem>Edit details</DropdownMenuItem>
                                <DropdownMenuItem>View bookings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  {activity.active ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  {activity.verified ? "Remove verification" : "Verify activity"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Add to featured
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Delete activity</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <Pagination className="mt-4">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Approval Tab */}
        <TabsContent value="pending">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Pending Activities</CardTitle>
              <CardDescription>Activities awaiting review and approval.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Pending activities table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingActivities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No pending activities
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingActivities.map(activity => (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                <Image 
                                  src={activity.mediaUrls?.[0] || "/default.png"} 
                                  alt={activity.title || ""}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{activity.title}</div>
                                <div className="text-xs text-gray-500 line-clamp-1">
                                  {activity.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                <Image 
                                  src={activity.hostProfilePicture || "/default.png"} 
                                  alt={activity.hostName || ""}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span>{activity.hostName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{activity.activityType?.name}</TableCell>
                          <TableCell>{formatDate(activity.createdAt || "")}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">View Details</Button>
                              <Button variant="default" size="sm">Approve</Button>
                              <Button variant="destructive" size="sm">Reject</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Featured Tab */}
        <TabsContent value="featured">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Featured Activities</CardTitle>
              <CardDescription>Activities highlighted on the platform homepage.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex justify-end">
                <Button variant="default">Add Featured Activity</Button>
              </div>
              
              {/* Featured activities table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {featuredActivities.map((featured) => (
                      <TableRow key={featured.activityId}>
                        <TableCell className="font-bold">{featured.featuredOrder}</TableCell>
                        <TableCell>{featured.title}</TableCell>
                        <TableCell>{formatDate(featured.startDate)}</TableCell>
                        <TableCell>{formatDate(featured.endDate)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Reorder</Button>
                            <Button variant="destructive" size="sm">Remove</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Activity Categories</CardTitle>
              <CardDescription>Manage categories for activities.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex justify-end">
                <Button variant="default">Add Category</Button>
              </div>
              
              {/* Categories table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Activity Count</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="font-medium">{category.name}</div>
                        </TableCell>
                        <TableCell>{category.count}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm" disabled={category.count > 0}>
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
