"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRangePicker, DateRange } from "@/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EyeIcon, MoreHorizontal, AlertTriangle, Shield, Ban, Flag, UserX, History } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock data for user activities
const userActivities = [
  {
    id: "act-123456",
    userId: "user-78901",
    userName: "Emma Wilson",
    userEmail: "emma.wilson@example.com",
    userType: "guest",
    action: "login",
    ipAddress: "198.51.100.42",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    details: "Successful login",
    timestamp: new Date("2025-06-16T14:32:15"),
    location: "San Francisco, USA",
    riskLevel: "low",
  },
  {
    id: "act-123457",
    userId: "user-34567",
    userName: "John Davis",
    userEmail: "john.davis@example.com",
    userType: "host",
    action: "profile_update",
    ipAddress: "203.0.113.89",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    details: "Updated profile picture and bio",
    timestamp: new Date("2025-06-16T13:45:22"),
    location: "New York, USA",
    riskLevel: "low",
  },
  {
    id: "act-123458",
    userId: "user-23456",
    userName: "Sophia Chen",
    userEmail: "sophia.chen@example.com",
    userType: "guest",
    action: "booking_created",
    ipAddress: "45.76.123.45",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X)",
    details: "Booked 'Tokyo Street Photography Tour' for June 25, 2025",
    timestamp: new Date("2025-06-16T12:30:45"),
    location: "Tokyo, Japan",
    riskLevel: "low",
  },
  {
    id: "act-123459",
    userId: "user-45678",
    userName: "Michael Brown",
    userEmail: "michael.brown@example.com",
    userType: "guest",
    action: "payment_attempted",
    ipAddress: "31.13.72.48",
    userAgent: "Mozilla/5.0 (Linux; Android 13; SM-G998B)",
    details: "Failed payment attempt for 'Mountain Climbing Adventure'",
    timestamp: new Date("2025-06-16T11:12:05"),
    location: "London, UK",
    riskLevel: "medium",
  },
  {
    id: "act-123460",
    userId: "user-56789",
    userName: "Jessica Taylor",
    userEmail: "jessica.taylor@example.com",
    userType: "host",
    action: "listing_created",
    ipAddress: "104.28.42.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    details: "Created new activity: 'Spanish Cooking Masterclass'",
    timestamp: new Date("2025-06-16T10:05:33"),
    location: "Barcelona, Spain",
    riskLevel: "low",
  },
  {
    id: "act-123461",
    userId: "user-67890",
    userName: "David Kim",
    userEmail: "david.kim@example.com",
    userType: "guest",
    action: "review_posted",
    ipAddress: "52.128.23.153",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X)",
    details: "Posted 1-star review for 'City Walking Tour'",
    timestamp: new Date("2025-06-16T09:43:18"),
    location: "Seoul, South Korea",
    riskLevel: "medium",
  },
  {
    id: "act-123462",
    userId: "user-78901",
    userName: "Emma Wilson",
    userEmail: "emma.wilson@example.com",
    userType: "guest",
    action: "message_sent",
    ipAddress: "198.51.100.42",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X)",
    details: "Sent message to host regarding booking #BK-45678",
    timestamp: new Date("2025-06-16T08:27:52"),
    location: "San Francisco, USA",
    riskLevel: "low",
  },
  {
    id: "act-123463",
    userId: "user-89012",
    userName: "Robert Johnson",
    userEmail: "robert.johnson@example.com",
    userType: "guest",
    action: "login",
    ipAddress: "92.168.1.254",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    details: "Failed login attempt (5th consecutive failure)",
    timestamp: new Date("2025-06-16T07:15:09"),
    location: "Unknown Location",
    riskLevel: "high",
  },
  {
    id: "act-123464",
    userId: "user-90123",
    userName: "Lisa Wang",
    userEmail: "lisa.wang@example.com",
    userType: "host",
    action: "payout_requested",
    ipAddress: "157.240.22.35",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    details: "Requested payout of $1,250.00",
    timestamp: new Date("2025-06-16T06:32:41"),
    location: "Singapore",
    riskLevel: "low",
  },
  {
    id: "act-123465",
    userId: "user-12345",
    userName: "James Miller",
    userEmail: "james.miller@example.com",
    userType: "admin",
    action: "user_banned",
    ipAddress: "66.249.64.126",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    details: "Banned user ID: user-98765 for policy violations",
    timestamp: new Date("2025-06-16T05:44:23"),
    location: "Chicago, USA",
    riskLevel: "low",
  },
];

