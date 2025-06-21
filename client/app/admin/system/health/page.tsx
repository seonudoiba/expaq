"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
 
} from "recharts";
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Clock,
  Server,
  Database,
  Globe,
  MailCheck,
  CreditCard,
  HardDrive,
  BarChart3,
  Search,
} from "lucide-react";

// Mock data for service status
const serviceStatus = [
  {
    name: "API Gateway",
    status: "operational",
    responseTime: 42,
    lastChecked: "2023-07-12T15:45:12Z",
    uptime: "99.998%",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    name: "Database Cluster",
    status: "operational",
    responseTime: 28,
    lastChecked: "2023-07-12T15:45:10Z",
    uptime: "99.997%",
    icon: <Database className="h-5 w-5" />,
  },
  {
    name: "Storage Service",
    status: "operational",
    responseTime: 35,
    lastChecked: "2023-07-12T15:45:09Z",
    uptime: "99.995%",
    icon: <HardDrive className="h-5 w-5" />,
  },
  {
    name: "Auth Service",
    status: "operational",
    responseTime: 32,
    lastChecked: "2023-07-12T15:45:08Z",
    uptime: "99.999%",
    icon: <Server className="h-5 w-5" />,
  },
  {
    name: "Payment Processing",
    status: "degraded",
    responseTime: 432,
    lastChecked: "2023-07-12T15:45:07Z",
    uptime: "99.95%",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    name: "Email Service",
    status: "operational",
    responseTime: 65,
    lastChecked: "2023-07-12T15:45:06Z",
    uptime: "99.99%",
    icon: <MailCheck className="h-5 w-5" />,
  },
  {
    name: "Search Engine",
    status: "incident",
    responseTime: 1250,
    lastChecked: "2023-07-12T15:45:05Z",
    uptime: "98.75%",
    icon: <Search className="h-5 w-5" />,
  },
  {
    name: "Analytics Pipeline",
    status: "operational",
    responseTime: 78,
    lastChecked: "2023-07-12T15:45:04Z",
    uptime: "99.98%",
    icon: <BarChart3 className="h-5 w-5" />,
  },
];

// Mock data for response times
const responseTimeHistory = [
  { time: "00:00", api: 38, db: 22, auth: 30, payments: 85, search: 48 },
  { time: "03:00", api: 42, db: 24, auth: 28, payments: 90, search: 52 },
  { time: "06:00", api: 45, db: 26, auth: 32, payments: 110, search: 56 },
  { time: "09:00", api: 39, db: 28, auth: 35, payments: 130, search: 62 },
  { time: "12:00", api: 52, db: 32, auth: 38, payments: 350, search: 420 },
  { time: "15:00", api: 42, db: 28, auth: 32, payments: 432, search: 1250 },
];

// Mock data for incident history
const incidentHistory = [
  {
    id: "incident-001",
    service: "Search Engine",
    startTime: "2023-07-12T12:15:00Z",
    status: "investigating",
    impact: "high",
    description: "Increased latency and error rates in search results",
    updates: [
      { timestamp: "2023-07-12T12:15:00Z", message: "Investigating increased error rates in search service" },
      { timestamp: "2023-07-12T12:30:00Z", message: "Identified issue with search indexing nodes. Working on recovery." },
      { timestamp: "2023-07-12T13:15:00Z", message: "Adding capacity to the search cluster to handle load" },
      { timestamp: "2023-07-12T14:00:00Z", message: "Search performance still degraded. Estimated resolution time: 17:00 UTC" },
    ],
  },
  {
    id: "incident-002",
    service: "Payment Processing",
    startTime: "2023-07-12T14:30:00Z",
    status: "identified",
    impact: "medium",
    description: "Elevated response times for payment transactions",
    updates: [
      { timestamp: "2023-07-12T14:30:00Z", message: "Investigating slow response times from payment gateway" },
      { timestamp: "2023-07-12T14:45:00Z", message: "Identified high load on payment processing servers" },
      { timestamp: "2023-07-12T15:15:00Z", message: "Working with payment provider to increase capacity" },
    ],
  },
  {
    id: "incident-003",
    service: "API Gateway",
    startTime: "2023-07-11T08:45:00Z",
    endTime: "2023-07-11T10:30:00Z",
    status: "resolved",
    impact: "low",
    description: "Intermittent 5xx errors for some API endpoints",
    updates: [
      { timestamp: "2023-07-11T08:45:00Z", message: "Investigating reports of intermittent API errors" },
      { timestamp: "2023-07-11T09:15:00Z", message: "Identified caching issue in API gateway" },
      { timestamp: "2023-07-11T10:00:00Z", message: "Deploying fix to API gateway nodes" },
      { timestamp: "2023-07-11T10:30:00Z", message: "Incident resolved. Monitoring for any further issues." },
    ],
  },
];

