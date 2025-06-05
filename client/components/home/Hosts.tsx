'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/api/services';
import { UserProfile } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
const Hosts: React.FC = () => {
const {
    data: hostsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['hosts'],
    queryFn: authService.getHosts,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading hosts
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error instanceof Error ? error.message : 'An error occurred'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hosts = hostsResponse?.content;

  return (
    <div className="container py-12 px-4 w-11/12 mx-auto">
      <div className="text-center mb-8">
        <h6 className="text-purple-700 uppercase tracking-widest">Guides</h6>
        <h1 className="text-4xl font-bold">Our Travel Guides</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {hosts.map((host: UserProfile) => (
          <div key={host.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative overflow-hidden">
              <Image width={300} height={400} className="w-full" src={host.profilePictureUrl} alt={host.firstName} />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition duration-300">
                <div className="flex space-x-4">
                  <Link href="#" className="text-white hover:text-purple-700">
                    <i className="fab fa-twitter"></i>
                  </Link>
                  <Link href="#" className="text-white hover:text-purple-700">
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                  <Link href="#" className="text-white hover:text-purple-700">
                    <i className="fab fa-instagram"></i>
                  </Link>
                  <Link href="#" className="text-white hover:text-purple-700">
                    <i className="fab fa-linkedin-in"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="text-center py-6">
              <h5 className="text-xl font-semibold">{host.firstName}</h5>
              <p className="text-gray-600">{host.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hosts;