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
  Bar,
  BarChart,
  Cell,
  Area,
  AreaChart,
  CartesianGrid
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Download, FilterIcon, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for seasonal trends
const monthlyTrendsData = [
  { month: "Jan", bookings: 82, revenue: 12300 },
  { month: "Feb", bookings: 94, revenue: 14100 },
  { month: "Mar", bookings: 118, revenue: 17700 },
  { month: "Apr", bookings: 132, revenue: 19800 },
  { month: "May", bookings: 156, revenue: 23400 },
  { month: "Jun", bookings: 185, revenue: 27750 },
  { month: "Jul", bookings: 215, revenue: 32250 },
  { month: "Aug", bookings: 224, revenue: 33600 },
  { month: "Sep", bookings: 178, revenue: 26700 },
  { month: "Oct", bookings: 145, revenue: 21750 },
  { month: "Nov", bookings: 125, revenue: 18750 },
  { month: "Dec", bookings: 168, revenue: 25200 }
];

const weekdayTrendsData = [
  { day: "Monday", bookings: 152, rate: 65 },
  { day: "Tuesday", bookings: 165, rate: 68 },
  { day: "Wednesday", bookings: 178, rate: 72 },
  { day: "Thursday", bookings: 186, rate: 76 },
  { day: "Friday", bookings: 215, rate: 86 },
  { day: "Saturday", bookings: 254, rate: 94 },
  { day: "Sunday", bookings: 212, rate: 88 }
];

const timeOfDayData = [
  { time: "Early Morning (6-9am)", bookings: 125, rate: 68 },
  { time: "Morning (9am-12pm)", bookings: 245, rate: 82 },
  { time: "Afternoon (12-4pm)", bookings: 286, rate: 88 },
  { time: "Evening (4-8pm)", bookings: 218, rate: 76 },
  { time: "Night (8pm+)", bookings: 85, rate: 62 }
];

const seasonalActivityData = [
  { 
    season: "Winter",
    activities: [
      { name: "Cooking Class", bookings: 92, change: "+5%" },
      { name: "City Tour", bookings: 45, change: "-12%" },
      { name: "Wine Tasting", bookings: 78, change: "+2%" },
      { name: "Language Exchange", bookings: 56, change: "+8%" },
      { name: "Art Workshop", bookings: 73, change: "+18%" }
    ]
  },
  { 
    season: "Spring",
    activities: [
      { name: "Cooking Class", bookings: 87, change: "-2%" },
      { name: "City Tour", bookings: 94, change: "+28%" },
      { name: "Wine Tasting", bookings: 85, change: "+12%" },
      { name: "Language Exchange", bookings: 52, change: "-4%" },
      { name: "Art Workshop", bookings: 68, change: "-5%" }
    ]
  },
  { 
    season: "Summer",
    activities: [
      { name: "Cooking Class", bookings: 78, change: "-8%" },
      { name: "City Tour", bookings: 128, change: "+42%" },
      { name: "Wine Tasting", bookings: 112, change: "+26%" },
      { name: "Language Exchange", bookings: 48, change: "-8%" },
      { name: "Art Workshop", bookings: 62, change: "-10%" }
    ]
  },
  { 
    season: "Fall",
    activities: [
      { name: "Cooking Class", bookings: 85, change: "+4%" },
      { name: "City Tour", bookings: 92, change: "-12%" },
      { name: "Wine Tasting", bookings: 94, change: "-18%" },
      { name: "Language Exchange", bookings: 58, change: "+10%" },
      { name: "Art Workshop", bookings: 76, change: "+14%" }
    ]
  }
];

const holidayImpactData = [
  { holiday: "New Year", bookingIncrease: 32, priceMultiplier: 1.4 },
  { holiday: "Valentine's Day", bookingIncrease: 45, priceMultiplier: 1.3 },
  { holiday: "Easter", bookingIncrease: 28, priceMultiplier: 1.2 },
  { holiday: "Memorial Day", bookingIncrease: 38, priceMultiplier: 1.25 },
  { holiday: "Independence Day", bookingIncrease: 52, priceMultiplier: 1.35 },
  { holiday: "Labor Day", bookingIncrease: 42, priceMultiplier: 1.25 },
  { holiday: "Halloween", bookingIncrease: 18, priceMultiplier: 1.1 },
  { holiday: "Thanksgiving", bookingIncrease: 35, priceMultiplier: 1.2 },
  { holiday: "Christmas", bookingIncrease: 65, priceMultiplier: 1.5 },
  { holiday: "New Year's Eve", bookingIncrease: 75, priceMultiplier: 1.6 }
];

