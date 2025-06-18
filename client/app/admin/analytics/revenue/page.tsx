"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
} from "recharts";
import { ArrowDown, ArrowUp, DollarSign, Percent, CreditCard, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

// Mock data for revenue analytics
const monthlyRevenueData = [
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

const categoryRevenueData = [
  { name: "Cooking Classes", value: 35000 },
  { name: "City Tours", value: 28000 },
  { name: "Language Exchange", value: 15000 },
  { name: "Outdoor Adventures", value: 12000 },
  { name: "Art & Crafts", value: 8000 },
];

const paymentMethodData = [
  { name: "Credit Card", value: 65 },
  { name: "PayPal", value: 20 },
  { name: "Bank Transfer", value: 10 },
  { name: "Digital Wallet", value: 5 },
];

const refundRateData = [
  { month: "Jan", rate: 1.2 },
  { month: "Feb", rate: 1.1 },
  { month: "Mar", rate: 1.5 },
  { month: "Apr", rate: 1.8 },
  { month: "May", rate: 2.0 },
  { month: "Jun", rate: 1.7 },
  { month: "Jul", rate: 1.6 },
  { month: "Aug", rate: 1.4 },
  { month: "Sep", rate: 1.3 },
  { month: "Oct", rate: 1.2 },
  { month: "Nov", rate: 1.0 },
  { month: "Dec", rate: 0.9 },
];

const weekdayRevenueData = [
  { day: "Monday", revenue: 12500 },
  { day: "Tuesday", revenue: 14000 },
  { day: "Wednesday", revenue: 15500 },
  { day: "Thursday", revenue: 16000 },
  { day: "Friday", revenue: 18500 },
  { day: "Saturday", revenue: 22000 },
  { day: "Sunday", revenue: 19500 },
];

// KPI cards data
const kpiCardsData = [
  {
    title: "Total Revenue YTD",
    value: "$703,000",
    change: "+18.5%",
    trend: "up",
    description: "vs previous year",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "Platform Fees YTD",
    value: "$140,600",
    change: "+16.2%",
    trend: "up",
    description: "vs previous year",
    icon: <Percent className="h-4 w-4" />,
  },
  {
    title: "Avg. Transaction Value",
    value: "$72.50",
    change: "+4.3%",
    trend: "up",
    description: "vs previous year",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    title: "Refund Rate",
    value: "1.3%",
    change: "-0.2%",
    trend: "down",
    description: "vs previous year (good)",
    icon: <Calendar className="h-4 w-4" />,
  },
];

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function RevenueAnalyticsPage() {
  // const [timeRange, setTimeRange] = useState("year");
  
  const [bookingDates, setBookingDates] = useState<DateRange>({
    from: new Date(), // Default to today
    to: new Date(new Date().setDate(new Date().getDate() + 2)) // Default to 2 days from now
  });

  const handleUpdate = (values: { range: DateRange }) => {
    setBookingDates(values.range);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Revenue Analytics</h1>
          <p className="text-gray-500">Detailed analysis of platform revenue and financial metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
        

            <DateRangePicker
              initialDateFrom={bookingDates.from}
              initialDateTo={bookingDates.to}
              onUpdate={handleUpdate}
              showCompare={false}
            />
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
                )}
                <span className={kpi.trend === "up" && kpi.title !== "Refund Rate" ? "text-green-500" : "text-green-500"}>
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
          <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
          <TabsTrigger value="categories">Revenue by Category</TabsTrigger>
          <TabsTrigger value="payment">Payment Analysis</TabsTrigger>
          <TabsTrigger value="refunds">Refunds & Chargebacks</TabsTrigger>
        </TabsList>
        
        {/* Revenue Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Total revenue, host payouts and platform fees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyRevenueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="revenue" name="Total Revenue" fill="#8884d8" />
                      <Bar dataKey="payouts" name="Host Payouts" fill="#82ca9d" />
                      <Bar dataKey="fees" name="Platform Fees" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Day of Week</CardTitle>
                <CardDescription>Revenue distribution across weekdays</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weekdayRevenueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Revenue by Category Tab */}
        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Activity Category</CardTitle>
                <CardDescription>Distribution of revenue across different activity types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryRevenueData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: $${value.toLocaleString()} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryRevenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Revenue Comparison</CardTitle>
                <CardDescription>Revenue by category in dollar amount</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={categoryRevenueData}
                      margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="value" name="Revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Payment Analysis Tab */}
        <TabsContent value="payment">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods Distribution</CardTitle>
                <CardDescription>Breakdown of payment methods used by customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentMethodData.map((entry, index) => (
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
                <CardTitle>Average Transaction Value by Month</CardTitle>
                <CardDescription>Trend of average transaction value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyRevenueData.map(item => ({
                        month: item.month,
                        avgValue: (item.revenue / 100).toFixed(2)
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="avgValue"
                        name="Avg Transaction Value"
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
        
        {/* Refunds & Chargebacks Tab */}
        <TabsContent value="refunds">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Refund Rate</CardTitle>
                <CardDescription>Percentage of transactions refunded each month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={refundRateData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        name="Refund Rate (%)"
                        stroke="#FF8042"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Refund Reasons</CardTitle>
                <CardDescription>Common reasons for refund requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { reason: "Host Cancellation", count: 42 },
                        { reason: "Weather Issues", count: 28 },
                        { reason: "Customer Schedule Change", count: 25 },
                        { reason: "Activity Not As Described", count: 18 },
                        { reason: "Technical Booking Issue", count: 12 },
                      ]}
                      margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="reason" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Number of Refunds" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Additional Revenue Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Revenue Growth Analysis</CardTitle>
          <CardDescription>Year-over-year revenue growth comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { month: "Jan", thisYear: 25000, lastYear: 21000 },
                  { month: "Feb", thisYear: 28000, lastYear: 23000 },
                  { month: "Mar", thisYear: 35000, lastYear: 28000 },
                  { month: "Apr", thisYear: 40000, lastYear: 32000 },
                  { month: "May", thisYear: 48000, lastYear: 38000 },
                  { month: "Jun", thisYear: 52000, lastYear: 42000 },
                  { month: "Jul", thisYear: 61000, lastYear: 49000 },
                  { month: "Aug", thisYear: 67000, lastYear: 55000 },
                  { month: "Sep", thisYear: 75000, lastYear: 61000 },
                  { month: "Oct", thisYear: 83000, lastYear: 68000 },
                  { month: "Nov", thisYear: 91000, lastYear: 75000 },
                  { month: "Dec", thisYear: 98000, lastYear: 80000 },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="thisYear"
                  name="Current Year"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="lastYear"
                  name="Previous Year"
                  stroke="#82ca9d"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
