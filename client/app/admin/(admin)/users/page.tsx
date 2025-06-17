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
import { ChevronDownIcon, PencilIcon, TrashIcon } from "@/icons";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Image from "next/image";

// Mock user data
const users = [
  {
    id: "u1",
    userName: "john_doe",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    roles: [{ id: "r1", name: "GUEST" }],
    profilePictureUrl: "/default.png",
    verified: true,
    active: true,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "u2",
    userName: "jane_smith",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    roles: [{ id: "r1", name: "GUEST" }, { id: "r3", name: "HOST" }],
    profilePictureUrl: "/default.png",
    verified: true,
    active: true,
    createdAt: "2024-02-10T14:20:00Z",
  },
  {
    id: "u3",
    userName: "admin_user",
    firstName: "Admin",
    lastName: "User",
    email: "admin@expaq.com",
    roles: [{ id: "r1", name: "GUEST" }, { id: "r2", name: "ADMIN" }],
    profilePictureUrl: "/default.png",
    verified: true,
    active: true,
    createdAt: "2023-12-05T09:15:00Z",
  },
  {
    id: "u4",
    userName: "host_expert",
    firstName: "Host",
    lastName: "Expert",
    email: "host.expert@example.com",
    roles: [{ id: "r1", name: "GUEST" }, { id: "r3", name: "HOST" }],
    profilePictureUrl: "/default.png",
    verified: true,
    active: true,
    createdAt: "2024-03-01T11:45:00Z",
  },
  {
    id: "u5",
    userName: "new_user",
    firstName: "New",
    lastName: "User",
    email: "new.user@example.com",
    roles: [{ id: "r1", name: "GUEST" }],
    profilePictureUrl: "/default.png",
    verified: false,
    active: true,
    createdAt: "2024-06-10T16:30:00Z",
  },
  {
    id: "u6",
    userName: "inactive_user",
    firstName: "Inactive",
    lastName: "User",
    email: "inactive@example.com",
    roles: [{ id: "r1", name: "GUEST" }],
    profilePictureUrl: "/default.png",
    verified: true,
    active: false,
    createdAt: "2024-04-20T13:10:00Z",
  }
];

export default function UsersPage() {
  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      searchTerm === "" || 
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      roleFilter === "all" || 
      user.roles.some(role => role.name === roleFilter);
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && user.active) ||
      (statusFilter === "inactive" && !user.active) ||
      (statusFilter === "verified" && user.verified) ||
      (statusFilter === "unverified" && !user.verified);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Toggle selection of all users
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // Toggle selection of a single user
  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
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
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage all users, hosts, and administrators on the platform.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Users</CardTitle>
          <CardDescription>All users registered on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters and actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex flex-1 gap-4">
              <Input 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="GUEST">Guest</SelectItem>
                  <SelectItem value="HOST">Host</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline">Export</Button>
              <Button variant="default">Add User</Button>
            </div>
          </div>

          {/* Bulk actions */}
          {selectedUsers.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-4 flex items-center">
              <span className="mr-4">{selectedUsers.length} users selected</span>
              <div className="space-x-2">
                <Button variant="outline" size="sm">Verify</Button>
                <Button variant="outline" size="sm">Deactivate</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </div>
          )}

          {/* Users table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} 
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No users found matching the filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)} 
                          onCheckedChange={() => toggleSelectUser(user.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden">
                            <Image 
                              src={user.profilePictureUrl} 
                              alt={user.userName} 
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-gray-500">@{user.userName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map(role => (
                            <Badge 
                              key={role.id} 
                              variant={role.name === "ADMIN" ? "destructive" : role.name === "HOST" ? "outline" : "secondary"}
                            >
                              {role.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={user.active ? "success" : "default"}>
                            {user.active ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant={user.verified ? "outline" : "warning"}>
                            {user.verified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
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
                            <DropdownMenuItem>Edit details</DropdownMenuItem>
                            <DropdownMenuItem>Login as user</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              {user.active ? "Deactivate account" : "Activate account"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {user.verified ? "Remove verification" : "Verify user"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Delete account</DropdownMenuItem>
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
        </CardContent>
      </Card>
    </div>
  );
}
