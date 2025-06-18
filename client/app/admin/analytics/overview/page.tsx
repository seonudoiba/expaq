"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, Users, DollarSign, CalendarDays, Activity } from "lucide-react";

// Mock data for analytics
const monthlyUserGrowthData = [
  { month: "Jan", users: 1250, hosts: 320 },
  { month: "Feb", users: 1400, hosts: 350 },
  { month: "Mar", users: 1800, hosts: 380 },
  { month: "Apr", users: 2100, hosts: 410 },
  { month: "May", users: 2300, hosts: 460 },
  { month: "Jun", users: 2800, hosts: 490 },
  { month: "Jul", users: 3300, hosts: 520 },
  { month: "Aug", users: 3700, hosts: 550 },
  { month: "Sep", users: 4200, hosts: 580 },
  { month: "Oct", users: 4500, hosts: 610 },
  { month: "Nov", users: 5000, hosts: 650 },
  { month: "Dec", users: 5600, hosts: 680 },
];

const revenueData = [
  { month: "Jan", revenue: 25000, payouts: 20000, fees: 5000 },
  { month: "Feb", revenue: 28000, payouts: 22400, fees: 5600 },
  { month: "Mar", revenue: 35000, payouts: 28000, fees: 7000 },
  { month: "Apr", revenue: 40000, payouts: 32000, fees: 8000 },
  { month: "May", revenue: 48000, payouts: 38400, fees: 9600 },
  { month: "Jun", revenue: 52000, payouts: 41600, fees: 10400 },
  { month: "Jul", revenue: 61000, payouts: 48800, fees: 12200 },
  { month: "Aug", revenue: 67000, payouts: 53600, fees: 13400 },
  { month: "Sep", revenue: 75000, payouts: 60000, fees: 15000 },
  { month: "Oct", revenue: 83000, payouts: 66400, fees: 16600 },
  { month: "Nov", revenue: 91000, payouts: 72800, fees: 18200 },
  { month: "Dec", revenue: 98000, payouts: 78400, fees: 19600 },
];

const activityCategoryData = [
  { name: "Cooking Classes", value: 35 },
  { name: "City Tours", value: 25 },
  { name: "Language Exchange", value: 15 },
  { name: "Outdoor Adventures", value: 10 },
  { name: "Art & Crafts", value: 8 },
  { name: "Other", value: 7 },
];

const activityTrendsData = [
  { month: "Jan", bookings: 580, activities: 120 },
  { month: "Feb", bookings: 620, activities: 125 },
  { month: "Mar", bookings: 700, activities: 135 },
  { month: "Apr", bookings: 780, activities: 145 },
  { month: "May", bookings: 820, activities: 160 },
  { month: "Jun", bookings: 900, activities: 175 },
  { month: "Jul", bookings: 980, activities: 190 },
  { month: "Aug", bookings: 1050, activities: 210 },
  { month: "Sep", bookings: 1120, activities: 230 },
  { month: "Oct", bookings: 1200, activities: 245 },
  { month: "Nov", bookings: 1280, activities: 260 },
  { month: "Dec", bookings: 1350, activities: 275 },
];

const regionData = [
  { name: "North America", value: 40 },
  { name: "Europe", value: 30 },
  { name: "Asia", value: 15 },
  { name: "South America", value: 8 },
  { name: "Australia", value: 5 },
  { name: "Africa", value: 2 },
];

// KPI cards data
const kpiCardsData = [
  {
    title: "Total Users",
    value: "5,600",
    change: "+12.5%",
    trend: "up",
    description: "From previous month",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Total Revenue",
    value: "$98,000",
    change: "+8.3%",
    trend: "up",
    description: "From previous month",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "Active Activities",
    value: "275",
    change: "+5.8%",
    trend: "up",
    description: "From previous month",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    title: "Avg. Booking Value",
    value: "$72.50",
    change: "-2.1%",
    trend: "down",
    description: "From previous month",
    icon: <CalendarDays className="h-4 w-4" />,
  },
];

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function PlatformOverviewPage() {
  const [timeRange, setTimeRange] = useState("year");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Platform Overview</h1>
          <p className="text-gray-500">Comprehensive analytics and insights about the platform</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 3 months</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCardsData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                {kpi.trend === "up" ? (
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={kpi.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {kpi.change}
                </span>{" "}
                <span className="text-gray-500 ml-1">{kpi.description}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overall Growth</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="activities">Activity Insights</TabsTrigger>
          <TabsTrigger value="regional">Regional Distribution</TabsTrigger>
        </TabsList>
        
        {/* Overall Growth Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Total users and hosts over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyUserGrowthData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="hosts" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Trends</CardTitle>
                <CardDescription>Bookings and new activities over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={activityTrendsData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="bookings"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="activities"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Revenue Analysis Tab */}
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Total revenue, host payouts and platform fees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" />
                      <Bar dataKey="payouts" fill="#82ca9d" />
                      <Bar dataKey="fees" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Growth</CardTitle>
                <CardDescription>Revenue trend over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Activity Insights Tab */}
        <TabsContent value="activities">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Categories</CardTitle>
                <CardDescription>Distribution of activities by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {activityCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Growth</CardTitle>
                <CardDescription>Number of new activities added over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activityTrendsData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="activities" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Regional Distribution Tab */}
        <TabsContent value="regional">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution by Region</CardTitle>
                <CardDescription>Geographic distribution of platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Growing Regions</CardTitle>
                <CardDescription>Regions with fastest user growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={regionData}
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
