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
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Host } from "@/types/host";

// Mock hosts data
const hosts: Host[] = [
  {
    id: "h1",
    userName: "cooking_master",
    firstName: "Michael",
    lastName: "Johnson",
    email: "m.johnson@example.com",
    roles: [{ id: "r1", name: "GUEST" }, { id: "r3", name: "HOST" }],
    profilePictureUrl: "/default.png",
    bio: "Professional chef with 10+ years of experience teaching international cuisine.",
    createdAt: "2023-10-15T10:30:00Z",
    updatedAt: "2024-05-10T14:20:00Z",
    verified: true,
  },
  {
    id: "h2",
    userName: "adventure_guide",
    firstName: "Sarah",
    lastName: "Williams",
    email: "s.williams@example.com",
    roles: [{ id: "r1", name: "GUEST" }, { id: "r3", name: "HOST" }],
    profilePictureUrl: "/default.png",
    bio: "Mountain guide and outdoor adventure specialist.",
    createdAt: "2023-11-05T08:15:00Z",
    updatedAt: "2024-06-01T11:40:00Z",
    verified: true,
  },
  {
    id: "h3",
    userName: "yoga_instructor",
    firstName: "Emma",
    lastName: "Davis",
    email: "e.davis@example.com",
    roles: [{ id: "r1", name: "GUEST" }, { id: "r3", name: "HOST" }],
    profilePictureUrl: "/default.png",
    bio: "Certified yoga instructor with focus on mindfulness and wellness.",
    createdAt: "2024-01-20T15:45:00Z",
    updatedAt: "2024-05-25T09:30:00Z",
    verified: false,
  },
  {
    id: "h4",
    userName: "city_explorer",
    firstName: "David",
    lastName: "Brown",
    email: "d.brown@example.com",
    roles: [{ id: "r1", name: "GUEST" }, { id: "r3", name: "HOST" }],
    profilePictureUrl: "/default.png",
    bio: "Local tour guide showing hidden gems in major cities.",
    createdAt: "2023-09-10T12:20:00Z",
    updatedAt: "2024-04-15T16:50:00Z",
    verified: true,
  },
  {
    id: "h5",
    userName: "language_teacher",
    firstName: "Anna",
    lastName: "Martinez",
    email: "a.martinez@example.com",
    roles: [{ id: "r1", name: "GUEST" }, { id: "r3", name: "HOST" }],
    profilePictureUrl: "/default.png",
    bio: "Multilingual language teacher offering immersive language experiences.",
    createdAt: "2024-02-25T09:10:00Z",
    updatedAt: "2024-06-05T13:40:00Z",
    verified: false,
  }
];

// Mock verification requests data
const verificationRequests = [
  {
    id: "v1",
    hostId: "h3",
    hostName: "Emma Davis",
    userName: "yoga_instructor",
    profilePictureUrl: "/default.png",
    documentType: "ID Card",
    documentUrl: "/default.png",
    submittedAt: "2024-05-20T14:30:00Z",
    status: "pending"
  },
  {
    id: "v2",
    hostId: "h5",
    hostName: "Anna Martinez",
    userName: "language_teacher",
    profilePictureUrl: "/default.png",
    documentType: "Passport",
    documentUrl: "/default.png",
    submittedAt: "2024-06-03T10:15:00Z",
    status: "pending"
  },
  {
    id: "v3",
    hostId: "h6",
    hostName: "Robert Lee",
    userName: "art_teacher",
    profilePictureUrl: "/default.png",
    documentType: "Driver's License",
    documentUrl: "/default.png",
    submittedAt: "2024-06-01T16:45:00Z",
    status: "pending"
  }
];

export default function HostsPage() {
  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);

  // Filter hosts based on search term and filters
  const filteredHosts = hosts.filter(host => {
    const matchesSearch = 
      searchTerm === "" || 
      host.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      host.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${host.firstName} ${host.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVerification = 
      verificationFilter === "all" || 
      (verificationFilter === "verified" && host.verified) ||
      (verificationFilter === "unverified" && !host.verified);
    
    return matchesSearch && matchesVerification;
  });

  // Toggle selection of all hosts
  const toggleSelectAll = () => {
    if (selectedHosts.length === filteredHosts.length) {
      setSelectedHosts([]);
    } else {
      setSelectedHosts(filteredHosts.map(host => host.id));
    }
  };

  // Toggle selection of a single host
  const toggleSelectHost = (hostId: string) => {
    if (selectedHosts.includes(hostId)) {
      setSelectedHosts(selectedHosts.filter(id => id !== hostId));
    } else {
      setSelectedHosts([...selectedHosts, hostId]);
    }
  };

  // Format date to readable string
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Host Management</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage all experience hosts and verify their credentials.
        </p>
      </div>

      <Tabs defaultValue="hosts" className="space-y-4">
        <TabsList className="bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="hosts">All Hosts</TabsTrigger>
          <TabsTrigger value="verification">Verification Requests</TabsTrigger>
        </TabsList>

        {/* All Hosts Tab */}
        <TabsContent value="hosts">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Hosts</CardTitle>
              <CardDescription>All experience hosts on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters and actions */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex flex-1 gap-4">
                  <Input 
                    placeholder="Search hosts..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by verification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Hosts</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 ml-auto">
                  <Button variant="outline">Export</Button>
                  <Button variant="default">Add Host</Button>
                </div>
              </div>

              {/* Bulk actions */}
              {selectedHosts.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-4 flex items-center">
                  <span className="mr-4">{selectedHosts.length} hosts selected</span>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Verify</Button>
                    <Button variant="outline" size="sm">Feature</Button>
                    <Button variant="destructive" size="sm">Deactivate</Button>
                  </div>
                </div>
              )}

              {/* Hosts table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedHosts.length === filteredHosts.length && filteredHosts.length > 0} 
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Bio</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Member Since</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHosts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No hosts found matching the filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredHosts.map(host => (
                        <TableRow key={host.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedHosts.includes(host.id)} 
                              onCheckedChange={() => toggleSelectHost(host.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                <Image 
                                  src={host.profilePictureUrl || "/default.png"} 
                                  alt={host.userName} 
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{host.firstName} {host.lastName}</div>
                                <div className="text-sm text-gray-500">@{host.userName}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{host.email}</TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">
                              {host.bio || "No bio provided"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={host.verified ? "success" : "warning"}>
                              {host.verified ? "Verified" : "Unverified"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(host.createdAt)}</TableCell>
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
                                <DropdownMenuItem>View profile</DropdownMenuItem>
                                <DropdownMenuItem>View activities</DropdownMenuItem>
                                <DropdownMenuItem>Edit details</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  {host.verified ? "Revoke verification" : "Verify host"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>Feature this host</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Deactivate host</DropdownMenuItem>
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

        {/* Verification Requests Tab */}
        <TabsContent value="verification">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Verification Requests</CardTitle>
              <CardDescription>Pending host verification requests.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Verification requests table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Host</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verificationRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No pending verification requests
                        </TableCell>
                      </TableRow>
                    ) : (
                      verificationRequests.map(request => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                <Image 
                                  src={request.profilePictureUrl} 
                                  alt={request.userName} 
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{request.hostName}</div>
                                <div className="text-sm text-gray-500">@{request.userName}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{request.documentType}</TableCell>
                          <TableCell>{formatDate(request.submittedAt)}</TableCell>
                          <TableCell>
                            <Badge variant="warning">
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">View Documents</Button>
                              <Button variant="success" size="sm">Approve</Button>
                              <Button variant="destructive" size="sm">Reject</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
