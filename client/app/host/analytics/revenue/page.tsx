"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSign,
  TrendingUp,
  ChevronRight,
  CreditCard,
  Calendar,
  ArrowRight,
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
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for revenue analytics
const revenueMonthly = [
  { month: "Jan", year: 2025, value: 4200 },
  { month: "Feb", year: 2025, value: 3800 },
  { month: "Mar", year: 2025, value: 5200 },
  { month: "Apr", year: 2025, value: 6100 },
  { month: "May", year: 2025, value: 7300 },
  { month: "Jun", year: 2025, value: 8200 },
];

const revenueByDay = [
  { name: "Mon", value: 1200 },
  { name: "Tue", value: 1400 },
  { name: "Wed", value: 1800 },
  { name: "Thu", value: 2100 },
  { name: "Fri", value: 2600 },
  { name: "Sat", value: 3200 },
  { name: "Sun", value: 2800 },
];

const revenueSourceData = [
  { name: "Direct Bookings", value: 42 },
  { name: "Search Results", value: 28 },
  { name: "Featured Activities", value: 18 },
  { name: "Partner Referrals", value: 8 },
  { name: "Social Media", value: 4 },
];

const paymentMethodData = [
  { name: "Credit Card", value: 65, color: "#0088FE" },
  { name: "PayPal", value: 25, color: "#00C49F" },
  { name: "Bank Transfer", value: 8, color: "#FFBB28" },
  { name: "Other", value: 2, color: "#FF8042" },
];

const transactionHistoryData = [
  {
    id: "tx-1234",
    date: "2025-06-15",
    amount: 450,
    activity: "City Walking Tour",
    participants: 3,
    status: "completed",
    method: "Credit Card",
  },
  {
    id: "tx-1235",
    date: "2025-06-14",
    amount: 800,
    activity: "Wine Tasting Experience",
    participants: 4,
    status: "completed",
    method: "PayPal",
  },
  {
    id: "tx-1236",
    date: "2025-06-12",
    amount: 650,
    activity: "Cooking Masterclass",
    participants: 2,
    status: "completed",
    method: "Credit Card",
  },
  {
    id: "tx-1237",
    date: "2025-06-10",
    amount: 1200,
    activity: "Mountain Hiking Tour",
    participants: 5,
    status: "completed",
    method: "Bank Transfer",
  },
  {
    id: "tx-1238",
    date: "2025-06-08",
    amount: 350,
    activity: "Photography Workshop",
    participants: 1,
    status: "completed",
    method: "Credit Card",
  },
  {
    id: "tx-1239",
    date: "2025-06-05",
    amount: 450,
    activity: "City Walking Tour",
    participants: 3,
    status: "completed",
    method: "PayPal",
  },
  {
    id: "tx-1240",
    date: "2025-06-03",
    amount: 550,
    activity: "Market Food Tour",
    participants: 2,
    status: "refunded",
    method: "Credit Card",
  },
];

export default function RevenueAnalytics() {
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState("90days");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 52800,
    revenueChange: 12.4,
    averageBookingValue: 347.37,
    avgBookingValueChange: 4.2,
    projectedRevenue: 68400,
    projectedChange: 29.5,
    refundRate: 1.2,
    refundChange: -0.3,
    payoutPending: 3450,
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
          <h1 className="text-3xl font-bold tracking-tight">Revenue & Earnings</h1>
          <p className="text-muted-foreground">
            Detailed breakdown of your financial performance
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

        {/* Average Booking Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Booking Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(stats.averageBookingValue)}</div>
                <div className="flex items-center text-xs text-muted-foreground pt-1">
                  {stats.avgBookingValueChange > 0 ? (
                    <>
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">{stats.avgBookingValueChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-500 font-medium">{Math.abs(stats.avgBookingValueChange)}%</span>
                    </>
                  )}
                  <span className="ml-1">vs previous period</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Projected Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(stats.projectedRevenue)}</div>
                <div className="flex items-center text-xs text-muted-foreground pt-1">
                  {stats.projectedChange > 0 ? (
                    <>
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">{stats.projectedChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-500 font-medium">{Math.abs(stats.projectedChange)}%</span>
                    </>
                  )}
                  <span className="ml-1">growth projection</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pending Payout */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(stats.payoutPending)}</div>
                <div className="flex items-center text-xs text-muted-foreground pt-1">
                  <span>Available in 2-3 business days</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
          <CardDescription>Monthly revenue breakdown</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueMonthly} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0088FE" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month"
                  tickFormatter={(value, index) => `${value} ${revenueMonthly[index].year}`} 
                />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label, items) => {
                    const dataItem = revenueMonthly[items[0].payload.month];
                    return `${dataItem.month} ${dataItem.year}`;
                  }}
                />
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
      </Card>

      {/* Revenue Analysis Tabs */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Breakdown</TabsTrigger>
          <TabsTrigger value="sources">Revenue Sources</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>
        
        {/* Daily Revenue Breakdown */}
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Day of Week</CardTitle>
              <CardDescription>Average revenue distribution across days</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByDay} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="value" name="Average Revenue" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Weekend days typically generate 30% more revenue than weekdays.
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Revenue Sources */}
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Source</CardTitle>
              <CardDescription>Where your bookings are coming from</CardDescription>
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
                      data={revenueSourceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueSourceData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-sm gap-1">
                View Detailed Source Analysis <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payment Methods */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Payment Method</CardTitle>
              <CardDescription>How your customers are paying</CardDescription>
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
                      data={paymentMethodData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Credit card payments have the lowest processing time (avg. 1.2 days).
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>History of your most recent revenue</CardDescription>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionHistoryData.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell>{transaction.activity}</TableCell>
                    <TableCell>{transaction.participants}</TableCell>
                    <TableCell>{transaction.method}</TableCell>
                    <TableCell>
                      {transaction.status === "completed" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900">
                          Completed
                        </Badge>
                      ) : transaction.status === "refunded" ? (
                        <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-900">
                          Refunded
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-900">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.status === "refunded" ? (
                        <span className="text-red-500">-{formatCurrency(transaction.amount)}</span>
                      ) : (
                        formatCurrency(transaction.amount)
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="outline">View All Transactions</Button>
        </CardFooter>
      </Card>

      {/* Fee Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Fee & Cost Analysis</CardTitle>
          <CardDescription>Breakdown of platform fees and costs</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">Platform Fee (12%)</div>
                  <div>{formatCurrency(stats.totalRevenue * 0.12)}</div>
                </div>
                <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">Payment Processing (2.5%)</div>
                  <div>{formatCurrency(stats.totalRevenue * 0.025)}</div>
                </div>
                <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '2.5%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">Net Earnings (85.5%)</div>
                  <div className="font-bold">{formatCurrency(stats.totalRevenue * 0.855)}</div>
                </div>
                <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '85.5%' }} />
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Refund Rate</div>
                  <div className="flex items-center">
                    <span className="font-medium">{stats.refundRate}%</span>
                    {stats.refundChange <= 0 ? (
                      <ArrowDownIcon className="h-4 w-4 text-green-500 ml-1" />
                    ) : (
                      <ArrowUpIcon className="h-4 w-4 text-red-500 ml-1" />
                    )}
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