// Mock data for scheduled maintenance
const scheduledMaintenance = [
  {
    id: "maintenance-001",
    title: "Database Cluster Upgrade",
    scheduledStart: "2023-07-15T02:00:00Z",
    scheduledEnd: "2023-07-15T05:00:00Z",
    services: ["Database Cluster"],
    description: "Upgrading database cluster to latest version for improved performance and security patches.",
    expectedImpact: "Brief periods of read-only access. No downtime expected.",
  },
  {
    id: "maintenance-002",
    title: "Network Infrastructure Maintenance",
    scheduledStart: "2023-07-18T01:00:00Z",
    scheduledEnd: "2023-07-18T03:00:00Z",
    services: ["API Gateway", "Storage Service"],
    description: "Routine network infrastructure maintenance to improve reliability and throughput.",
    expectedImpact: "Possible brief interruptions (1-2 minutes) during failover testing.",
  },
  {
    id: "maintenance-003",
    title: "Search Engine Reindexing",
    scheduledStart: "2023-07-20T03:00:00Z",
    scheduledEnd: "2023-07-20T07:00:00Z",
    services: ["Search Engine"],
    description: "Full reindexing of search database to improve query performance.",
    expectedImpact: "Search results may be incomplete or slightly outdated during the maintenance window.",
  },
];

// Get status indicator badge and icon
const getStatusIndicator = (status: string) => {
  switch (status.toLowerCase()) {
    case "operational":
      return {
        badge: <Badge variant="success">Operational</Badge>,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      };
    case "degraded":
      return {
        badge: <Badge variant="warning">Degraded</Badge>,
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      };
    case "incident":
      return {
        badge: <Badge variant="destructive">Incident</Badge>,
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      };
    case "maintenance":
      return {
        badge: <Badge variant="secondary">Maintenance</Badge>,
        icon: <Clock className="h-5 w-5 text-blue-500" />,
      };
    default:
      return {
        badge: <Badge>Unknown</Badge>,
        icon: <AlertCircle className="h-5 w-5" />,
      };
  }
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
};

// Calculate overall system health (simple version)
const calculateSystemHealth = () => {
  const operational = serviceStatus.filter((service) => service.status === "operational").length;
  const total = serviceStatus.length;
  
  if (operational === total) return "healthy";
  if (operational >= total * 0.8) return "degraded";
  return "critical";
};