// Helper function to get season color
const getSeasonColor = (season: string) => {
  switch (season) {
    case "Winter": return "#94a3b8";
    case "Spring": return "#86efac";
    case "Summer": return "#facc15";
    case "Fall": return "#ef4444";
    default: return "#4f46e5";
  }
};

export default function TimingAnalytics() {
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [seasonalView, setSeasonalView] = useState<string>("Winter");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Seasonal Trends</h1>
          <p className="text-muted-foreground">
            Analyze booking patterns and timing-based performance
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
                  <h4 className="font-medium">Compare Years</h4>
                  <Select value={activityFilter} onValueChange={setActivityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
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
            <CardTitle className="text-sm font-medium">Peak Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">August</div>
            <p className="text-xs text-muted-foreground">224 bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Day</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Saturday</div>
            <p className="text-xs text-muted-foreground">94% booking rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Afternoon</div>
            <p className="text-xs text-muted-foreground">12pm - 4pm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Season Variance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground">Summer vs Winter</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different timing analytics views */}
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Patterns</TabsTrigger>
          <TabsTrigger value="daily">Time of Day</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Analysis</TabsTrigger>
        </TabsList>
        
        {/* Monthly Trends Tab */}
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Booking Trends</CardTitle>
              <CardDescription>
                Booking volume throughout the year
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="bookings" 
                    name="Bookings" 
                    stroke="#4f46e5" 
                    fill="#4f46e5" 
                    fillOpacity={0.3} 
                  />
                  <Area 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue ($)" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Monthly Booking Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Booking Rate</CardTitle>
                <CardDescription>
                  Percentage of available slots booked
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={[
                      { month: "Jan", rate: 68 },
                      { month: "Feb", rate: 72 },
                      { month: "Mar", rate: 75 },
                      { month: "Apr", rate: 78 },
                      { month: "May", rate: 82 },
                      { month: "Jun", rate: 88 },
                      { month: "Jul", rate: 92 },
                      { month: "Aug", rate: 94 },
                      { month: "Sep", rate: 86 },
                      { month: "Oct", rate: 78 },
                      { month: "Nov", rate: 76 },
                      { month: "Dec", rate: 84 }
                    ]}
                  >
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Booking Rate"]} />
                    <Bar dataKey="rate" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Year-over-Year Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Year-over-Year Comparison</CardTitle>
                <CardDescription>
                  Monthly bookings comparison with previous year
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart 
                    data={[
                      { month: "Jan", thisYear: 82, lastYear: 65 },
                      { month: "Feb", thisYear: 94, lastYear: 72 },
                      { month: "Mar", thisYear: 118, lastYear: 85 },
                      { month: "Apr", thisYear: 132, lastYear: 98 },
                      { month: "May", thisYear: 156, lastYear: 124 },
                      { month: "Jun", thisYear: 185, lastYear: 142 },
                      { month: "Jul", thisYear: 215, lastYear: 165 },
                      { month: "Aug", thisYear: 224, lastYear: 178 },
                      { month: "Sep", thisYear: 178, lastYear: 145 },
                      { month: "Oct", thisYear: 145, lastYear: 112 },
                      { month: "Nov", thisYear: 125, lastYear: 96 },
                      { month: "Dec", thisYear: 168, lastYear: 138 }
                    ]}
                  >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="thisYear" name="This Year" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="lastYear" name="Last Year" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Holiday Impact Analysis</CardTitle>
              <CardDescription>
                How major holidays affect bookings and pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Holiday</TableHead>
                    <TableHead className="text-right">Booking Increase</TableHead>
                    <TableHead className="text-right">Price Multiplier</TableHead>
                    <TableHead className="text-right">Revenue Impact</TableHead>
                    <TableHead>Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holidayImpactData.map(holiday => (
                    <TableRow key={holiday.holiday}>
                      <TableCell className="font-medium">{holiday.holiday}</TableCell>
                      <TableCell className="text-right">+{holiday.bookingIncrease}%</TableCell>
                      <TableCell className="text-right">{holiday.priceMultiplier}x</TableCell>
                      <TableCell className="text-right">
                        {((1 + holiday.bookingIncrease/100) * holiday.priceMultiplier * 100 - 100).toFixed(0)}% increase
                      </TableCell>
                      <TableCell>
                        {holiday.bookingIncrease > 50 ? (
                          <Badge className="bg-green-100 text-green-800">Increase slots & prices</Badge>
                        ) : holiday.bookingIncrease > 30 ? (
                          <Badge className="bg-blue-100 text-blue-800">Increase prices</Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800">Create special offer</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weekly Patterns Tab */}
        <TabsContent value="weekly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Weekday Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Bookings by Day of Week</CardTitle>
                <CardDescription>
                  Total bookings for each day of the week
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weekdayTrendsData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekday Booking Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Rate by Day of Week</CardTitle>
                <CardDescription>
                  Percentage of available slots booked
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weekdayTrendsData}>
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Booking Rate"]} />
                    <Bar dataKey="rate" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Patterns by Activity</CardTitle>
              <CardDescription>
                How different activities perform throughout the week
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart 
                  data={[
                    { day: "Monday", "Cooking Class": 72, "City Tour": 58, "Wine Tasting": 65, "Language Exchange": 78, "Art Workshop": 62 },
                    { day: "Tuesday", "Cooking Class": 75, "City Tour": 62, "Wine Tasting": 68, "Language Exchange": 82, "Art Workshop": 65 },
                    { day: "Wednesday", "Cooking Class": 78, "City Tour": 68, "Wine Tasting": 74, "Language Exchange": 85, "Art Workshop": 70 },
                    { day: "Thursday", "Cooking Class": 82, "City Tour": 72, "Wine Tasting": 80, "Language Exchange": 78, "Art Workshop": 74 },
                    { day: "Friday", "Cooking Class": 88, "City Tour": 84, "Wine Tasting": 92, "Language Exchange": 76, "Art Workshop": 82 },
                    { day: "Saturday", "Cooking Class": 95, "City Tour": 96, "Wine Tasting": 98, "Language Exchange": 72, "Art Workshop": 94 },
                    { day: "Sunday", "Cooking Class": 90, "City Tour": 92, "Wine Tasting": 94, "Language Exchange": 74, "Art Workshop": 85 }
                  ]}
                >
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, "Booking Rate"]} />
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
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Optimization Opportunities</CardTitle>
              <CardDescription>
                Recommendations for optimizing weekday performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Current Performance</TableHead>
                    <TableHead>Opportunity</TableHead>
                    <TableHead>Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Monday</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800">Underperforming</Badge>
                    </TableCell>
                    <TableCell>Lowest booking rate of the week (65%)</TableCell>
                    <TableCell>Create "Monday Special" with 15% discount</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tuesday</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800">Underperforming</Badge>
                    </TableCell>
                    <TableCell>Low booking rate (68%)</TableCell>
                    <TableCell>Package with Monday for "Weekday Getaway" deal</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Wednesday</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">Average</Badge>
                    </TableCell>
                    <TableCell>Average booking rate (72%)</TableCell>
                    <TableCell>Target local audience with after-work specials</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Thursday</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">Average</Badge>
                    </TableCell>
                    <TableCell>Good booking rate (76%)</TableCell>
                    <TableCell>Optimize pricing - slight premium for evening slots</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Friday</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">High Performing</Badge>
                    </TableCell>
                    <TableCell>Strong booking rate (86%)</TableCell>
                    <TableCell>Add more evening slots, increase prices by 10%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Saturday</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Peak Day</Badge>
                    </TableCell>
                    <TableCell>Highest booking rate (94%)</TableCell>
                    <TableCell>Add 25% more slots, increase prices by 15%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sunday</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">High Performing</Badge>
                    </TableCell>
                    <TableCell>Strong booking rate (88%)</TableCell>
                    <TableCell>Add morning family-friendly options, premium pricing</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time of Day Tab */}
        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Time of Day Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Bookings by Time of Day</CardTitle>
                <CardDescription>
                  Total bookings for different times of day
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeOfDayData}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Time of Day Booking Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Rate by Time of Day</CardTitle>
                <CardDescription>
                  Percentage of available slots booked
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeOfDayData}>
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Booking Rate"]} />
                    <Bar dataKey="rate" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Time of Day by Activity</CardTitle>
              <CardDescription>
                How different activities perform throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart 
                  data={[
                    { time: "Early Morning", "Cooking Class": 45, "City Tour": 72, "Wine Tasting": 25, "Language Exchange": 68, "Art Workshop": 52 },
                    { time: "Morning", "Cooking Class": 82, "City Tour": 92, "Wine Tasting": 58, "Language Exchange": 88, "Art Workshop": 78 },
                    { time: "Afternoon", "Cooking Class": 88, "City Tour": 96, "Wine Tasting": 92, "Language Exchange": 82, "Art Workshop": 86 },
                    { time: "Evening", "Cooking Class": 84, "City Tour": 74, "Wine Tasting": 98, "Language Exchange": 76, "Art Workshop": 72 },
                    { time: "Night", "Cooking Class": 45, "City Tour": 38, "Wine Tasting": 86, "Language Exchange": 65, "Art Workshop": 42 }
                  ]}
                >
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, "Booking Rate"]} />
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
          
          <Card>
            <CardHeader>
              <CardTitle>Time of Day Optimization</CardTitle>
              <CardDescription>
                Recommendations for maximizing daily performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time of Day</TableHead>
                    <TableHead>Best Performing Activities</TableHead>
                    <TableHead>Price Sensitivity</TableHead>
                    <TableHead>Recommendations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Early Morning (6-9am)</TableCell>
                    <TableCell>City Tour, Language Exchange</TableCell>
                    <TableCell>High - discount seekers</TableCell>
                    <TableCell>Offer early bird discounts (15% off)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Morning (9am-12pm)</TableCell>
                    <TableCell>City Tour, Cooking Class</TableCell>
                    <TableCell>Medium - standard pricing</TableCell>
                    <TableCell>Add more city tour slots, "Morning Experience" packages</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Afternoon (12-4pm)</TableCell>
                    <TableCell>City Tour, Wine Tasting</TableCell>
                    <TableCell>Low - premium pricing</TableCell>
                    <TableCell>Increase prices 10%, add premium slots</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Evening (4-8pm)</TableCell>
                    <TableCell>Wine Tasting, Cooking Class</TableCell>
                    <TableCell>Low - premium pricing</TableCell>
                    <TableCell>Create "Evening Gourmet" packages, premium pricing</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Night (8pm+)</TableCell>
                    <TableCell>Wine Tasting, Language Exchange</TableCell>
                    <TableCell>Medium - specialty seekers</TableCell>
                    <TableCell>Focus on social experiences, wine tastings only</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seasonal Analysis Tab */}
        <TabsContent value="seasonal" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Season Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Bookings by Season</CardTitle>
                <CardDescription>
                  Comparison of booking volumes across seasons
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={[
                      { season: "Winter", bookings: 344, revenue: 51600 },
                      { season: "Spring", bookings: 406, revenue: 60900 },
                      { season: "Summer", bookings: 624, revenue: 93600 },
                      { season: "Fall", bookings: 448, revenue: 67200 }
                    ]}
                  >
                    <XAxis dataKey="season" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                      {[
                        { season: "Winter", bookings: 344, revenue: 51600 },
                        { season: "Spring", bookings: 406, revenue: 60900 },
                        { season: "Summer", bookings: 624, revenue: 93600 },
                        { season: "Fall", bookings: 448, revenue: 67200 }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getSeasonColor(entry.season)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Season */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Season</CardTitle>
                <CardDescription>
                  Comparison of revenue across seasons
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={[
                      { season: "Winter", bookings: 344, revenue: 51600 },
                      { season: "Spring", bookings: 406, revenue: 60900 },
                      { season: "Summer", bookings: 624, revenue: 93600 },
                      { season: "Fall", bookings: 448, revenue: 67200 }
                    ]}
                  >
                    <XAxis dataKey="season" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                      {[
                        { season: "Winter", bookings: 344, revenue: 51600 },
                        { season: "Spring", bookings: 406, revenue: 60900 },
                        { season: "Summer", bookings: 624, revenue: 93600 },
                        { season: "Fall", bookings: 448, revenue: 67200 }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getSeasonColor(entry.season)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="mb-4">
              <Select value={seasonalView} onValueChange={setSeasonalView}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Winter">Winter</SelectItem>
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                  <SelectItem value="Fall">Fall</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{seasonalView} Activity Performance</CardTitle>
                <CardDescription>
                  How different activities perform during {seasonalView.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead className="text-right">Bookings</TableHead>
                      <TableHead>YoY Change</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Recommendation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seasonalActivityData
                      .find(data => data.season === seasonalView)?.activities
                      .map(activity => (
                        <TableRow key={activity.name}>
                          <TableCell className="font-medium">{activity.name}</TableCell>
                          <TableCell className="text-right">{activity.bookings}</TableCell>
                          <TableCell>
                            <span className={activity.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                              {activity.change}
                            </span>
                          </TableCell>
                          <TableCell>
                            {activity.change.startsWith('+') && parseInt(activity.change) > 10 ? (
                              <Badge className="bg-green-100 text-green-800">Strong</Badge>
                            ) : activity.change.startsWith('+') ? (
                              <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                            ) : parseInt(activity.change) < -10 ? (
                              <Badge className="bg-red-100 text-red-800">Weak</Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-800">Average</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {activity.change.startsWith('+') && parseInt(activity.change) > 10 ? (
                              "Increase capacity and prices"
                            ) : activity.change.startsWith('+') ? (
                              "Maintain strategy, slight price increase"
                            ) : parseInt(activity.change) < -10 ? (
                              "Revamp offering or seasonal promotion"
                            ) : (
                              "Create seasonal package or discount"
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Seasonal Strategy Recommendations</CardTitle>
              <CardDescription>
                Optimize your activities based on seasonal trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Season</TableHead>
                    <TableHead>Key Insights</TableHead>
                    <TableHead>Focus Activities</TableHead>
                    <TableHead>Strategy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Winter</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Indoor activities perform best</li>
                        <li>Holiday season drives premium bookings</li>
                        <li>Lowest overall volume but strong margins</li>
                      </ul>
                    </TableCell>
                    <TableCell>Cooking Class, Art Workshop</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Create holiday-themed experiences</li>
                        <li>Cozy indoor experiences with premium pricing</li>
                        <li>Package deals to drive volume</li>
                      </ul>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Spring</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Outdoor activities start to gain traction</li>
                        <li>Growing demand with Spring Break</li>
                        <li>Good mix of indoor/outdoor options</li>
                      </ul>
                    </TableCell>
                    <TableCell>City Tour, Wine Tasting</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Launch seasonal specials (Spring themes)</li>
                        <li>Increase outdoor activity capacity</li>
                        <li>Target families during school breaks</li>
                      </ul>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Summer</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Peak season with highest volume</li>
                        <li>Outdoor activities dominate</li>
                        <li>Tourist influx creates premium opportunity</li>
                      </ul>
                    </TableCell>
                    <TableCell>City Tour, Wine Tasting</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Maximize capacity for all activities</li>
                        <li>Dynamic pricing with peak/off-peak hours</li>
                        <li>Premium experiences for tourists</li>
                      </ul>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Fall</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Strong shoulder season performance</li>
                        <li>Balance of indoor and outdoor activities</li>
                        <li>Holiday preparations drive bookings</li>
                      </ul>
                    </TableCell>
                    <TableCell>Cooking Class, Language Exchange</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Fall-themed experiences (harvest, etc.)</li>
                        <li>Focus on weekends for outdoor activities</li>
                        <li>Begin holiday season marketing</li>
                      </ul>
                    </TableCell>
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
