"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResponsiveContainer,
 
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
 
  Legend,
 
  LineChart,
  Line,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Server, Activity, HardDrive, Cpu, Wifi, RefreshCw, Clock } from "lucide-react";

// Mock data for system resources
const systemResources = [
  {
    name: "CPU Usage",
    value: 38,
    max: 100,
    unit: "%",
    status: "normal",
    icon: <Cpu className="h-5 w-5" />,
  },
  {
    name: "Memory Usage",
    value: 62,
    max: 100,
    unit: "%",
    status: "warning",
    icon: <HardDrive className="h-5 w-5" />,
  },
  {
    name: "Disk Space",
    value: 76,
    max: 100,
    unit: "%",
    status: "warning",
    icon: <Server className="h-5 w-5" />,
  },
  {
    name: "Network",
    value: 18,
    max: 100,
    unit: "Mbps",
    status: "normal",
    icon: <Wifi className="h-5 w-5" />,
  },
];

// Mock data for resource utilization over time
const resourceUtilizationData = [
  { time: "00:00", cpu: 28, memory: 42, disk: 55, network: 14 },
  { time: "04:00", cpu: 22, memory: 45, disk: 56, network: 10 },
  { time: "08:00", cpu: 35, memory: 50, disk: 60, network: 25 },
  { time: "12:00", cpu: 62, memory: 68, disk: 65, network: 48 },
  { time: "16:00", cpu: 45, memory: 55, disk: 70, network: 30 },
  { time: "20:00", cpu: 38, memory: 62, disk: 76, network: 18 },
];

// Mock data for API endpoints performance
const apiPerformanceData = [
  {
    endpoint: "/api/users",
    avgResponseTime: 42,
    requests: 12850,
    errors: 78,
    status: "normal",
  },
  {
    endpoint: "/api/activities",
    avgResponseTime: 128,
    requests: 8745,
    errors: 154,
    status: "warning",
  },
  {
    endpoint: "/api/bookings",
    avgResponseTime: 95,
    requests: 4520,
    errors: 24,
    status: "normal",
  },
  {
    endpoint: "/api/payments",
    avgResponseTime: 185,
    requests: 2105,
    errors: 215,
    status: "critical",
  },
  {
    endpoint: "/api/reviews",
    avgResponseTime: 56,
    requests: 3654,
    errors: 12,
    status: "normal",
  },
];

// Mock data for recent system alerts
const systemAlerts = [
  {
    id: "alert-1",
    severity: "critical",
    message: "High CPU usage detected (95%) - Server: app-server-02",
    timestamp: "2023-07-12T14:25:36",
    resolved: false,
  },
  {
    id: "alert-2",
    severity: "warning",
    message: "Database connection pool at 85% capacity",
    timestamp: "2023-07-12T13:18:12",
    resolved: false,
  },
  {
    id: "alert-3",
    severity: "warning",
    message: "Disk space usage above 80% threshold - Server: db-server-01",
    timestamp: "2023-07-12T10:45:22",
    resolved: true,
  },
  {
    id: "alert-4",
    severity: "info",
    message: "Scheduled backup completed successfully",
    timestamp: "2023-07-12T05:00:08",
    resolved: true,
  },
  {
    id: "alert-5",
    severity: "critical",
    message: "Payment gateway service unreachable",
    timestamp: "2023-07-11T22:14:33",
    resolved: true,
  },
];

// Get badge color based on status
const getBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "critical":
      return "destructive";
    case "warning":
      return "warning";
    case "info":
      return "secondary";
    case "normal":
      return "success";
    default:
      return "default";
  }
};