// Mock flagged users data
const flaggedUsers = [
  {
    id: "user-89012",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    userType: "guest",
    flags: [
      {
        id: "flag-1",
        reason: "Suspicious Login Activity",
        details: "Multiple failed login attempts from different locations",
        timestamp: new Date("2025-06-16T07:15:09"),
        severity: "high",
      },
    ],
    registrationDate: new Date("2024-11-30"),
    lastActive: new Date("2025-06-16T07:15:09"),
  },
  {
    id: "user-67890",
    name: "David Kim",
    email: "david.kim@example.com",
    userType: "guest",
    flags: [
      {
        id: "flag-2",
        reason: "Review Abuse",
        details: "Multiple 1-star reviews with similar content across different hosts",
        timestamp: new Date("2025-06-16T09:43:18"),
        severity: "medium",
      },
      {
        id: "flag-3",
        reason: "Payment Disputes",
        details: "Frequently disputes charges after using services",
        timestamp: new Date("2025-06-15T14:22:31"),
        severity: "medium",
      },
    ],
    registrationDate: new Date("2025-01-15"),
    lastActive: new Date("2025-06-16T09:43:18"),
  },
  {
    id: "user-34521",
    name: "Sarah Connor",
    email: "sarah.connor@example.com",
    userType: "host",
    flags: [
      {
        id: "flag-4",
        reason: "Inappropriate Content",
        details: "Activity listing contains prohibited content or services",
        timestamp: new Date("2025-06-15T18:54:12"),
        severity: "high",
      },
    ],
    registrationDate: new Date("2024-09-03"),
    lastActive: new Date("2025-06-15T18:54:12"),
  },
];

// Mock content reports
const contentReports = [
  {
    id: "report-1",
    contentType: "review",
    contentId: "rev-45678",
    reporterId: "user-56789",
    reporterName: "Jessica Taylor",
    reason: "Offensive language",
    details: "Review contains profanity and personal attacks",
    timestamp: new Date("2025-06-16T15:23:41"),
    status: "pending",
    priority: "high",
  },
  {
    id: "report-2",
    contentType: "message",
    contentId: "msg-78901",
    reporterId: "user-67890",
    reporterName: "David Kim",
    reason: "Harassment",
    details: "User is sending threatening messages",
    timestamp: new Date("2025-06-16T14:12:05"),
    status: "pending",
    priority: "high",
  },
  {
    id: "report-3",
    contentType: "activity",
    contentId: "act-12345",
    reporterId: "user-78901",
    reporterName: "Emma Wilson",
    reason: "Misleading information",
    details: "Activity description doesn't match actual experience",
    timestamp: new Date("2025-06-16T12:45:30"),
    status: "pending",
    priority: "medium",
  },
  {
    id: "report-4",
    contentType: "profile",
    contentId: "user-34521",
    reporterId: "user-90123",
    reporterName: "Lisa Wang",
    reason: "Fake identity",
    details: "Profile appears to be using stock photos and false credentials",
    timestamp: new Date("2025-06-16T10:33:22"),
    status: "pending",
    priority: "medium",
  },
  {
    id: "report-5",
    contentType: "review",
    contentId: "rev-56789",
    reporterId: "user-12345",
    reporterName: "James Miller",
    reason: "Spam",
    details: "Review contains promotional content and external links",
    timestamp: new Date("2025-06-16T09:17:52"),
    status: "resolved",
    priority: "low",
    resolution: "Content removed",
    resolvedBy: "admin-001",
    resolvedAt: new Date("2025-06-16T10:05:12"),
  },
];

