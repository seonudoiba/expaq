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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import DatePicker from "@/components/admin/form/date-picker";

// import { DatePicker } from "@/components/ui/date-picker";

// Mock transaction data
const transactions = [
  {
    id: "t1",
    userId: "u1",
    userName: "John Doe",
    activityId: "a1",
    activityTitle: "Italian Pasta Masterclass",
    hostId: "h1",
    hostName: "Michael Johnson",
    amount: 55,
    platformFee: 8.25,
    hostPayout: 46.75,
    status: "Completed",
    paymentMethod: "Credit Card",
    date: "2024-06-01T14:30:00Z"
  },
  {
    id: "t2",
    userId: "u2",
    userName: "Jane Smith",
    activityId: "a1",
    activityTitle: "Italian Pasta Masterclass",
    hostId: "h1",
    hostName: "Michael Johnson",
    amount: 55,
    platformFee: 8.25,
    hostPayout: 46.75,
    status: "Completed",
    paymentMethod: "PayPal",
    date: "2024-06-02T10:15:00Z"
  },
  {
    id: "t3",
    userId: "u3",
    userName: "Admin User",
    activityId: "a2",
    activityTitle: "Mountain Hiking Experience",
    hostId: "h2",
    hostName: "Sarah Williams",
    amount: 80,
    platformFee: 12,
    hostPayout: 68,
    status: "Completed",
    paymentMethod: "Credit Card",
    date: "2024-06-03T09:45:00Z"
  },
  {
    id: "t4",
    userId: "u4",
    userName: "Host Expert",
    activityId: "a3",
    activityTitle: "Mindfulness Yoga Retreat",
    hostId: "h3",
    hostName: "Emma Davis",
    amount: 30,
    platformFee: 4.50,
    hostPayout: 25.50,
    status: "Pending",
    paymentMethod: "Credit Card",
    date: "2024-06-15T11:30:00Z"
  },
  {
    id: "t5",
    userId: "u5",
    userName: "New User",
    activityId: "a4",
    activityTitle: "Hidden Gems City Tour",
    hostId: "h4",
    hostName: "David Brown",
    amount: 35,
    platformFee: 5.25,
    hostPayout: 29.75,
    status: "Failed",
    paymentMethod: "Credit Card",
    date: "2024-06-14T16:20:00Z"
  }
];

// Mock refund data
const refunds = [
  {
    id: "r1",
    transactionId: "t6",
    userId: "u6",
    userName: "Alex Johnson",
    activityId: "a1",
    activityTitle: "Italian Pasta Masterclass",
    amount: 55,
    status: "Processing",
    reason: "User requested cancellation",
    requestDate: "2024-06-12T10:30:00Z"
  },
  {
    id: "r2",
    transactionId: "t7",
    userId: "u7",
    userName: "Maria Garcia",
    activityId: "a2",
    activityTitle: "Mountain Hiking Experience",
    amount: 40,
    status: "Approved",
    reason: "Activity cancelled by host",
    requestDate: "2024-06-10T14:15:00Z"
  },
  {
    id: "r3",
    transactionId: "t8",
    userId: "u8",
    userName: "Tom Wilson",
    activityId: "a3",
    activityTitle: "Mindfulness Yoga Retreat",
    amount: 30,
    status: "Rejected",
    reason: "Cancellation policy violation",
    requestDate: "2024-06-08T09:45:00Z"
  }
];

// Mock payout data
const payouts = [
  {
    id: "p1",
    hostId: "h1",
    hostName: "Michael Johnson",
    amount: 235.50,
    status: "Processed",
    paymentMethod: "Bank Transfer",
    date: "2024-06-05T10:00:00Z",
    transactions: 5
  },
  {
    id: "p2",
    hostId: "h2",
    hostName: "Sarah Williams",
    amount: 180.25,
    status: "Pending",
    paymentMethod: "PayPal",
    date: "2024-06-15T14:00:00Z",
    transactions: 4
  },
  {
    id: "p3",
    hostId: "h3",
    hostName: "Emma Davis",
    amount: 102.00,
    status: "Processed",
    paymentMethod: "Bank Transfer",
    date: "2024-06-01T09:30:00Z",
    transactions: 3
  },
  {
    id: "p4",
    hostId: "h4",
    hostName: "David Brown",
    amount: 267.75,
    status: "Failed",
    paymentMethod: "Bank Transfer",
    date: "2024-06-10T11:45:00Z",
    transactions: 7
  }
];

