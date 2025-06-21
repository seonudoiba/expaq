"use client";

import { useState } from "react";
import { 
  Line,
  LineChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertCircle, Download, FilterIcon, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for reviews analytics
const ratingOverTimeData = [
  { month: "Jan", average: 4.5 },
  { month: "Feb", average: 4.6 },
  { month: "Mar", average: 4.7 },
  { month: "Apr", average: 4.6 },
  { month: "May", average: 4.8 },
  { month: "Jun", average: 4.9 },
  { month: "Jul", average: 4.7 },
  { month: "Aug", average: 4.8 },
  { month: "Sep", average: 4.6 },
  { month: "Oct", average: 4.7 },
  { month: "Nov", average: 4.8 },
  { month: "Dec", average: 4.9 }
];

const ratingDistributionData = [
  { rating: "5 stars", count: 186, percentage: 72 },
  { rating: "4 stars", count: 54, percentage: 21 },
  { rating: "3 stars", count: 12, percentage: 5 },
  { rating: "2 stars", count: 3, percentage: 1 },
  { rating: "1 star", count: 3, percentage: 1 }
];

const activityRatingsData = [
  { name: "Cooking Class", rating: 4.9 },
  { name: "City Tour", rating: 4.7 },
  { name: "Wine Tasting", rating: 4.8 },
  { name: "Language Exchange", rating: 4.6 },
  { name: "Art Workshop", rating: 4.5 }
];

const categoryRatingsData = [
  { subject: "Accuracy", A: 4.8, fullMark: 5 },
  { subject: "Communication", A: 4.9, fullMark: 5 },
  { subject: "Value", A: 4.7, fullMark: 5 },
  { subject: "Experience", A: 4.8, fullMark: 5 },
  { subject: "Cleanliness", A: 4.6, fullMark: 5 }
];

const recentReviews = [
  { 
    id: 1, 
    reviewer: "Sarah Johnson", 
    avatar: "/default.png",
    activity: "Cooking Class", 
    date: "2023-10-14", 
    rating: 5, 
    comment: "Absolutely fantastic experience! The chef was so knowledgeable and made the class both educational and fun. Would definitely recommend to anyone interested in learning authentic local cuisine." 
  },
  { 
    id: 2, 
    reviewer: "Michael Brown", 
    avatar: "/default.png",
    activity: "City Tour", 
    date: "2023-10-12", 
    rating: 4, 
    comment: "Great tour with lots of interesting information about the city's history. The guide was very friendly and knowledgeable. The only reason for 4 stars instead of 5 is that the tour ran a bit long and we were quite tired by the end." 
  },
  { 
    id: 3, 
    reviewer: "Emma Garcia", 
    avatar: "/default.png",
    activity: "Wine Tasting", 
    date: "2023-10-09", 
    rating: 5, 
    comment: "An incredible experience from start to finish. The selection of wines was excellent and the sommelier was extremely knowledgeable. The venue was also beautiful with amazing views. Can't wait to come back!" 
  },
  { 
    id: 4, 
    reviewer: "David Wilson", 
    avatar: "/default.png",
    activity: "Language Exchange", 
    date: "2023-10-07", 
    rating: 5, 
    comment: "Such a fun way to practice language skills! The host created a welcoming environment where everyone felt comfortable speaking. I met some great people and improved my conversation skills significantly." 
  },
  { 
    id: 5, 
    reviewer: "Lisa Chen", 
    avatar: "/default.png",
    activity: "Art Workshop", 
    date: "2023-10-05", 
    rating: 3, 
    comment: "The instructor was knowledgeable, but the class was a bit too advanced for beginners. I struggled to keep up with some of the techniques. Would recommend having separate classes for different skill levels." 
  }
];

// Helper function to render star ratings
const renderStarRating = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star 
        key={i} 
        className={`h-4 w-4 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "fill-none text-gray-300"}`}
      />
    );
  }
  return <div className="flex">{stars}</div>;
};

