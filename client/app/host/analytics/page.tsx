"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  Calendar, 
  Users, 
  DollarSign, 
  Star, 
  Clock, 
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "recharts";

// Mock data until you connect to real API
const revenueData = [
  { name: "Jan", value: 4200 },
  { name: "Feb", value: 3800 },
  { name: "Mar", value: 5200 },
  { name: "Apr", value: 6100 },
  { name: "May", value: 7300 },
  { name: "Jun", value: 8200 },
  { name: "Jul", value: 9100 },
  { name: "Aug", value: 7800 },
];

const bookingsData = [
  { name: "Jan", value: 12 },
  { name: "Feb", value: 9 },
  { name: "Mar", value: 14 },
  { name: "Apr", value: 17 },
  { name: "May", value: 22 },
  { name: "Jun", value: 25 },
  { name: "Jul", value: 28 },
  { name: "Aug", value: 24 },
];

const participantsData = [
  { name: "Jan", value: 32 },
  { name: "Feb", value: 28 },
  { name: "Mar", value: 41 },
  { name: "Apr", value: 52 },
  { name: "May", value: 64 },
  { name: "Jun", value: 71 },
  { name: "Jul", value: 82 },
  { name: "Aug", value: 69 },
];

const reviewsData = [
  { name: "5 Stars", value: 64, color: "#22c55e" },
  { name: "4 Stars", value: 28, color: "#84cc16" },
  { name: "3 Stars", value: 6, color: "#facc15" },
  { name: "2 Stars", value: 1, color: "#f97316" },
  { name: "1 Star", value: 1, color: "#ef4444" },
];

const activityData = [
  { name: "City Tour", bookings: 42, revenue: 4200, rating: 4.8 },
  { name: "Cooking Class", bookings: 28, revenue: 2800, rating: 4.9 },
  { name: "Wine Tasting", bookings: 35, revenue: 3500, rating: 4.7 },
  { name: "Hiking Trip", bookings: 18, revenue: 1800, rating: 4.5 },
];

const regionData = [
  { name: "North America", value: 48 },
  { name: "Europe", value: 32 },
  { name: "Asia", value: 14 },
  { name: "Other", value: 6 },
];

export default function AnalyticsDashboard() {
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState("90days");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 52800,
    revenueChange: 12.4,
    totalBookings: 152,
    bookingsChange: 8.7,
    totalParticipants: 428,
    participantsChange: 15.2,
    averageRating: 4.8,
    ratingChange: 0.2,
    completionRate: 94.3,
    completionChange: 1.5,
  });

  // Simulate loading data
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);
  
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
          <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>
          <p className="text-muted-foreground">
            Comprehensive insights and metrics for your hosting business
          </p>
        </div>
        
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                <div className="flex items-center text-xs text-muted-foreground pt-1">
                  {stats.revenueChange > 0 ? (
                    <>
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">{stats.revenueChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-500 font-medium">{Math.abs(stats.revenueChange)}%</span>
                    </>
                  )}
                  <span className="ml-1">vs previous period</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

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

        {/* Total Participants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalParticipants}</div>
                <div className="flex items-center text-xs text-muted-foreground pt-1">
                  {stats.participantsChange > 0 ? (
                    <>
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">{stats.participantsChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-500 font-medium">{Math.abs(stats.participantsChange)}%</span>
                    </>
                  )}
                  <span className="ml-1">vs previous period</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.averageRating} / 5.0</div>
                <div className="flex items-center text-xs text-muted-foreground pt-1">
                  {stats.ratingChange > 0 ? (
                    <>
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">+{stats.ratingChange}</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-500 font-medium">-{Math.abs(stats.ratingChange)}</span>
                    </>
                  )}
                  <span className="ml-1">vs previous period</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        {/* Revenue Chart */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Track your earnings over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0088FE" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="value"
                      name="Revenue"
                      stroke="#0088FE"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="ghost" className="gap-1">
                Revenue Details <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Bookings Chart */}
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Trends</CardTitle>
              <CardDescription>Track your booking volume over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Bookings" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="ghost" className="gap-1">
                Booking Details <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Participants Chart */}
        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Participant Trends</CardTitle>
              <CardDescription>Track participant numbers over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={participantsData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Participants"
                      stroke="#FFBB28"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="ghost" className="gap-1">
                Participant Details <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Reviews Chart */}
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ratings Distribution</CardTitle>
              <CardDescription>Breakdown of ratings by star count</CardDescription>
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
                      data={reviewsData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {reviewsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} ratings`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="ghost" className="gap-1">
                Review Details <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Activity Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Activities</CardTitle>
              <CardDescription>Your best performing experiences</CardDescription>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-4 text-xs font-medium text-muted-foreground pb-1">
                  <div>Activity</div>
                  <div className="text-right">Bookings</div>
                  <div className="text-right">Revenue</div>
                  <div className="text-right">Rating</div>
                </div>
                {activityData.map((activity, i) => (
                  <div key={i} className="grid grid-cols-4 items-center py-3 border-t">
                    <div className="font-medium">{activity.name}</div>
                    <div className="text-right">{activity.bookings}</div>
                    <div className="text-right">{formatCurrency(activity.revenue)}</div>
                    <div className="text-right flex items-center justify-end">
                      {activity.rating}
                      <Star className="h-3 w-3 fill-primary text-primary ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Participant Demographics</CardTitle>
              <CardDescription>Regions where your participants come from</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[250px] flex items-center justify-center">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {regionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Completion Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Activity Completion Rate</CardTitle>
            <CardDescription>Percentage of bookings that successfully completed</CardDescription>
          </div>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">{stats.completionRate}%</div>
              <div className="flex items-center text-sm text-muted-foreground pt-1">
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
              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full mt-4">
                <div 
                  className="h-2 bg-primary rounded-full" 
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