export default function SystemHealthPage() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const systemHealth = calculateSystemHealth();
  
  const handleRefresh = () => {
    setLastUpdated(new Date());
    // In a real app, you'd fetch fresh data here
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Health</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Overall System Status */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {systemHealth === "healthy" && (
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              )}
              {systemHealth === "degraded" && (
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              )}
              {systemHealth === "critical" && (
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">
                  {systemHealth === "healthy" && "All Systems Operational"}
                  {systemHealth === "degraded" && "Some Systems Degraded"}
                  {systemHealth === "critical" && "Major System Outage"}
                </h2>
                <p className="text-muted-foreground">
                  {serviceStatus.filter((s) => s.status === "operational").length} of {serviceStatus.length} services operational
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <Button variant="outline" size="sm" className="mr-2">Subscribe to Updates</Button>
              <Button variant="default" size="sm">View Status Page</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="current">
        <TabsList className="mb-4">
          <TabsTrigger value="current">Current Status</TabsTrigger>
          <TabsTrigger value="incidents">Active Incidents</TabsTrigger>
          <TabsTrigger value="maintenance">Scheduled Maintenance</TabsTrigger>
          <TabsTrigger value="history">Incident History</TabsTrigger>
        </TabsList>

        {/* Current Status Tab */}
        <TabsContent value="current">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>Current operational status of all platform services</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Service</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[120px]">Response Time</TableHead>
                      <TableHead className="w-[120px]">Uptime</TableHead>
                      <TableHead className="w-[180px]">Last Checked</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceStatus.map((service) => (
                      <TableRow key={service.name}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {service.icon}
                            <span className="font-medium">{service.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusIndicator(service.status).badge}
                        </TableCell>
                        <TableCell>
                          <span className={
                            service.responseTime > 300
                              ? "text-red-500 font-medium"
                              : service.responseTime > 100
                              ? "text-yellow-500 font-medium"
                              : "text-green-500 font-medium"
                          }>
                            {service.responseTime} ms
                          </span>
                        </TableCell>
                        <TableCell>{service.uptime}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(service.lastChecked)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Times (Last 24 Hours)</CardTitle>
                <CardDescription>Monitoring service response times over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="api" name="API Gateway" stroke="#8884d8" />
                    <Line type="monotone" dataKey="db" name="Database" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="auth" name="Auth Service" stroke="#ffc658" />
                    <Line type="monotone" dataKey="payments" name="Payments" stroke="#ff8042" />
                    <Line type="monotone" dataKey="search" name="Search" stroke="#ff0000" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Active Incidents Tab */}
        <TabsContent value="incidents">
          <div className="grid gap-6">
            {incidentHistory
              .filter((incident) => !incident.endTime)
              .map((incident) => (
                <Card key={incident.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {incident.status === "investigating" && (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        {incident.status === "identified" && (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        )}
                        <CardTitle>{incident.service}: {incident.description}</CardTitle>
                      </div>
                      <Badge 
                        variant={
                          incident.impact === "high" 
                            ? "destructive" 
                            : incident.impact === "medium" 
                            ? "warning" 
                            : "secondary"
                        }
                      >
                        {incident.impact.toUpperCase()} Impact
                      </Badge>
                    </div>
                    <CardDescription>
                      Started {formatDate(incident.startTime)} • Status: {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="font-medium">Updates:</h3>
                      <div className="space-y-3">
                        {incident.updates.map((update, index) => (
                          <div key={index} className="flex gap-3 items-start pb-3 border-b last:border-0">
                            <div className="h-6 w-6 rounded-full border border-gray-200 flex-shrink-0 flex items-center justify-center">
                              <Clock className="h-3 w-3 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm">{update.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(update.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Subscribe to Updates</Button>
                        <Button size="sm">View Detailed Status</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {incidentHistory.filter((incident) => !incident.endTime).length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-center">No Active Incidents</h2>
                    <p className="text-muted-foreground text-center mt-2">
                      All systems are operating normally at this time
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Scheduled Maintenance Tab */}
        <TabsContent value="maintenance">
          <div className="grid gap-6">
            {scheduledMaintenance.map((maintenance) => (
              <Card key={maintenance.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{maintenance.title}</CardTitle>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                  <CardDescription>
                    {formatDate(maintenance.scheduledStart)} - {formatDate(maintenance.scheduledEnd)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Description</h3>
                      <p>{maintenance.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Affected Services</h3>
                      <div className="flex flex-wrap gap-2">
                        {maintenance.services.map((service) => (
                          <Badge key={service} variant="secondary">{service}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Expected Impact</h3>
                      <Alert variant="default">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Service Impact</AlertTitle>
                        <AlertDescription>{maintenance.expectedImpact}</AlertDescription>
                      </Alert>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">Add to Calendar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Incident History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Past Incidents</CardTitle>
              <CardDescription>History of resolved system incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {incidentHistory
                  .filter((incident) => incident.endTime)
                  .map((incident) => (
                    <div key={incident.id} className="pb-6 border-b last:border-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <h3 className="font-bold">{incident.service}: {incident.description}</h3>
                        </div>
                        <Badge variant="outline">Resolved</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {formatDate(incident.startTime)} - {formatDate(incident.endTime as string)}
                      </div>
                      <div className="mt-3 space-y-2">
                        <p className="text-sm">{incident.updates[incident.updates.length - 1].message}</p>
                        <Button variant="link" size="sm" className="p-0">View incident details</Button>
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