export default function ReviewsAnalytics() {
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [activityFilter, setActivityFilter] = useState<string>("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews & Ratings</h1>
          <p className="text-muted-foreground">
            Monitor feedback, ratings trends, and review management
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-1">
                <FilterIcon className="h-4 w-4" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Date Range</h4>
                  <Calendar
                    mode="single"
                    selected={dateRange}
                    onSelect={setDateRange}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Activity</h4>
                  <Select value={activityFilter} onValueChange={setActivityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activities</SelectItem>
                      <SelectItem value="cooking">Cooking Class</SelectItem>
                      <SelectItem value="tour">City Tour</SelectItem>
                      <SelectItem value="wine">Wine Tasting</SelectItem>
                      <SelectItem value="language">Language Exchange</SelectItem>
                      <SelectItem value="art">Art Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Apply Filters</Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button size="sm" variant="outline" className="flex gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">+0.2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">258</div>
            <p className="text-xs text-muted-foreground">+34 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">5-Star Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different review analytics views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="distribution">Rating Distribution</TabsTrigger>
          <TabsTrigger value="activities">Activity Ratings</TabsTrigger>
          <TabsTrigger value="recent">Recent Reviews</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Rating Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Rating Trends</CardTitle>
                <CardDescription>
                  Average rating over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ratingOverTimeData}>
                    <XAxis dataKey="month" stroke="#888888" />
                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} stroke="#888888" />
                    <Tooltip />
                    <Line type="monotone" dataKey="average" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Ratings */}
            <Card>
              <CardHeader>
                <CardTitle>Category Ratings</CardTitle>
                <CardDescription>
                  Detailed ratings across different categories
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryRatingsData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 5]} />
                    <Radar name="Rating" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rating Summary</CardTitle>
              <CardDescription>
                Distribution of all ratings received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ratingDistributionData.map(item => (
                  <div key={item.rating} className="flex items-center">
                    <div className="w-16 text-sm">{item.rating}</div>
                    <div className="w-full">
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                    <div className="w-12 text-sm text-right">{item.count}</div>
                    <div className="w-12 text-sm text-right text-muted-foreground">
                      {item.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sentiment Analysis</CardTitle>
                <CardDescription>
                  Key topics and sentiment from reviews
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excellent food (+43)</Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Friendly host (+38)</Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Worth the money (+35)</Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Great location (+27)</Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Learned a lot (+23)</Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Authentic experience (+21)</Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Good organization (+18)</Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Beautiful venue (+15)</Badge>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Time management (-7)</Badge>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Group size (-5)</Badge>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Parking issues (-4)</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rating Distribution Tab */}
        <TabsContent value="distribution">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>
                  Breakdown of ratings by star level
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ratingDistributionData}>
                    <XAxis dataKey="rating" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution Percentage</CardTitle>
                <CardDescription>
                  Percentage breakdown of all ratings
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ratingDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="percentage"
                      nameKey="rating"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {ratingDistributionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            index === 0 ? "#4f46e5" : 
                            index === 1 ? "#8b5cf6" : 
                            index === 2 ? "#a78bfa" : 
                            index === 3 ? "#c4b5fd" : "#d8b4fe"
                          } 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Rating Distribution</CardTitle>
              <CardDescription>
                How rating distribution has changed over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={[
                    { month: "Jul", "5 stars": 45, "4 stars": 15, "3 stars": 3, "2 stars": 2, "1 star": 1 },
                    { month: "Aug", "5 stars": 52, "4 stars": 12, "3 stars": 4, "2 stars": 0, "1 star": 1 },
                    { month: "Sep", "5 stars": 48, "4 stars": 14, "3 stars": 3, "2 stars": 1, "1 star": 0 },
                    { month: "Oct", "5 stars": 41, "4 stars": 13, "3 stars": 2, "2 stars": 0, "1 star": 1 }
                  ]}
                  layout="vertical"
                  stackOffset="expand"
                >
                  <XAxis type="number" tickFormatter={(value) => `${Math.round(value * 100)}%`} />
                  <YAxis type="category" dataKey="month" />
                  <Tooltip
                    formatter={(value, name) => [`${Math.round(Number(value) * 100)}%`, name]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="5 stars" stackId="a" fill="#4f46e5" />
                  <Bar dataKey="4 stars" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="3 stars" stackId="a" fill="#a78bfa" />
                  <Bar dataKey="2 stars" stackId="a" fill="#c4b5fd" />
                  <Bar dataKey="1 star" stackId="a" fill="#d8b4fe" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Ratings Tab */}
        <TabsContent value="activities">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activity Comparison</CardTitle>
                <CardDescription>
                  Rating comparison across all activities
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityRatingsData} layout="vertical">
                    <XAxis type="number" domain={[0, 5]} tickCount={6} />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="rating" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Rating Trends</CardTitle>
                <CardDescription>
                  How ratings for each activity have changed over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart 
                    data={[
                      { month: "Jul", "Cooking Class": 4.8, "City Tour": 4.6, "Wine Tasting": 4.7, "Language Exchange": 4.5, "Art Workshop": 4.4 },
                      { month: "Aug", "Cooking Class": 4.9, "City Tour": 4.6, "Wine Tasting": 4.8, "Language Exchange": 4.5, "Art Workshop": 4.4 },
                      { month: "Sep", "Cooking Class": 4.8, "City Tour": 4.7, "Wine Tasting": 4.7, "Language Exchange": 4.6, "Art Workshop": 4.5 },
                      { month: "Oct", "Cooking Class": 4.9, "City Tour": 4.7, "Wine Tasting": 4.8, "Language Exchange": 4.6, "Art Workshop": 4.5 }
                    ]}
                  >
                    <XAxis dataKey="month" stroke="#888888" />
                    <YAxis domain={[4, 5]} ticks={[4, 4.2, 4.4, 4.6, 4.8, 5]} stroke="#888888" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Cooking Class" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="City Tour" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Wine Tasting" stroke="#a78bfa" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Language Exchange" stroke="#c4b5fd" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Art Workshop" stroke="#d8b4fe" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activity Rating Details</CardTitle>
              <CardDescription>
                Detailed rating information for all activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead>Average Rating</TableHead>
                    <TableHead>Total Reviews</TableHead>
                    <TableHead>5-Star Reviews</TableHead>
                    <TableHead>Recent Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Cooking Class</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        4.9
                        {renderStarRating(4.9)}
                      </div>
                    </TableCell>
                    <TableCell>78</TableCell>
                    <TableCell>92%</TableCell>
                    <TableCell className="text-green-600">↑ Improving</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">City Tour</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        4.7
                        {renderStarRating(4.7)}
                      </div>
                    </TableCell>
                    <TableCell>65</TableCell>
                    <TableCell>74%</TableCell>
                    <TableCell className="text-green-600">↑ Improving</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Wine Tasting</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        4.8
                        {renderStarRating(4.8)}
                      </div>
                    </TableCell>
                    <TableCell>53</TableCell>
                    <TableCell>85%</TableCell>
                    <TableCell className="text-green-600">↑ Improving</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Language Exchange</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        4.6
                        {renderStarRating(4.6)}
                      </div>
                    </TableCell>
                    <TableCell>42</TableCell>
                    <TableCell>64%</TableCell>
                    <TableCell className="text-gray-500">→ Stable</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Art Workshop</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        4.5
                        {renderStarRating(4.5)}
                      </div>
                    </TableCell>
                    <TableCell>20</TableCell>
                    <TableCell>60%</TableCell>
                    <TableCell className="text-green-600">↑ Improving</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Reviews Tab */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>
                Your latest customer reviews and feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentReviews.map(review => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.reviewer.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.reviewer}</div>
                          <div className="text-sm text-muted-foreground">{review.activity}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div>{renderStarRating(review.rating)}</div>
                        <div className="text-sm text-muted-foreground">{review.date}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">{review.comment}</p>
                    </div>
                    {review.rating < 4 && (
                      <div className="mt-4 flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-500">Attention needed</p>
                          <p className="text-xs text-muted-foreground">This review may require your response</p>
                        </div>
                      </div>
                    )}
                    <div className="mt-4">
                      <Button variant="secondary" size="sm">Respond</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
