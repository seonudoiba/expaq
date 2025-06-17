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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, Search, Filter, RefreshCw, ChevronDown, AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

// Mock data for system logs
const systemLogs = [
  {
    id: "log-001",
    timestamp: "2023-07-12T15:32:18.452Z",
    level: "error",
    source: "api-server",
    message: "Payment gateway connection timeout after 30s",
    details: { endpoint: "/api/payments/process", requestId: "req-7829a", userId: "user-5421" }
  },
  {
    id: "log-002",
    timestamp: "2023-07-12T15:30:05.127Z",
    level: "warning",
    source: "db-server",
    message: "High database query execution time detected (2.5s)",
    details: { query: "SELECT * FROM bookings JOIN users WHERE...", queryId: "q-56721" }
  },
  {
    id: "log-003",
    timestamp: "2023-07-12T15:25:42.890Z",
    level: "info",
    source: "auth-service",
    message: "User login successful",
    details: { userId: "user-9832", ipAddress: "198.51.100.42", device: "iOS/Safari" }
  },
  {
    id: "log-004",
    timestamp: "2023-07-12T15:20:16.345Z",
    level: "info",
    source: "booking-service",
    message: "New booking created successfully",
    details: { bookingId: "booking-7821", userId: "user-4672", activityId: "act-392" }
  },
  {
    id: "log-005",
    timestamp: "2023-07-12T15:18:09.123Z",
    level: "error",
    source: "storage-service",
    message: "Failed to upload image: file exceeds size limit",
    details: { userId: "user-1290", fileSize: "12.5MB", maxSize: "10MB" }
  },
  {
    id: "log-006",
    timestamp: "2023-07-12T15:15:23.786Z",
    level: "warning",
    source: "cache-service",
    message: "Cache miss rate above threshold (85%)",
    details: { cacheRegion: "user-profiles", threshold: "75%" }
  },
  {
    id: "log-007",
    timestamp: "2023-07-12T15:12:42.459Z",
    level: "info",
    source: "notification-service",
    message: "Email notification sent successfully",
    details: { templateId: "booking-confirmation", recipientId: "user-5421" }
  },
  {
    id: "log-008",
    timestamp: "2023-07-12T15:10:36.229Z",
    level: "debug",
    source: "search-service",
    message: "Search query execution completed",
    details: { queryTime: "120ms", resultCount: 24, filters: { location: "New York", dates: "2023-08-10 to 2023-08-15" } }
  },
  {
    id: "log-009",
    timestamp: "2023-07-12T15:05:19.678Z",
    level: "error",
    source: "api-server",
    message: "Rate limit exceeded for API consumer",
    details: { consumerId: "api-partner-42", endpoint: "/api/activities/search", limit: "100/min" }
  },
  {
    id: "log-010",
    timestamp: "2023-07-12T15:01:08.321Z",
    level: "info",
    source: "activity-service",
    message: "New activity published",
    details: { activityId: "act-783", hostId: "host-124", category: "Cooking Class" }
  }
];

// Log levels with their corresponding UI elements
const logLevels = {
  error: { color: "destructive", icon: <AlertCircle className="h-4 w-4" /> },
  warning: { color: "warning", icon: <AlertTriangle className="h-4 w-4" /> },
  info: { color: "info", icon: <Info className="h-4 w-4" /> },
  debug: { color: "secondary", icon: <CheckCircle2 className="h-4 w-4" /> }
};

// Sources for filtering
const logSources = [
  { value: "api-server", label: "API Server" },
  { value: "db-server", label: "Database Server" },
  { value: "auth-service", label: "Auth Service" },
  { value: "booking-service", label: "Booking Service" },
  { value: "storage-service", label: "Storage Service" },
  { value: "cache-service", label: "Cache Service" },
  { value: "notification-service", label: "Notification Service" },
  { value: "search-service", label: "Search Service" },
  { value: "activity-service", label: "Activity Service" }
];

export default function SystemLogsPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [source, setSource] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), "MMM dd, yyyy HH:mm:ss");
  };

  // Get badge variant based on log level
  const getBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case "error":
        return "destructive";
      case "warning":
        return "warning";
      case "info":
        return "info";
      case "debug":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Logs</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button size="sm" variant="default">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Log Search & Filters</CardTitle>
          <CardDescription>Search and filter system logs by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search logs..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Log Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {logSources.map((src) => (
                    <SelectItem key={src.value} value={src.value}>
                      {src.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="Select date range"
                align="start"
              />
            </div>
            
            <div className="flex justify-end">
              <Button variant="secondary" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>
            Showing <strong>{systemLogs.length}</strong> logs from your filtered selection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[100px]">Level</TableHead>
                <TableHead className="w-[150px]">Source</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systemLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {formatTimestamp(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(log.level)} className="flex items-center gap-1 w-fit">
                      {logLevels[log.level as keyof typeof logLevels].icon}
                      <span className="capitalize">{log.level}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{log.source}</TableCell>
                  <TableCell className="max-w-md truncate">{log.message}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <span className="sr-only">Open menu</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Copy JSON</DropdownMenuItem>
                        <DropdownMenuItem>Related Logs</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 flex items-center justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
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
    </div>
  );
}