// Revenue over time data
const revenueData = [
  { month: "Jan", revenue: 12500, payouts: 10625, fees: 1875 },
  { month: "Feb", revenue: 15000, payouts: 12750, fees: 2250 },
  { month: "Mar", revenue: 17800, payouts: 15130, fees: 2670 },
  { month: "Apr", revenue: 19400, payouts: 16490, fees: 2910 },
  { month: "May", revenue: 22500, payouts: 19125, fees: 3375 },
  { month: "Jun", revenue: 25000, payouts: 21250, fees: 3750 },
];

export default function PaymentsPage() {
  // State for filtering and pagination
  const [transactionSearchTerm, setTransactionSearchTerm] = useState("");
  const [transactionStatusFilter, setTransactionStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transactionSearchTerm === "" || 
      transaction.userName.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
      transaction.activityTitle.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
      transaction.hostName.toLowerCase().includes(transactionSearchTerm.toLowerCase());
    
    const matchesStatus = 
      transactionStatusFilter === "all" || 
      transaction.status.toLowerCase() === transactionStatusFilter.toLowerCase();
    
    // Filter by date range if dates are selected
    let matchesDateRange = true;
    if (startDate && endDate) {
      const transactionDate = new Date(transaction.date);
      matchesDateRange = transactionDate >= startDate && transactionDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Format date to readable string
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage all transactions, refunds, and host payouts.
        </p>
      </div>

      {/* Revenue Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Platform revenue, payouts, and fees over time</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Total Revenue" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="payouts" stroke="#82ca9d" name="Host Payouts" />
              <Line type="monotone" dataKey="fees" stroke="#ffc658" name="Platform Fees" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent payment metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Revenue (Month)", value: "$25,000", change: "+18%" },
          { title: "Host Payouts", value: "$21,250", change: "+15%" },
          { title: "Platform Fees", value: "$3,750", change: "+18%" },
          { title: "Processing Fees", value: "$1,250", change: "+12%" },
        ].map((metric, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-green-500 mt-1">
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment management tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
          <TabsTrigger value="payouts">Host Payouts</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>All payment transactions on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters and actions */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex flex-1 gap-4 flex-wrap">
                  <Input 
                    placeholder="Search transactions..." 
                    value={transactionSearchTerm}
                    onChange={(e) => setTransactionSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select value={transactionStatusFilter} onValueChange={setTransactionStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <DatePicker
                      date={startDate}
                      setDate={setStartDate}
                      placeholder="Start date"
                    />
                  
                    <span>to</span>
                    <DatePicker
                      date={endDate}
                      setDate={setEndDate}
                      placeholder="End date"
                    />
                  </div>
                </div>
                <div className="flex gap-2 ml-auto">
                  <Button variant="outline">Export</Button>
                </div>
              </div>

              {/* Transactions table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Platform Fee</TableHead>
                      <TableHead>Host Payout</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                          No transactions found matching the filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map(transaction => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.id}</TableCell>
                          <TableCell>{transaction.userName}</TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate" title={transaction.activityTitle}>
                              {transaction.activityTitle}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">${transaction.amount.toFixed(2)}</TableCell>
                          <TableCell>${transaction.platformFee.toFixed(2)}</TableCell>
                          <TableCell>${transaction.hostPayout.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                transaction.status === "Completed" ? "success" : 
                                transaction.status === "Pending" ? "warning" : "destructive"
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
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
                                <DropdownMenuItem>View details</DropdownMenuItem>
                                <DropdownMenuItem>Send receipt</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {transaction.status !== "Completed" && (
                                  <DropdownMenuItem>Mark as completed</DropdownMenuItem>
                                )}
                                {transaction.status === "Pending" && (
                                  <DropdownMenuItem className="text-red-600">Cancel transaction</DropdownMenuItem>
                                )}
                                <DropdownMenuItem>Process refund</DropdownMenuItem>
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

        {/* Refunds Tab */}
        <TabsContent value="refunds">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Refund Requests</CardTitle>
              <CardDescription>Manage refund requests and approvals.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Refunds table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Refund ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {refunds.map(refund => (
                      <TableRow key={refund.id}>
                        <TableCell>{refund.id}</TableCell>
                        <TableCell>{refund.userName}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={refund.activityTitle}>
                            {refund.activityTitle}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${refund.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              refund.status === "Approved" ? "success" : 
                              refund.status === "Processing" ? "warning" : "destructive"
                            }
                          >
                            {refund.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={refund.reason}>
                            {refund.reason}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(refund.requestDate)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            {refund.status === "Processing" && (
                              <>
                                <Button variant="success" size="sm">Approve</Button>
                                <Button variant="destructive" size="sm">Reject</Button>
                              </>
                            )}
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

        {/* Host Payouts Tab */}
        <TabsContent value="payouts">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Host Payouts</CardTitle>
              <CardDescription>Manage host payouts and payment methods.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Payment method distribution chart */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Payout Methods</h3>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Bank Transfer", value: 65 },
                        { name: "PayPal", value: 30 },
                        { name: "Other", value: 5 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar dataKey="value" fill="#8884d8" name="Percentage" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Host payouts table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payout ID</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map(payout => (
                      <TableRow key={payout.id}>
                        <TableCell>{payout.id}</TableCell>
                        <TableCell>{payout.hostName}</TableCell>
                        <TableCell className="font-medium">${payout.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              payout.status === "Processed" ? "success" : 
                              payout.status === "Pending" ? "warning" : "destructive"
                            }
                          >
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{payout.paymentMethod}</TableCell>
                        <TableCell>{payout.transactions}</TableCell>
                        <TableCell>{formatDate(payout.date)}</TableCell>
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
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>View transactions</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {payout.status === "Pending" && (
                                <>
                                  <DropdownMenuItem>Process payout</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Cancel payout</DropdownMenuItem>
                                </>
                              )}
                              {payout.status === "Failed" && (
                                <DropdownMenuItem>Retry payout</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Platform fees configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Fee Configuration</CardTitle>
          <CardDescription>Configure platform fees and payment settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Current Fee Settings</h3>
              <div className="space-y-4">
                {[
                  { name: "Standard Platform Fee", value: "15%", description: "Fee applied to all standard transactions" },
                  { name: "Premium Host Fee", value: "12%", description: "Reduced fee for premium hosts" },
                  { name: "Featured Activity Fee", value: "18%", description: "Fee for featured activities" },
                  { name: "Payment Processing Fee", value: "3%", description: "Additional payment processor fee" },
                ].map((fee, idx) => (
                  <div key={idx} className="flex justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-medium">{fee.name}</div>
                      <div className="text-sm text-gray-500">{fee.description}</div>
                    </div>
                    <div className="font-bold">{fee.value}</div>
                  </div>
                ))}
              </div>
              <Button className="mt-4">Edit Fee Structure</Button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Payment Processors</h3>
              <div className="space-y-4">
                {[
                  { name: "Stripe", status: "Active", default: true },
                  { name: "PayPal", status: "Active", default: false },
                  { name: "Bank Transfers", status: "Active", default: false }
                ].map((processor, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{processor.name}</div>
                        {processor.default && (
                          <Badge className="mt-1">Default</Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant={processor.status === "Active" ? "success" : "default"}>
                      {processor.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button className="mt-4">Configure Payment Processors</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
