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
  Cell,
  PieChart,
  Pie
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {  Download, FilterIcon, Map, GlobeIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for geographic analytics
const countryData = [
  { country: "United States", participants: 845, revenue: 126750 },
  { country: "United Kingdom", participants: 562, revenue: 84300 },
  { country: "Germany", participants: 327, revenue: 49050 },
  { country: "Canada", participants: 426, revenue: 63900 },
  { country: "Australia", participants: 295, revenue: 44250 },
  { country: "France", participants: 214, revenue: 32100 },
  { country: "Spain", participants: 186, revenue: 27900 },
  { country: "Italy", participants: 167, revenue: 25050 },
  { country: "Japan", participants: 124, revenue: 18600 },
  { country: "Other", participants: 100, revenue: 15000 }
];

const cityData = [
  { city: "New York", participants: 245, revenue: 36750 },
  { city: "London", participants: 218, revenue: 32700 },
  { city: "Berlin", participants: 145, revenue: 21750 },
  { city: "Toronto", participants: 132, revenue: 19800 },
  { city: "Sydney", participants: 118, revenue: 17700 },
  { city: "Paris", participants: 106, revenue: 15900 },
  { city: "Barcelona", participants: 94, revenue: 14100 },
  { city: "Rome", participants: 87, revenue: 13050 },
  { city: "Tokyo", participants: 78, revenue: 11700 },
  { city: "Chicago", participants: 72, revenue: 10800 }
];

const continentData = [
  { name: "North America", value: 45, color: "#4f46e5" },
  { name: "Europe", value: 32, color: "#8b5cf6" },
  { name: "Asia", value: 12, color: "#a78bfa" },
  { name: "Oceania", value: 8, color: "#c4b5fd" },
  { name: "South America", value: 2, color: "#d8b4fe" },
  { name: "Africa", value: 1, color: "#e9d5ff" }
];

const languageData = [
  { language: "English", count: 2148, percentage: 66 },
  { language: "Spanish", count: 426, percentage: 13 },
  { language: "German", count: 295, percentage: 9 },
  { language: "French", count: 198, percentage: 6 },
  { language: "Italian", count: 126, percentage: 4 },
  { language: "Other", count: 53, percentage: 2 }
];

const regionalPerformanceData = [
  { region: "North America", bookingRate: 84, avgGroupSize: 2.7, avgRating: 4.8 },
  { region: "Europe", bookingRate: 78, avgGroupSize: 2.3, avgRating: 4.7 },
  { region: "Asia", bookingRate: 72, avgGroupSize: 3.2, avgRating: 4.6 },
  { region: "Oceania", bookingRate: 82, avgGroupSize: 2.5, avgRating: 4.8 },
  { region: "South America", bookingRate: 68, avgGroupSize: 2.9, avgRating: 4.5 },
  { region: "Africa", bookingRate: 65, avgGroupSize: 3.5, avgRating: 4.6 }
];

export default function RegionsAnalytics() {
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [activityFilter, setActivityFilter] = useState<string>("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Geographic Data</h1>
          <p className="text-muted-foreground">
            Analyze participant locations and regional performance
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
            <CardTitle className="text-sm font-medium">Countries Reached</CardTitle>
            <GlobeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+6 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cities Reached</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
            <p className="text-xs text-muted-foreground">+23 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Country</CardTitle>
            <GlobeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">United States</div>
            <p className="text-xs text-muted-foreground">26% of participants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top City</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">New York</div>
            <p className="text-xs text-muted-foreground">245 participants</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different geographic analytics views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="cities">Cities</TabsTrigger>
          <TabsTrigger value="performance">Regional Performance</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Continent Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Participant Distribution by Continent</CardTitle>
                <CardDescription>
                  Percentage of participants from different continents
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={continentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {continentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Countries */}
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Countries</CardTitle>
                <CardDescription>
                  Countries with the highest number of participants
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={countryData.slice(0, 10)} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="country" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="participants" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle>Participant Languages</CardTitle>
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
                    {languageData.map(item => (
                      <TableRow key={item.language}>
                        <TableCell>{item.language}</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                        <TableCell className="text-right">{item.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Regional Performance Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance Overview</CardTitle>
                <CardDescription>
                  Key metrics by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Region</TableHead>
                      <TableHead className="text-right">Booking Rate</TableHead>
                      <TableHead className="text-right">Avg. Group Size</TableHead>
                      <TableHead className="text-right">Avg. Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regionalPerformanceData.slice(0, 4).map(region => (
                      <TableRow key={region.region}>
                        <TableCell>{region.region}</TableCell>
                        <TableCell className="text-right">{region.bookingRate}%</TableCell>
                        <TableCell className="text-right">{region.avgGroupSize}</TableCell>
                        <TableCell className="text-right">{region.avgRating}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Countries Tab */}
        <TabsContent value="countries" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Countries by Participants */}
            <Card>
              <CardHeader>
                <CardTitle>Top Countries by Participants</CardTitle>
                <CardDescription>
                  Countries with the highest number of participants
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={countryData.slice(0, 10)}>
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="participants" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Countries by Revenue */}
            <Card>
              <CardHeader>
                <CardTitle>Top Countries by Revenue</CardTitle>
                <CardDescription>
                  Countries generating the highest revenue
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={countryData.slice(0, 10)}>
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Country Breakdown</CardTitle>
              <CardDescription>
                Detailed country-by-country analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Participants</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Avg. Order</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countryData.map(country => (
                    <TableRow key={country.country}>
                      <TableCell className="font-medium">{country.country}</TableCell>
                      <TableCell className="text-right">{country.participants}</TableCell>
                      <TableCell className="text-right">${country.revenue}</TableCell>
                      <TableCell className="text-right">${(country.revenue / country.participants).toFixed(2)}</TableCell>
                      <TableCell className="text-right">{(country.participants / 3246 * 100).toFixed(1)}%</TableCell>
                      <TableCell>
                        {country.country === "United States" || country.country === "United Kingdom" || country.country === "Australia" ? (
                          <Badge className="bg-green-100 text-green-800">Growing</Badge>
                        ) : country.country === "Germany" || country.country === "Canada" ? (
                          <Badge className="bg-blue-100 text-blue-800">Stable</Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800">New Market</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cities Tab */}
        <TabsContent value="cities" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Cities by Participants */}
            <Card>
              <CardHeader>
                <CardTitle>Top Cities by Participants</CardTitle>
                <CardDescription>
                  Cities with the highest number of participants
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cityData.slice(0, 10)}>
                    <XAxis dataKey="city" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="participants" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Cities by Revenue */}
            <Card>
              <CardHeader>
                <CardTitle>Top Cities by Revenue</CardTitle>
                <CardDescription>
                  Cities generating the highest revenue
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cityData.slice(0, 10)}>
                    <XAxis dataKey="city" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>City Breakdown</CardTitle>
              <CardDescription>
                Detailed city-by-city analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead className="text-right">Participants</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Avg. Order</TableHead>
                    <TableHead>Most Popular Activity</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cityData.map(city => (
                    <TableRow key={city.city}>
                      <TableCell className="font-medium">{city.city}</TableCell>
                      <TableCell className="text-right">{city.participants}</TableCell>
                      <TableCell className="text-right">${city.revenue}</TableCell>
                      <TableCell className="text-right">${(city.revenue / city.participants).toFixed(2)}</TableCell>
                      <TableCell>
                        {city.city === "New York" || city.city === "Chicago" ? "Cooking Class" :
                        city.city === "London" || city.city === "Berlin" || city.city === "Paris" ? "City Tour" :
                        city.city === "Toronto" || city.city === "Sydney" ? "Wine Tasting" :
                        city.city === "Barcelona" || city.city === "Rome" ? "Art Workshop" : "Language Exchange"}
                      </TableCell>
                      <TableCell>
                        {city.city === "New York" || city.city === "London" || city.city === "Berlin" ? (
                          <Badge className="bg-green-100 text-green-800">Growing</Badge>
                        ) : city.city === "Toronto" || city.city === "Sydney" ? (
                          <Badge className="bg-blue-100 text-blue-800">Stable</Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800">Emerging</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Booking Rate by Region */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Rate by Region</CardTitle>
                <CardDescription>
                  Comparison of booking rates across regions
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionalPerformanceData}>
                    <XAxis dataKey="region" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Booking Rate"]} />
                    <Bar dataKey="bookingRate" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Average Group Size by Region */}
            <Card>
              <CardHeader>
                <CardTitle>Average Group Size by Region</CardTitle>
                <CardDescription>
                  Average number of participants per booking
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionalPerformanceData}>
                    <XAxis dataKey="region" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="avgGroupSize" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Average Rating by Region */}
            <Card>
              <CardHeader>
                <CardTitle>Average Rating by Region</CardTitle>
                <CardDescription>
                  Average review ratings across regions
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionalPerformanceData}>
                    <XAxis dataKey="region" />
                    <YAxis domain={[3.8, 5]} ticks={[3.8, 4.0, 4.2, 4.4, 4.6, 4.8, 5.0]} />
                    <Tooltip />
                    <Bar dataKey="avgRating" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activity Preference by Region */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Preference by Region</CardTitle>
                <CardDescription>
                  Most popular activities by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Region</TableHead>
                      <TableHead>Most Popular</TableHead>
                      <TableHead>2nd Most Popular</TableHead>
                      <TableHead>3rd Most Popular</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>North America</TableCell>
                      <TableCell>Cooking Class</TableCell>
                      <TableCell>Wine Tasting</TableCell>
                      <TableCell>City Tour</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Europe</TableCell>
                      <TableCell>City Tour</TableCell>
                      <TableCell>Wine Tasting</TableCell>
                      <TableCell>Cooking Class</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Asia</TableCell>
                      <TableCell>Language Exchange</TableCell>
                      <TableCell>Cooking Class</TableCell>
                      <TableCell>Art Workshop</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Oceania</TableCell>
                      <TableCell>Wine Tasting</TableCell>
                      <TableCell>City Tour</TableCell>
                      <TableCell>Cooking Class</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>South America</TableCell>
                      <TableCell>Cooking Class</TableCell>
                      <TableCell>Dance Workshop</TableCell>
                      <TableCell>Language Exchange</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Africa</TableCell>
                      <TableCell>City Tour</TableCell>
                      <TableCell>Cooking Class</TableCell>
                      <TableCell>Art Workshop</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Regional Insights</CardTitle>
              <CardDescription>
                Key takeaways for each region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Growth Opportunity</TableHead>
                    <TableHead>Key Insight</TableHead>
                    <TableHead>Recommended Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>North America</TableCell>
                    <TableCell>Premium experiences with smaller group sizes</TableCell>
                    <TableCell>Highest revenue per participant, prefer weekend bookings</TableCell>
                    <TableCell>Increase pricing for exclusive experiences</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Europe</TableCell>
                    <TableCell>Expand cultural exchange activities</TableCell>
                    <TableCell>Strong interest in local culture, prefer weekday bookings</TableCell>
                    <TableCell>Create more authentic local experiences</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Asia</TableCell>
                    <TableCell>Focus on group bookings</TableCell>
                    <TableCell>Highest group size, strong interest in language/cuisine</TableCell>
                    <TableCell>Create family/group packages</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Oceania</TableCell>
                    <TableCell>Premium wine experiences</TableCell>
                    <TableCell>High spend per participant, strong ratings</TableCell>
                    <TableCell>Partner with local vineyards</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>South America</TableCell>
                    <TableCell>New market expansion</TableCell>
                    <TableCell>Growing interest, limited marketing exposure</TableCell>
                    <TableCell>Targeted social media campaigns</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Africa</TableCell>
                    <TableCell>Early market development</TableCell>
                    <TableCell>Limited bookings but high satisfaction</TableCell>
                    <TableCell>Partnerships with local tourism boards</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
