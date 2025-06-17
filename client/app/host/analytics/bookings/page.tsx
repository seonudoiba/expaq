"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Calendar,
  Clock,
  Users,
  CalendarDays,
  CheckCircle,
  XCircle,
  Filter,
  Download
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Mock booking analysis data
const bookingTrend = [
  { month: "Jan", bookings: 12, cancellations: 1 },
  { month: "Feb", bookings: 15, cancellations: 2 },
  { month: "Mar", bookings: 18, cancellations: 1 },
  { month: "Apr", bookings: 22, cancellations: 3 },
  { month: "May", bookings: 28, cancellations: 2 },
  { month: "Jun", bookings: 32, cancellations: 4 },
];

const bookingStatusData = [
  { name: "Confirmed", value: 68, color: "#22c55e" },
  { name: "Upcoming", value: 24, color: "#3b82f6" },
  { name: "Cancelled", value: 8, color: "#ef4444" },
];

const bookingAdvanceData = [
  { name: "Same day", value: 5 },
  { name: "1-3 days", value: 15 },
  { name: "4-7 days", value: 25 },
  { name: "1-2 weeks", value: 32 },
  { name: "2-4 weeks", value: 18 },
  { name: "1+ month", value: 5 },
];

const dayOfWeekData = [
  { name: "Mon", value: 8 },
  { name: "Tue", value: 10 },
  { name: "Wed", value: 12 },
  { name: "Thu", value: 14 },
  { name: "Fri", value: 18 },
  { name: "Sat", value: 24 },
  { name: "Sun", value: 22 },
];

const groupSizeData = [
  { name: "1 person", value: 12 },
  { name: "2 people", value: 38 },
  { name: "3-4 people", value: 28 },
  { name: "5-8 people", value: 16 },
  { name: "9+ people", value: 6 },
];

const upcomingBookingsData = [
  {
    id: "bk-2345",
    date: "2025-06-25",
    time: "10:00 AM",
    activity: "City Walking Tour",
    participants: 3,
    customer: "John Smith",
    status: "confirmed",
  },
  {
    id: "bk-2346",
    date: "2025-06-27",
    time: "2:00 PM",
    activity: "Wine Tasting Experience",
    participants: 4,
    customer: "Emma Johnson",
    status: "confirmed",
  },
  {
    id: "bk-2347",
    date: "2025-06-28",
    time: "9:00 AM",
    activity: "Mountain Hiking Tour",
    participants: 5,
    customer: "Mike Anderson",
    status: "pending",
  },
  {
    id: "bk-2348",
    date: "2025-06-30",
    time: "6:00 PM",
    activity: "Sunset Sailing Experience",
    participants: 2,
    customer: "Sarah Williams",
    status: "confirmed",
  },
  {
    id: "bk-2349",
    date: "2025-07-02",
    time: "11:30 AM",
    activity: "Cooking Masterclass",
    participants: 2,
    customer: "David Brown",
    status: "confirmed",
  },
];

const recentCancellationsData = [
  {
    id: "bk-2320",
    date: "2025-06-15",
    activity: "Photography Workshop",
    reason: "Personal emergency",
    participants: 1,
    customer: "James Wilson",
  },
  {
    id: "bk-2335",
    date: "2025-06-12",
    activity: "City Walking Tour",
    reason: "Weather conditions",
    participants: 3,
    customer: "Lisa Taylor",
  },
  {
    id: "bk-2332",
    date: "2025-06-10",
    activity: "Wine Tasting Experience",
    reason: "Changed travel plans",
    participants: 2,
    customer: "Robert Miller",
  },
];

