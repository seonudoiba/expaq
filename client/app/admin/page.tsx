"use client"

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { platformMetrics, pendingItems, COLORS, activityCategoryData, growthData } from "@/lib/mockDatas";
import { UserCircleIcon, BoxIconLine, PieChartIcon, ArrowUpIcon, ArrowDownIcon } from "@/components/admin/AdminIcons";


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
                  {metric.icon === "UserCircle" ? (
                    <UserCircleIcon className="w-5 h-5" />
                  ) : metric.icon === "Box" ? (
                    <BoxIconLine className="w-5 h-5" />
                  ) : metric.icon === "PieChart" ? (
                    <PieChartIcon className="w-5 h-5" />
                  ) : null}
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
