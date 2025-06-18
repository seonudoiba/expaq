"use client"


import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpIcon, 
  ArrowDownIcon
} from "@/icons";

// Custom icon components
const UserCircleIcon = ({ className }: { className?: string }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z" 
      fill="currentColor"
    />
  </svg>
);

const BoxIconLine = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.665 3.75621C11.8762 3.65064 12.1247 3.65064 12.3358 3.75621L18.7807 6.97856L12.3358 10.2009C12.1247 10.3065 11.8762 10.3065 11.665 10.2009L5.22014 6.97856L11.665 3.75621ZM4.29297 8.19203V16.0946C4.29297 16.3787 4.45347 16.6384 4.70757 16.7654L11.25 20.0366V11.6513C11.1631 11.6205 11.0777 11.5843 10.9942 11.5426L4.29297 8.19203ZM12.75 20.037L19.2933 16.7654C19.5474 16.6384 19.7079 16.3787 19.7079 16.0946V8.19202L13.0066 11.5426C12.9229 11.5844 12.8372 11.6208 12.75 11.6516V20.037ZM13.0066 2.41456C12.3732 2.09786 11.6277 2.09786 10.9942 2.41456L4.03676 5.89319C3.27449 6.27432 2.79297 7.05342 2.79297 7.90566V16.0946C2.79297 16.9469 3.27448 17.726 4.03676 18.1071L10.9942 21.5857L11.3296 20.9149L10.9942 21.5857C11.6277 21.9024 12.3732 21.9024 13.0066 21.5857L19.9641 18.1071C20.7264 17.726 21.2079 16.9469 21.2079 16.0946V7.90566C21.2079 7.05342 20.7264 6.27432 19.9641 5.89319L13.0066 2.41456Z"
      fill="currentColor"
    />
  </svg>
);

const PieChartIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C11.5858 2 11.25 2.33579 11.25 2.75V12C11.25 12.4142 11.5858 12.75 12 12.75H21.25C21.6642 12.75 22 12.4142 22 12C22 6.47715 17.5228 2 12 2ZM12.75 11.25V3.53263C13.2645 3.57761 13.7659 3.66843 14.25 3.80098V3.80099C15.6929 4.19606 16.9827 4.96184 18.0104 5.98959C19.0382 7.01734 19.8039 8.30707 20.199 9.75C20.3316 10.2341 20.4224 10.7355 20.4674 11.25H12.75ZM2 12C2 7.25083 5.31065 3.27489 9.75 2.25415V3.80099C6.14748 4.78734 3.5 8.0845 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C15.9155 20.5 19.2127 17.8525 20.199 14.25H21.7459C20.7251 18.6894 16.7492 22 12 22C6.47715 22 2 17.5229 2 12Z"
      fill="currentColor"
    />
  </svg>
);
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart, 
  Pie,
  Cell
} from "recharts";

// Mock data for platform overview
const platformMetrics = [
  {
    title: "Total Users",
    value: "12,856",
    change: "+15.3%",
    trend: "up",
    icon: <UserCircleIcon className="h-8 w-8" />,
    description: "Total users on the platform"
  },
  {
    title: "Total Hosts",
    value: "1,432",
    change: "+8.7%",
    trend: "up",
    icon: <UserCircleIcon className="h-8 w-8" />,
    description: "Total hosts on the platform"
  },
  {
    title: "Active Activities",
    value: "3,245",
    change: "+12.4%",
    trend: "up",
    icon: <BoxIconLine className="h-8 w-8" />,
    description: "Currently active experiences"
  },
  {
    title: "Revenue (Month)",
    value: "$143,245",
    change: "+23.6%",
    trend: "up",
    icon: <PieChartIcon className="h-8 w-8" />,
    description: "Platform revenue this month"
  }
];

