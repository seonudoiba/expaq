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
  PieChart,
  Pie,
  Cell 
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, FilterIcon, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for participant analytics
const participantsByActivityData = [
  { name: "Cooking Class", participants: 124 },
  { name: "City Tour", participants: 87 },
  { name: "Wine Tasting", participants: 56 },
  { name: "Language Exchange", participants: 45 },
  { name: "Art Workshop", participants: 32 },
];

const participantDemographicsData = [
  { age: "18-24", count: 78 },
  { age: "25-34", count: 136 },
  { age: "35-44", count: 82 },
  { age: "45-54", count: 43 },
  { age: "55+", count: 31 },
];

const monthlyParticipantsData = [
  { name: "Jan", total: 34 },
  { name: "Feb", total: 45 },
  { name: "Mar", total: 57 },
  { name: "Apr", total: 70 },
  { name: "May", total: 95 },
  { name: "Jun", total: 110 },
  { name: "Jul", total: 120 },
  { name: "Aug", total: 115 },
  { name: "Sep", total: 90 },
  { name: "Oct", total: 75 },
  { name: "Nov", total: 60 },
  { name: "Dec", total: 80 },
];

const repeatCustomerData = [
  { name: "First-time", value: 65, color: "#4f46e5" },
  { name: "Returning (2-3 times)", value: 25, color: "#8b5cf6" },
  { name: "Frequent (4+ times)", value: 10, color: "#c084fc" },
];

const groupSizeData = [
  { size: "Solo", count: 120 },
  { size: "Couple", count: 85 },
  { size: "Small Group (3-4)", count: 65 },
  { size: "Medium Group (5-8)", count: 40 },
  { size: "Large Group (9+)", count: 15 },
];

const recentParticipants = [
  { id: 1, name: "Emma Johnson", activity: "Cooking Class", date: "2023-10-15", group: 2 },
  { id: 2, name: "James Smith", activity: "City Tour", date: "2023-10-14", group: 1 },
  { id: 3, name: "Maria Garcia", activity: "Wine Tasting", date: "2023-10-13", group: 4 },
  { id: 4, name: "Robert Brown", activity: "Language Exchange", date: "2023-10-12", group: 2 },
  { id: 5, name: "Sophia Miller", activity: "Art Workshop", date: "2023-10-11", group: 3 },
];

export default function ParticipantsAnalytics() {
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [activityFilter, setActivityFilter] = useState<string>("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Participant Insights</h1>
          <p className="text-muted-foreground">
            Analyze participant demographics, trends, and behaviors
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
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,246</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Group Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.7</div>
            <p className="text-xs text-muted-foreground">+0.3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.8%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different participant analytics views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="recent">Recent Participants</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Monthly Participants Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Participant Trends</CardTitle>
                <CardDescription>
                  Total participant count over the last 12 months
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyParticipantsData}>
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip />
                    <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Participants by Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Participants by Activity</CardTitle>
                <CardDescription>
                  Distribution of participants across different activities
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={participantsByActivityData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="participants" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Repeat Customer Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Repeat Customer Breakdown</CardTitle>
                <CardDescription>
                  Distribution of first-time vs. returning participants
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={repeatCustomerData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {repeatCustomerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Group Size Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Group Size Distribution</CardTitle>
                <CardDescription>
                  Breakdown of participants by group size
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={groupSizeData}>
                    <XAxis dataKey="size" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#c084fc" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>
                  Breakdown of participants by age group
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={participantDemographicsData}>
                    <XAxis dataKey="age" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gender Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>
                  Breakdown of participants by gender
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Female", value: 52, color: "#8b5cf6" },
                        { name: "Male", value: 45, color: "#4f46e5" },
                        { name: "Non-binary/Other", value: 3, color: "#c084fc" }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: "Female", value: 52, color: "#8b5cf6" },
                        { name: "Male", value: 45, color: "#4f46e5" },
                        { name: "Non-binary/Other", value: 3, color: "#c084fc" }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>
                  Top countries/regions of participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Country/Region</TableHead>
                      <TableHead className="text-right">Participants</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>United States</TableCell>
                      <TableCell className="text-right">845</TableCell>
                      <TableCell className="text-right">26%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>United Kingdom</TableCell>
                      <TableCell className="text-right">562</TableCell>
                      <TableCell className="text-right">17%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Canada</TableCell>
                      <TableCell className="text-right">426</TableCell>
                      <TableCell className="text-right">13%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Germany</TableCell>
                      <TableCell className="text-right">327</TableCell>
                      <TableCell className="text-right">10%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Australia</TableCell>
                      <TableCell className="text-right">295</TableCell>
                      <TableCell className="text-right">9%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Language Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Language Preferences</CardTitle>
                <CardDescription>
                  Primary languages of participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Language</TableHead>
                      <TableHead className="text-right">Participants</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>English</TableCell>
                      <TableCell className="text-right">2,148</TableCell>
                      <TableCell className="text-right">66%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Spanish</TableCell>
                      <TableCell className="text-right">426</TableCell>
                      <TableCell className="text-right">13%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>French</TableCell>
                      <TableCell className="text-right">295</TableCell>
                      <TableCell className="text-right">9%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>German</TableCell>
                      <TableCell className="text-right">198</TableCell>
                      <TableCell className="text-right">6%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Other</TableCell>
                      <TableCell className="text-right">179</TableCell>
                      <TableCell className="text-right">6%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Booking Lead Time */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Lead Time</CardTitle>
                <CardDescription>
                  How far in advance participants book activities
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Same day", value: 5, color: "#ef4444" },
                        { name: "1-7 days", value: 35, color: "#f97316" },
                        { name: "8-14 days", value: 25, color: "#eab308" },
                        { name: "15-30 days", value: 20, color: "#10b981" },
                        { name: "31+ days", value: 15, color: "#3b82f6" }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: "Same day", value: 5, color: "#ef4444" },
                        { name: "1-7 days", value: 35, color: "#f97316" },
                        { name: "8-14 days", value: 25, color: "#eab308" },
                        { name: "15-30 days", value: 20, color: "#10b981" },
                        { name: "31+ days", value: 15, color: "#3b82f6" }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Booking Device */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Device</CardTitle>
                <CardDescription>
                  Devices used by participants to book activities
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Mobile", value: 68, color: "#4f46e5" },
                        { name: "Desktop", value: 29, color: "#8b5cf6" },
                        { name: "Tablet", value: 3, color: "#c084fc" }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: "Mobile", value: 68, color: "#4f46e5" },
                        { name: "Desktop", value: 29, color: "#8b5cf6" },
                        { name: "Tablet", value: 3, color: "#c084fc" }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Referral Sources</CardTitle>
              <CardDescription>
                How participants discover your activities
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { source: "Direct Search", count: 42 },
                  { source: "Social Media", count: 28 },
                  { source: "Recommendations", count: 15 },
                  { source: "Email Marketing", count: 8 },
                  { source: "Partners", count: 5 },
                  { source: "Other", count: 2 },
                ]}>
                  <XAxis dataKey="source" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Participants Tab */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Participants</CardTitle>
              <CardDescription>
                The latest participants in your activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Group Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentParticipants.map(participant => (
                    <TableRow key={participant.id}>
                      <TableCell className="font-medium">{participant.name}</TableCell>
                      <TableCell>{participant.activity}</TableCell>
                      <TableCell>{participant.date}</TableCell>
                      <TableCell className="text-right">{participant.group}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
