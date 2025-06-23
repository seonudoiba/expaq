"use client";

import { useState } from "react";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  Tooltip,
  Legend,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, FilterIcon, TrendingUp, BarChart3 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock data for performance analytics
const activityPerformanceData = [
  { name: "Cooking Class", bookingRate: 87, occupancyRate: 94, repeatRate: 42, revenuePerSlot: 156 },
  { name: "City Tour", bookingRate: 78, occupancyRate: 85, repeatRate: 38, revenuePerSlot: 132 },
  { name: "Wine Tasting", bookingRate: 92, occupancyRate: 96, repeatRate: 46, revenuePerSlot: 175 },
  { name: "Language Exchange", bookingRate: 64, occupancyRate: 72, repeatRate: 28, revenuePerSlot: 95 },
  { name: "Art Workshop", bookingRate: 72, occupancyRate: 78, repeatRate: 32, revenuePerSlot: 110 }
];

const timeComparisonData = [
  { month: "Jul", thisYear: 82, lastYear: 70 },
  { month: "Aug", thisYear: 85, lastYear: 72 },
  { month: "Sep", thisYear: 89, lastYear: 75 },
  { month: "Oct", thisYear: 92, lastYear: 78 },
  { month: "Nov", thisYear: 94, lastYear: 82 },
  { month: "Dec", thisYear: 96, lastYear: 84 }
];

const cancellationReasonsData = [
  { reason: "Schedule conflict", value: 42, color: "#4f46e5" },
  { reason: "Weather issues", value: 21, color: "#8b5cf6" },
  { reason: "Changed plans", value: 15, color: "#a78bfa" },
  { reason: "Cost concerns", value: 12, color: "#c4b5fd" },
  { reason: "Health issues", value: 8, color: "#d8b4fe" },
  { reason: "Other", value: 2, color: "#eee" }
];

const positiveFactorsData = [
  { factor: "Description accuracy", score: 92 },
  { factor: "Photo quality", score: 88 },
  { factor: "Price point", score: 76 },
  { factor: "Host profile", score: 84 },
  { factor: "Review count", score: 95 },
  { factor: "Availability", score: 82 }
];

const competitorComparisonData = [
  { subject: "Booking Rate", activity: 85, marketAvg: 72, topPerformer: 94 },
  { subject: "Price Point", activity: 78, marketAvg: 76, topPerformer: 82 },
  { subject: "Rating", activity: 92, marketAvg: 84, topPerformer: 98 },
  { subject: "Repeat Bookings", activity: 38, marketAvg: 32, topPerformer: 46 },
  { subject: "Visibility Score", activity: 76, marketAvg: 68, topPerformer: 88 }
];