// Mock data for the growth chart
const growthData = [
  { month: "Jan", users: 2500, hosts: 350, activities: 1200 },
  { month: "Feb", users: 3000, hosts: 400, activities: 1300 },
  { month: "Mar", users: 3400, hosts: 450, activities: 1450 },
  { month: "Apr", users: 4200, hosts: 480, activities: 1500 },
  { month: "May", users: 4800, hosts: 520, activities: 1700 },
  { month: "Jun", users: 5200, hosts: 550, activities: 1900 },
  { month: "Jul", users: 6100, hosts: 600, activities: 2200 },
  { month: "Aug", users: 6800, hosts: 700, activities: 2300 },
  { month: "Sep", users: 7500, hosts: 750, activities: 2500 },
  { month: "Oct", users: 8300, hosts: 820, activities: 2700 },
  { month: "Nov", users: 9100, hosts: 950, activities: 2900 },
  { month: "Dec", users: 10000, hosts: 1000, activities: 3100 },
];

// Mock data for activity categories
const activityCategoryData = [
  { name: "Cooking Classes", value: 30 },
  { name: "Language Exchange", value: 25 },
  { name: "Outdoor Adventures", value: 20 },
  { name: "Local Tours", value: 15 },
  { name: "Art & Craft", value: 10 }
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Mock data for pending items
const pendingItems = [
  { type: "Host Verification", count: 24 },
  { type: "Activity Approval", count: 37 },
  { type: "Refund Requests", count: 12 },
  { type: "User Reports", count: 7 },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome back. Here&apos;s a comprehensive view of your platform&apos;s performance.
        </p>
      </div>
      
      {/* Alerts and notifications for admin */}
      <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
        <AlertTitle className="text-amber-800 dark:text-amber-400">Action Required</AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          There are <strong>37</strong> new activities pending review and <strong>24</strong> host verification requests.
        </AlertDescription>
      </Alert>

      {/* Platform metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformMetrics.map((metric, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {metric.title}
                </CardTitle>
                <div className="p-2 bg-gray-100 rounded-md dark:bg-gray-800">
                  {metric.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`flex items-center ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {metric.trend === "up" ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main dashboard content with tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending Items</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        
        {/* Platform Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Growth Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
                <CardDescription>User, host, and activity growth over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHosts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorActivities" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorUsers)" 
                      name="Total Users"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="hosts" 
                      stroke="#82ca9d" 
                      fillOpacity={1} 
                      fill="url(#colorHosts)"
                      name="Hosts" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="activities" 
                      stroke="#ffc658" 
                      fillOpacity={1} 
                      fill="url(#colorActivities)"
                      name="Activities" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Categories</CardTitle>
                <CardDescription>Distribution of experiences by category</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityCategoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {activityCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Regional Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Activities by location</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'New York', value: 24 },
                      { name: 'London', value: 18 },
                      { name: 'Tokyo', value: 15 },
                      { name: 'Paris', value: 12 },
                      { name: 'Sydney', value: 8 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Activities" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pending Items Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Actions</CardTitle>
              <CardDescription>Items requiring admin attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="font-medium">{item.type}</div>
                    <div className="flex items-center">
                      <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 flex items-center justify-center mr-2">
                        {item.count}
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Statistics</CardTitle>
              <CardDescription>Performance across all activities</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Cooking', activeCount: 230, completedCount: 420, cancelledCount: 30 },
                    { name: 'Language', activeCount: 180, completedCount: 350, cancelledCount: 25 },
                    { name: 'Tours', activeCount: 280, completedCount: 510, cancelledCount: 45 },
                    { name: 'Sports', activeCount: 190, completedCount: 320, cancelledCount: 20 },
                    { name: 'Arts', activeCount: 140, completedCount: 270, cancelledCount: 15 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="activeCount" stackId="a" fill="#8884d8" name="Active" />
                  <Bar dataKey="completedCount" stackId="a" fill="#82ca9d" name="Completed" />
                  <Bar dataKey="cancelledCount" stackId="a" fill="#ffc658" name="Cancelled" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Create User", icon: "👤", link: "/admin/users/new" },
              { name: "New Activity", icon: "🔆", link: "/admin/activities/new" },
              { name: "Verify Host", icon: "✅", link: "/admin/users/hosts/verification" },
              { name: "Featured", icon: "⭐", link: "/admin/activities/featured" },
              { name: "Reports", icon: "📊", link: "/admin/analytics/overview" },
              { name: "Settings", icon: "⚙️", link: "/admin/settings/general" },
            ].map((action, idx) => (
              <a 
                key={idx}
                href={action.link}
                className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="text-2xl mb-1">{action.icon}</div>
                <div className="text-sm text-center">{action.name}</div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
