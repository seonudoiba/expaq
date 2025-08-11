"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem, seoService } from '@/services/seo-service';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Always include home as the first item
  const allItems: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
    ...items
  ];

  const structuredData = seoService.generateBreadcrumbSchema(allItems);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {/* Visual Breadcrumbs */}
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`}
      >
        <ol className="flex items-center space-x-1">
          {allItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              )}
              
              {index === allItems.length - 1 ? (
                // Current page - not linked
                <span 
                  className="text-gray-900 font-medium"
                  aria-current="page"
                >
                  {index === 0 && <Home className="w-4 h-4 mr-1 inline" />}
                  {item.name}
                </span>
              ) : (
                // Previous pages - linked
                <Link
                  href={item.url}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  title={`Go to ${item.name}`}
                >
                  {index === 0 && <Home className="w-4 h-4 mr-1 inline" />}
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

// Preset breadcrumb configurations
export const breadcrumbPresets = {
  activity: (activityTitle: string, location: string, category: string): BreadcrumbItem[] => [
    { name: 'Activities', url: '/activities' },
    { name: location, url: `/cities/${location.toLowerCase().replace(/\s+/g, '-')}` },
    { name: category, url: `/activity-types/${category.toLowerCase().replace(/\s+/g, '-')}` },
    { name: activityTitle, url: '#' }
  ],

  search: (query?: string, location?: string): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { name: 'Search', url: '/search' }
    ];

    if (location) {
      items.push({ name: location, url: `/cities/${location.toLowerCase().replace(/\s+/g, '-')}` });
    }

    if (query) {
      items.push({ name: `"${query}"`, url: '#' });
    }

    return items;
  },

  location: (location: string, type: 'city' | 'country'): BreadcrumbItem[] => [
    { name: type === 'city' ? 'Cities' : 'Countries', url: `/${type === 'city' ? 'cities' : 'countries'}` },
    { name: location, url: '#' }
  ],

  category: (category: string): BreadcrumbItem[] => [
    { name: 'Activity Types', url: '/activity-types' },
    { name: category, url: '#' }
  ],

  host: (hostName: string): BreadcrumbItem[] => [
    { name: 'Hosts', url: '/hosts' },
    { name: hostName, url: '#' }
  ],

  booking: (activityTitle?: string): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { name: 'My Account', url: '/profile' },
      { name: 'Bookings', url: '/bookings' }
    ];

    if (activityTitle) {
      items.push({ name: activityTitle, url: '#' });
    }

    return items;
  },

  support: (ticketNumber?: string): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { name: 'Support', url: '/support' }
    ];

    if (ticketNumber) {
      items.push({ name: `Ticket ${ticketNumber}`, url: '#' });
    }

    return items;
  }
};