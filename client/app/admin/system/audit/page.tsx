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
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { Search, Filter, Download, Eye, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

// Mock data for audit trail
const auditLogs = [
  {
    id: "audit-001",
    timestamp: "2023-07-12T15:45:12.458Z",
    userId: "admin-42",
    userName: "John Admin",
    userRole: "admin",
    action: "user.update",
    targetId: "user-789",
    targetType: "user",
    details: {
      changes: {
        status: { from: "active", to: "suspended" },
        reason: "Multiple community guideline violations"
      }
    },
    ipAddress: "198.51.100.42"
  },
  {
    id: "audit-002",
    timestamp: "2023-07-12T15:38:21.123Z",
    userId: "admin-17",
    userName: "Sarah Manager",
    userRole: "admin",
    action: "activity.approve",
    targetId: "activity-456",
    targetType: "activity",
    details: {
      activityName: "Italian Pasta Making Class",
      hostId: "host-123"
    },
    ipAddress: "203.0.113.15"
  },
  {
    id: "audit-003",
    timestamp: "2023-07-12T15:32:08.789Z",
    userId: "admin-08",
    userName: "Michael Support",
    userRole: "support",
    action: "payment.refund",
    targetId: "payment-872",
    targetType: "payment",
    details: {
      amount: "$129.00",
      reason: "Host canceled activity",
      bookingId: "booking-562"
    },
    ipAddress: "192.0.2.178"
  },
  {
    id: "audit-004",
    timestamp: "2023-07-12T15:25:54.321Z",
    userId: "admin-42",
    userName: "John Admin",
    userRole: "admin",
    action: "system.settings.update",
    targetId: "settings-fees",
    targetType: "settings",
    details: {
      changes: {
        platformFee: { from: "10%", to: "12%" },
        effectiveDate: "2023-08-01"
      }
    },
    ipAddress: "198.51.100.42"
  },
  {
    id: "audit-005",
    timestamp: "2023-07-12T15:20:17.654Z",
    userId: "admin-29",
    userName: "Lisa Content",
    userRole: "content",
    action: "review.delete",
    targetId: "review-921",
    targetType: "review",
    details: {
      reason: "Violated community guidelines - hate speech",
      activityId: "activity-783"
    },
    ipAddress: "192.0.2.245"
  },
  {
    id: "audit-006",
    timestamp: "2023-07-12T15:15:32.987Z",
    userId: "admin-08",
    userName: "Michael Support",
    userRole: "support",
    action: "user.verification.approve",
    targetId: "host-456",
    targetType: "host",
    details: {
      documentType: "ID Verification",
      hostName: "Emma Johnson"
    },
    ipAddress: "192.0.2.178"
  },
  {
    id: "audit-007",
    timestamp: "2023-07-12T15:10:09.543Z",
    userId: "admin-42",
    userName: "John Admin",
    userRole: "admin",
    action: "system.feature.toggle",
    targetId: "feature-newBooking",
    targetType: "feature",
    details: {
      featureName: "New Booking Flow",
      status: "enabled",
      rolloutPercentage: "25%"
    },
    ipAddress: "198.51.100.42"
  },
  {
    id: "audit-008",
    timestamp: "2023-07-12T15:05:48.789Z",
    userId: "admin-17",
    userName: "Sarah Manager",
    userRole: "admin",
    action: "category.create",
    targetId: "category-42",
    targetType: "category",
    details: {
      name: "Virtual Experiences",
      description: "Online activities that can be enjoyed remotely",
      status: "active"
    },
    ipAddress: "203.0.113.15"
  },
  {
    id: "audit-009",
    timestamp: "2023-07-12T15:01:23.456Z",
    userId: "admin-29",
    userName: "Lisa Content",
    userRole: "content",
    action: "featured.update",
    targetId: "homepage-featured",
    targetType: "featured",
    details: {
      changes: {
        activities: {
          added: ["activity-456", "activity-789"],
          removed: ["activity-123"]
        },
        section: "Summer Highlights"
      }
    },
    ipAddress: "192.0.2.245"
  },
  {
    id: "audit-010",
    timestamp: "2023-07-12T14:55:36.789Z",
    userId: "admin-42",
    userName: "John Admin",
    userRole: "admin",
    action: "api.key.generate",
    targetId: "partner-12",
    targetType: "partner",
    details: {
      partnerName: "Travel Booker Inc.",
      apiPlan: "Premium",
      rateLimit: "5000 req/hour"
    },
    ipAddress: "198.51.100.42"
  }
];

// Action types for filtering
const actionTypes = [
  { value: "user.update", label: "User Update" },
  { value: "user.verification.approve", label: "User Verification" },
  { value: "activity.approve", label: "Activity Approval" },
  { value: "payment.refund", label: "Payment Refund" },
  { value: "system.settings.update", label: "Settings Update" },
  { value: "review.delete", label: "Review Deletion" },
  { value: "system.feature.toggle", label: "Feature Toggle" },
  { value: "category.create", label: "Category Creation" },
  { value: "featured.update", label: "Featured Content Update" },
  { value: "api.key.generate", label: "API Key Generation" },
];

// Admin users for filtering
const adminUsers = [
  { value: "admin-42", label: "John Admin" },
  { value: "admin-17", label: "Sarah Manager" },
  { value: "admin-08", label: "Michael Support" },
  { value: "admin-29", label: "Lisa Content" },
];

export default function AuditTrailPage() {
  const [search, setSearch] = useState("");
  const [actionType, setActionType] = useState("all");
  const [adminUser, setAdminUser] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), "MMM dd, yyyy HH:mm:ss");
  };

  // Get badge color based on action type
  const getActionBadgeColor = (action: string) => {
    if (action.startsWith("user")) return "blue";
    if (action.startsWith("activity")) return "green";
    if (action.startsWith("payment")) return "yellow";
    if (action.startsWith("system")) return "purple";
    if (action.startsWith("review")) return "red";
    if (action.startsWith("category")) return "orange";
    if (action.startsWith("featured")) return "pink";
    if (action.startsWith("api")) return "cyan";
    return "default";
  };

  // Get badge for user role
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">{role}</Badge>;
      case "support":
        return <Badge variant="secondary">{role}</Badge>;
      case "content":
        return <Badge variant="outline">{role}</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  // Get action display text
  const getActionDisplay = (action: string) => {
    return action
      .split(".")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Audit Trail</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Audit Logs
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Audit Log Filters</CardTitle>
          <CardDescription>Filter audit logs by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search audit logs..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {actionTypes.map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={adminUser} onValueChange={setAdminUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Admin User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Admins</SelectItem>
                  {adminUsers.map((user) => (
                    <SelectItem key={user.value} value={user.value}>
                      {user.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DateRangePicker
                initialDateFrom={dateRange?.from}
                initialDateTo={dateRange?.to}
                onUpdate={(values) => setDateRange(values.range)}
                showCompare={false}
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
          <CardTitle>Audit History</CardTitle>
          <CardDescription>
            Complete record of administrative actions taken on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[180px]">Admin User</TableHead>
                <TableHead className="w-[150px]">Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead className="w-[120px]">IP Address</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {formatTimestamp(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{log.userName}</span>
                      <div className="mt-1">{getRoleBadge(log.userRole)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`bg-${getActionBadgeColor(log.action)}-50 border-${getActionBadgeColor(log.action)}-200 text-${getActionBadgeColor(log.action)}-700`}
                    >
                      {getActionDisplay(log.action)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium capitalize">{log.targetType}</span>
                      <span className="text-xs text-muted-foreground font-mono">{log.targetId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.ipAddress}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[400px]">
                        <DropdownMenuLabel>Audit Log Details</DropdownMenuLabel>
                        <div className="p-3">
                          <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                          <div className="flex justify-end mt-2">
                            <Button variant="outline" size="sm">View Full Record</Button>
                          </div>
                        </div>
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