// Progress bar component for resource utilization
const ProgressBar = ({ value, max, status }: { value: number; max: number; status: string }) => {
  const percentage = (value / max) * 100;
  const getColorClass = () => {
    switch (status.toLowerCase()) {
      case "critical":
        return "bg-red-600";
      case "warning":
        return "bg-yellow-500";
      case "normal":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className={`h-2.5 rounded-full ${getColorClass()}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default function SystemMonitoringPage() {
  const [resourceTimeRange, setResourceTimeRange] = useState("24h");

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <div className="flex gap-2 items-center">
          <Button size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Select defaultValue="realtime">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Update frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="30s">Every 30 seconds</SelectItem>
              <SelectItem value="1m">Every minute</SelectItem>
              <SelectItem value="5m">Every 5 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {systemResources.map((resource) => (
          <Card key={resource.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{resource.name}</CardTitle>
              {resource.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resource.value}
                <span className="text-sm ml-1">{resource.unit}</span>
              </div>
              <div className="mt-2">
                <ProgressBar value={resource.value} max={resource.max} status={resource.status} />
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                <Badge variant={getBadgeVariant(resource.status)} className="mr-2">
                  {resource.status.toUpperCase()}
                </Badge>
                {resource.status === "warning" && "Approaching threshold"}
                {resource.status === "critical" && "Exceeds threshold"}
                {resource.status === "normal" && "Operating normally"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Resource Utilization Over Time */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resource Utilization</CardTitle>
              <div className="flex gap-2">
                <Select
                  value={resourceTimeRange}
                  onValueChange={setResourceTimeRange}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last hour</SelectItem>
                    <SelectItem value="6h">Last 6 hours</SelectItem>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription>System resource usage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={resourceUtilizationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU (%)" />
                <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory (%)" />
                <Line type="monotone" dataKey="disk" stroke="#ffc658" name="Disk (%)" />
                <Line type="monotone" dataKey="network" stroke="#ff8042" name="Network (Mbps)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {/* API Endpoints Performance */}
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>API Performance</CardTitle>
            <CardDescription>Response times and error rates for key endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Avg. Response Time</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead>Errors</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiPerformanceData.map((item) => (
                  <TableRow key={item.endpoint}>
                    <TableCell className="font-mono">{item.endpoint}</TableCell>
                    <TableCell>{item.avgResponseTime}ms</TableCell>
                    <TableCell>{item.requests.toLocaleString()}</TableCell>
                    <TableCell>{item.errors}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(item.status)}>{item.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Recent warnings, errors, and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  variant={alert.severity === "critical" ? "destructive" : alert.severity === "warning" ? "warning" : "default"}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      {alert.severity === "critical" && <AlertTriangle className="h-4 w-4" />}
                      {alert.severity === "warning" && <AlertTriangle className="h-4 w-4" />}
                      {alert.severity === "info" && <Activity className="h-4 w-4" />}
                      <div>
                        <AlertTitle className="text-sm font-medium">{alert.message}</AlertTitle>
                        <AlertDescription className="text-xs flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" /> {formatTimestamp(alert.timestamp)}
                          {alert.resolved && (
                            <Badge variant="outline" className="ml-2">
                              Resolved
                            </Badge>
                          )}
                        </AlertDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="sr-only">Open menu</span>
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                          >
                            <path
                              d="M3 7.5C3 8.32843 2.32843 9 1.5 9C0.671573 9 0 8.32843 0 7.5C0 6.67157 0.671573 6 1.5 6C2.32843 6 3 6.67157 3 7.5ZM9 7.5C9 8.32843 8.32843 9 7.5 9C6.67157 9 6 8.32843 6 7.5C6 6.67157 6.67157 6 7.5 6C8.32843 6 9 6.67157 9 7.5ZM15 7.5C15 8.32843 14.3284 9 13.5 9C12.6716 9 12 8.32843 12 7.5C12 6.67157 12.6716 6 13.5 6C14.3284 6 15 6.67157 15 7.5Z"
                              fill="currentColor"
                            />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        {!alert.resolved && <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>}
                        <DropdownMenuItem>Dismiss</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Alert>
              ))}
            </div>
            <Button variant="link" size="sm" className="mt-4">
              View all alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