export default function BookingAnalytics() {
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState("90days");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 152,
    bookingsChange: 14.7,
    completionRate: 92,
    completionChange: 3.5,
    cancellationRate: 8,
    cancellationChange: -2.3,
    averageGroupSize: 2.7,
    groupSizeChange: 0.3,
  });

  // Simulate loading data
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);
  
  // Format a date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    setIsLoading(true);
    
    // In a real app, you would fetch new data based on the time range
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings Analysis</h1>
          <p className="text-muted-foreground">
            Track your activity bookings and identify trends
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export Report
          </Button>
          
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time Range</SelectLabel>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last 12 Months</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <div className="flex items-center text-xs text-muted-foreground pt-1">
                  {stats.bookingsChange > 0 ? (
                    <>
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">{stats.bookingsChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-500 font-medium">{Math.abs(stats.bookingsChange)}%</span>
                    </>
                  )}
                  <span className="ml-1">vs previous period</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.completionRate}%</div>
                <div className="flex items-center text-xs text-muted-foreground pt-1">
                  {stats.completionChange > 0 ? (
                    <>
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">{stats.completionChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-500 font-medium">{Math.abs(stats.completionChange)}%</span>
                    </>
                  )}
                  <span className="ml-1">vs previous period</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Cancellation Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancellation Rate</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.cancellationRate}%</div>
                <div className="flex items-center text-xs text-muted-foreground pt-1">
                  {stats.cancellationChange < 0 ? (
                    <>
                      <ArrowDownIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">{Math.abs(stats.cancellationChange)}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-500 font-medium">{stats.cancellationChange}%</span>
                    </>
                  )}
                  <span className="ml-1">vs previous period</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Average Group Size */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Group Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.averageGroupSize}</div>
                <div className="flex items-center text-xs text-muted-foreground pt-1">
                  {stats.groupSizeChange > 0 ? (
                    <>
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">+{stats.groupSizeChange}</span>
                    </>
                  ) : stats.groupSizeChange < 0 ? (
                    <>
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-500 font-medium">{Math.abs(stats.groupSizeChange)}</span>
                    </>
                  ) : (
                    <span>No change</span>
                  )}
                  <span className="ml-1">vs previous period</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Booking Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Trends</CardTitle>
          <CardDescription>Monthly booking and cancellation rates</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={bookingTrend} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" name="Bookings" fill="#3b82f6" />
                <Line type="monotone" dataKey="cancellations" name="Cancellations" stroke="#ef4444" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Booking Analysis Tabs */}
      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Booking Status</TabsTrigger>
          <TabsTrigger value="advance">Booking Timing</TabsTrigger>
          <TabsTrigger value="weekday">Day of Week</TabsTrigger>
          <TabsTrigger value="groupsize">Group Size</TabsTrigger>
        </TabsList>
        
        {/* Booking Status */}
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Status Distribution</CardTitle>
              <CardDescription>Breakdown of your booking statuses</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {bookingStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} bookings`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Your cancellation rate is 2% lower than the marketplace average.
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Booking Advance */}
        <TabsContent value="advance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How Far in Advance People Book</CardTitle>
              <CardDescription>Time between booking and activity date</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingAdvanceData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}% of bookings`} />
                    <Legend />
                    <Bar dataKey="value" name="% of Bookings" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Most bookings are made 1-2 weeks in advance, consider offering early-bird discounts.
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Day of Week */}
        <TabsContent value="weekday" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bookings by Day of Week</CardTitle>
              <CardDescription>When your activities are most popular</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dayOfWeekData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}% of bookings`} />
                    <Legend />
                    <Bar dataKey="value" name="% of Bookings" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Weekend bookings account for 46% of all your activity bookings.
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Group Size */}
        <TabsContent value="groupsize" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bookings by Group Size</CardTitle>
              <CardDescription>Distribution of participant group sizes</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={groupSizeData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}% of bookings`} />
                    <Legend />
                    <Bar dataKey="value" name="% of Bookings" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Couples (2 people) represent your largest booking segment.
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your scheduled activities</CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Bookings</h4>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Date Range</h5>
                  <div className="flex flex-col space-y-2">
                    <CalendarComponent
                      mode="range"
                      numberOfMonths={1}
                      className="rounded-md border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Activities</h5>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activities</SelectItem>
                      <SelectItem value="walking-tour">City Walking Tour</SelectItem>
                      <SelectItem value="wine-tasting">Wine Tasting Experience</SelectItem>
                      <SelectItem value="cooking">Cooking Masterclass</SelectItem>
                      <SelectItem value="hiking">Mountain Hiking Tour</SelectItem>
                      <SelectItem value="sailing">Sunset Sailing Experience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button size="sm">Apply Filters</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingBookingsData.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {formatDate(booking.date)}
                      <div className="text-xs text-muted-foreground">{booking.time}</div>
                    </TableCell>
                    <TableCell>{booking.activity}</TableCell>
                    <TableCell>{booking.customer}</TableCell>
                    <TableCell>{booking.participants}</TableCell>
                    <TableCell>
                      {booking.status === "confirmed" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900">
                          Confirmed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-900">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="outline">View All Bookings</Button>
        </CardFooter>
      </Card>

      {/* Recent Cancellations */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Cancellations</CardTitle>
          <CardDescription>Analysis of booking cancellations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCancellationsData.map((cancellation) => (
                    <TableRow key={cancellation.id}>
                      <TableCell className="font-medium">
                        {formatDate(cancellation.date)}
                      </TableCell>
                      <TableCell>{cancellation.activity}</TableCell>
                      <TableCell>{cancellation.customer}</TableCell>
                      <TableCell>{cancellation.participants}</TableCell>
                      <TableCell>{cancellation.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Cancellation Reasons</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm">Personal emergency</div>
                      <div className="text-sm">40%</div>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                      <div className="h-2 bg-red-500 rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm">Weather conditions</div>
                      <div className="text-sm">30%</div>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                      <div className="h-2 bg-red-500 rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm">Changed travel plans</div>
                      <div className="text-sm">20%</div>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                      <div className="h-2 bg-red-500 rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm">Other reasons</div>
                      <div className="text-sm">10%</div>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                      <div className="h-2 bg-red-500 rounded-full" style={{ width: '10%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