export default function PerformanceAnalytics() {
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [activityFilter, setActivityFilter] = useState<string>("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Performance</h1>
          <p className="text-muted-foreground">
            Analyze key performance metrics and optimization opportunities
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
            <CardTitle className="text-sm font-medium">Average Booking Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.6%</div>
            <p className="text-xs text-muted-foreground">+6.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">+3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Booking Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">37.2%</div>
            <p className="text-xs text-muted-foreground">+2.8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Revenue/Slot</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$133.60</div>
            <p className="text-xs text-muted-foreground">+$12.40 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different performance analytics views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activity Comparison</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Activity Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by Activity</CardTitle>
                <CardDescription>
                  Booking rate comparison across your activities
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityPerformanceData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(value) => [`${value}%`, "Booking Rate"]} />
                    <Bar dataKey="bookingRate" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Year-over-Year Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Year-over-Year Performance</CardTitle>
                <CardDescription>
                  Comparison of booking rates with previous year
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeComparisonData}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Legend />
                    <Line type="monotone" dataKey="thisYear" name="This Year" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="lastYear" name="Last Year" stroke="#c4b5fd" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Cancellation Reasons */}
            <Card>
              <CardHeader>
                <CardTitle>Cancellation Reasons</CardTitle>
                <CardDescription>
                  Primary reasons for booking cancellations
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={cancellationReasonsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="reason"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {cancellationReasonsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Market Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Market Comparison</CardTitle>
                <CardDescription>
                  How your activities compare to the market
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart outerRadius={90} data={competitorComparisonData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Your Activities" dataKey="activity" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                    <Radar name="Market Average" dataKey="marketAvg" stroke="#c4b5fd" fill="#c4b5fd" fillOpacity={0.6} />
                    <Radar name="Top Performer" dataKey="topPerformer" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activities Comparison Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Performance Metrics</CardTitle>
              <CardDescription>
                Detailed metrics for all your activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead className="text-right">Booking Rate</TableHead>
                    <TableHead className="text-right">Occupancy Rate</TableHead>
                    <TableHead className="text-right">Repeat Rate</TableHead>
                    <TableHead className="text-right">Revenue/Slot</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityPerformanceData.map((activity) => (
                    <TableRow key={activity.name}>
                      <TableCell className="font-medium">{activity.name}</TableCell>
                      <TableCell className="text-right">{activity.bookingRate}%</TableCell>
                      <TableCell className="text-right">{activity.occupancyRate}%</TableCell>
                      <TableCell className="text-right">{activity.repeatRate}%</TableCell>
                      <TableCell className="text-right">${activity.revenuePerSlot}</TableCell>
                      <TableCell>
                        {activity.bookingRate >= 85 ? (
                          <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                        ) : activity.bookingRate >= 70 ? (
                          <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                        ) : activity.bookingRate >= 60 ? (
                          <Badge className="bg-amber-100 text-amber-800">Average</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Performance Ranking */}
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Rate by Activity</CardTitle>
                <CardDescription>
                  Percentage of available slots filled
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityPerformanceData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Occupancy Rate"]} />
                    <Bar dataKey="occupancyRate" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue per Slot */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue per Slot</CardTitle>
                <CardDescription>
                  Average revenue generated per slot
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityPerformanceData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 200]} />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue per Slot"]} />
                    <Bar dataKey="revenuePerSlot" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Rate Trends</CardTitle>
              <CardDescription>
                How booking rates have changed over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart 
                  data={[
                    { month: "Jul", "Cooking Class": 82, "City Tour": 75, "Wine Tasting": 88, "Language Exchange": 59, "Art Workshop": 66 },
                    { month: "Aug", "Cooking Class": 84, "City Tour": 76, "Wine Tasting": 90, "Language Exchange": 60, "Art Workshop": 68 },
                    { month: "Sep", "Cooking Class": 85, "City Tour": 77, "Wine Tasting": 91, "Language Exchange": 62, "Art Workshop": 70 },
                    { month: "Oct", "Cooking Class": 87, "City Tour": 78, "Wine Tasting": 92, "Language Exchange": 64, "Art Workshop": 72 }
                  ]}
                >
                  <XAxis dataKey="month" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
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
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Weekly Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Day of Week Performance</CardTitle>
                <CardDescription>
                  Booking rates by day of week
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={[
                      { day: "Mon", rate: 65 },
                      { day: "Tue", rate: 68 },
                      { day: "Wed", rate: 72 },
                      { day: "Thu", rate: 76 },
                      { day: "Fri", rate: 86 },
                      { day: "Sat", rate: 94 },
                      { day: "Sun", rate: 88 },
                    ]}
                  >
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Booking Rate"]} />
                    <Bar dataKey="rate" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Time of Day Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Time of Day Performance</CardTitle>
                <CardDescription>
                  Booking rates by time of day
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={[
                      { time: "Morning", rate: 82 },
                      { time: "Afternoon", rate: 88 },
                      { time: "Evening", rate: 76 },
                      { time: "Night", rate: 62 },
                    ]}
                  >
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Booking Rate"]} />
                    <Bar dataKey="rate" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Factors</CardTitle>
              <CardDescription>
                Factors that positively impact booking rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positiveFactorsData.map(factor => (
                  <div key={factor.factor} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{factor.factor}</span>
                      <span className="text-sm text-muted-foreground">{factor.score}%</span>
                    </div>
                    <Progress value={factor.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Price Optimization */}
            <Card>
              <CardHeader>
                <CardTitle>Price Optimization</CardTitle>
                <CardDescription>
                  Impact of price on booking rate
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart 
                    data={[
                      { price: "$80", rate: 95 },
                      { price: "$100", rate: 92 },
                      { price: "$120", rate: 84 },
                      { price: "$140", rate: 75 },
                      { price: "$160", rate: 65 },
                      { price: "$180", rate: 52 },
                      { price: "$200", rate: 42 },
                    ]}
                  >
                    <XAxis dataKey="price" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Booking Rate"]} />
                    <Line type="monotone" dataKey="rate" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Slot Optimization */}
            <Card>
              <CardHeader>
                <CardTitle>Slot Utilization</CardTitle>
                <CardDescription>
                  Optimal number of slots per activity
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart 
                    data={[
                      { slots: "4", rate: 72, revenue: 400 },
                      { slots: "6", rate: 78, revenue: 600 },
                      { slots: "8", rate: 85, revenue: 800 },
                      { slots: "10", rate: 82, revenue: 920 },
                      { slots: "12", rate: 76, revenue: 960 },
                      { slots: "14", rate: 68, revenue: 920 },
                      { slots: "16", rate: 62, revenue: 880 },
                    ]}
                  >
                    <XAxis dataKey="slots" />
                    <YAxis yAxisId="left" domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 1000]} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="rate" name="Booking Rate (%)" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>
                Suggestions to improve performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Potential Impact</TableHead>
                    <TableHead>Difficulty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Cooking Class</TableCell>
                    <TableCell>Add more high-quality photos of the cooking process and results</TableCell>
                    <TableCell>+4% booking rate</TableCell>
                    <TableCell><Badge className="bg-green-100 text-green-800">Low</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">City Tour</TableCell>
                    <TableCell>Optimize price point from $140 to $125</TableCell>
                    <TableCell>+6% booking rate</TableCell>
                    <TableCell><Badge className="bg-green-100 text-green-800">Low</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Wine Tasting</TableCell>
                    <TableCell>Add more evening slots on weekends</TableCell>
                    <TableCell>+$320/week revenue</TableCell>
                    <TableCell><Badge className="bg-amber-100 text-amber-800">Medium</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Language Exchange</TableCell>
                    <TableCell>Improve description clarity and add learning outcomes</TableCell>
                    <TableCell>+8% booking rate</TableCell>
                    <TableCell><Badge className="bg-green-100 text-green-800">Low</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Art Workshop</TableCell>
                    <TableCell>Create beginner-friendly version with materials included</TableCell>
                    <TableCell>+12% booking rate</TableCell>
                    <TableCell><Badge className="bg-red-100 text-red-800">High</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