export default function UserActivityPage() {
  const [selectedTab, setSelectedTab] = useState("activity");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterUserType, setFilterUserType] = useState("");
  const [filterRiskLevel, setFilterRiskLevel] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Filter activities based on current filters
  const filteredActivities = userActivities.filter((activity) => {
    if (searchQuery && !activity.userName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !activity.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !activity.details.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !activity.action.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filterAction && activity.action !== filterAction) return false;
    if (filterUserType && activity.userType !== filterUserType) return false;
    if (filterRiskLevel && activity.riskLevel !== filterRiskLevel) return false;
    
    if (dateRange?.from && dateRange?.to && 
        (activity.timestamp < dateRange.from || activity.timestamp > dateRange.to)) {
      return false;
    }
    
    return true;
  });

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedActivities(filteredActivities.map((activity) => activity.id));
    } else {
      setSelectedActivities([]);
    }
  };

  // Handle individual checkbox selection
  const handleSelectActivity = (activityId: string, checked: boolean) => {
    if (checked) {
      setSelectedActivities([...selectedActivities, activityId]);
    } else {
      setSelectedActivities(selectedActivities.filter((id) => id !== activityId));
    }
  };

  // Get unique activity types for filter dropdown
  const activityTypes = Array.from(new Set(userActivities.map((activity) => activity.action)));

  // Get unique user types for filter dropdown
  const userTypes = Array.from(new Set(userActivities.map((activity) => activity.userType)));

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Activity Monitoring</h1>
          <p className="text-gray-500">Track and moderate user activity across the platform</p>
        </div>
      </div>

      <Tabs defaultValue="activity" onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">User Activity Log</TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged Users
            <Badge className="ml-2 bg-red-500">{flaggedUsers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="reports">
            Content Reports
            <Badge className="ml-2 bg-yellow-500">
              {contentReports.filter(report => report.status === "pending").length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        {/* User Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Log</CardTitle>
              <CardDescription>Monitor real-time user actions across the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Search by user, email or details..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select value={filterAction} onValueChange={setFilterAction}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Actions</SelectItem>
                        {activityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={filterUserType} onValueChange={setFilterUserType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All User Types</SelectItem>
                        {userTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={filterRiskLevel} onValueChange={setFilterRiskLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Risk Levels</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="Filter by date range"
                  />
                  {selectedActivities.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {selectedActivities.length} activities selected
                      </span>
                      <Button variant="outline" size="sm">
                        Export Selected
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedActivities([])}>
                        Clear Selection
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Table */}
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={
                            filteredActivities.length > 0 &&
                            selectedActivities.length === filteredActivities.length
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedActivities.includes(activity.id)}
                              onCheckedChange={(checked) =>
                                handleSelectActivity(activity.id, checked === true)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{activity.userName}</span>
                              <span className="text-xs text-gray-500">{activity.userEmail}</span>
                              <Badge variant="outline" className="mt-1 w-fit">
                                {activity.userType}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`
                                ${activity.action === "login" && "bg-blue-500"}
                                ${activity.action === "profile_update" && "bg-green-500"}
                                ${activity.action === "booking_created" && "bg-purple-500"}
                                ${activity.action === "payment_attempted" && "bg-orange-500"}
                                ${activity.action === "listing_created" && "bg-teal-500"}
                                ${activity.action === "review_posted" && "bg-indigo-500"}
                                ${activity.action === "message_sent" && "bg-cyan-500"}
                                ${activity.action === "user_banned" && "bg-red-500"}
                                ${activity.action === "payout_requested" && "bg-amber-500"}
                              `}
                            >
                              {activity.action.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[250px] truncate">
                            {activity.details}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{activity.location}</span>
                              <span className="text-xs text-gray-500">{activity.ipAddress}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{format(activity.timestamp, "MMM dd, yyyy")}</span>
                              <span className="text-xs text-gray-500">
                                {format(activity.timestamp, "HH:mm:ss")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`
                                ${activity.riskLevel === "low" && "border-green-500 text-green-500"}
                                ${activity.riskLevel === "medium" && "border-yellow-500 text-yellow-500"}
                                ${activity.riskLevel === "high" && "border-red-500 text-red-500"}
                              `}
                            >
                              {activity.riskLevel}
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
                                <DropdownMenuItem>
                                  <EyeIcon className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <History className="h-4 w-4 mr-2" />
                                  View User History
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Flag className="h-4 w-4 mr-2" />
                                  Flag User
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">
                                  <Ban className="h-4 w-4 mr-2" />
                                  Restrict User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-24">
                          No activities found matching your search criteria.
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flagged Users Tab */}
        <TabsContent value="flagged">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Users</CardTitle>
              <CardDescription>Users flagged for suspicious or policy-violating behaviors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {flaggedUsers.length > 0 ? (
                <div className="space-y-6">
                  {flaggedUsers.map((user) => (
                    <Card key={user.id} className="border border-red-200">
                      <CardHeader className="bg-red-50">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                              <span>{user.name}</span>
                            </CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{user.userType}</Badge>
                            <Badge variant="outline" className="border-gray-500 text-gray-500">
                              Member since {format(user.registrationDate, "MMM yyyy")}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold">Flagged Issues:</h3>
                          <div className="space-y-4">
                            {user.flags.map((flag) => (
                              <Alert key={flag.id} variant="destructive" className="bg-red-50 border-red-200">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <AlertTitle className="flex items-center gap-2">
                                      <span>{flag.reason}</span>
                                      <Badge
                                        variant="outline"
                                        className={`
                                          ${flag.severity === "low" && "border-blue-500 text-blue-500"}
                                          ${flag.severity === "medium" && "border-yellow-500 text-yellow-500"}
                                          ${flag.severity === "high" && "border-red-500 text-red-500"}
                                        `}
                                      >
                                        {flag.severity} severity
                                      </Badge>
                                    </AlertTitle>
                                    <AlertDescription className="mt-2">
                                      <p>{flag.details}</p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Flagged on {format(flag.timestamp, "MMM dd, yyyy 'at' HH:mm")}
                                      </p>
                                    </AlertDescription>
                                  </div>
                                </div>
                              </Alert>
                            ))}
                          </div>
                          <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline">
                              <EyeIcon className="h-4 w-4 mr-2" />
                              View User Profile
                            </Button>
                            <Button variant="outline">
                              <History className="h-4 w-4 mr-2" />
                              View Activity Log
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                  <Ban className="h-4 w-4 mr-2" />
                                  Restrict User
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Restrict User Account</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will restrict {user.name}'s account and prevent them from 
                                    making bookings, sending messages, or posting reviews. Their 
                                    current activities will remain visible but marked as restricted.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                    Restrict User
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Flagged Users</h3>
                  <p className="text-gray-500 mt-2">There are currently no flagged users requiring attention.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Content Reports</CardTitle>
              <CardDescription>User-reported content requiring moderation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between mb-4">
                <Select defaultValue="pending">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="pending">Pending Reports</SelectItem>
                    <SelectItem value="resolved">Resolved Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {contentReports.filter(report => report.status === "pending").map((report) => (
                  <Card key={report.id} className="border border-yellow-200">
                    <CardHeader className="bg-yellow-50">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Flag className="h-5 w-5 text-yellow-500" />
                            <span>
                              {report.contentType.charAt(0).toUpperCase() + report.contentType.slice(1)} Report:
                              {" "}
                              {report.reason}
                            </span>
                          </CardTitle>
                          <CardDescription>
                            Reported by {report.reporterName} • {format(report.timestamp, "MMM dd, yyyy 'at' HH:mm")}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`
                              ${report.priority === "low" && "border-blue-500 text-blue-500"}
                              ${report.priority === "medium" && "border-yellow-500 text-yellow-500"}
                              ${report.priority === "high" && "border-red-500 text-red-500"}
                            `}
                          >
                            {report.priority} priority
                          </Badge>
                          <Badge
                            variant={report.status === "pending" ? "default" : "outline"}
                            className={report.status === "pending" ? "bg-yellow-500" : ""}
                          >
                            {report.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold">Report Details</h3>
                            <p className="mt-2">{report.details}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold">Content Information</h3>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="text-gray-500">Content Type:</div>
                              <div>{report.contentType.charAt(0).toUpperCase() + report.contentType.slice(1)}</div>
                              <div className="text-gray-500">Content ID:</div>
                              <div className="font-mono text-sm">{report.contentId}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline">
                            <EyeIcon className="h-4 w-4 mr-2" />
                            View Content
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">
                                <UserX className="h-4 w-4 mr-2" />
                                Remove Content
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Reported Content</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove the reported content and notify both the content creator and the reporter
                                  of your decision. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                  Remove Content
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Button variant="default">Mark as Resolved</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {contentReports.filter(report => report.status === "pending").length === 0 && (
                  <div className="text-center py-10">
                    <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Pending Reports</h3>
                    <p className="text-gray-500 mt-2">There are currently no content reports requiring attention.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
