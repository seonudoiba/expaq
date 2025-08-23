/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Activity } from '@/types/activity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Users, Clock } from 'lucide-react';
import Image from 'next/image';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface ActivityMapProps {
  activities: Activity[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  className?: string;
  onActivitySelect?: (activity: Activity) => void;
  selectedActivity?: Activity | null;
}

interface MapMarker {
  activity: Activity;
  position: { lat: number; lng: number };
  marker?: any; // Using any instead of google.maps.Marker to avoid namespace issues
}

export function ActivityMap({
  activities,
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  zoom = 12,
  height = "400px",
  className = "",
  onActivitySelect,
  selectedActivity,
}: ActivityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<MapMarker[]>([]);
  const infoWindowRef = useRef<any>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedActivityData, setSelectedActivityData] = useState<Activity | null>(null);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        setLoadError('Google Maps API key not configured');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsLoaded(true);
      };
      
      script.onerror = () => {
        setLoadError('Failed to load Google Maps API');
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      mapInstanceRef.current = map;

      // Create info window
      infoWindowRef.current = new window.google.maps.InfoWindow();

    } catch (error) {
      console.error('Error initializing map:', error);
      setLoadError('Failed to initialize map');
    }
  }, [isLoaded, center, zoom]);

  // Update markers when activities change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(({ marker }) => {
      if (marker) marker.setMap(null);
    });
    markersRef.current = [];

    // Create new markers
    const newMarkers: MapMarker[] = [];
    const bounds = new window.google.maps.LatLngBounds();

    activities.forEach((activity) => {
      // Try to get coordinates from activity data or geocode the location
      let position: { lat: number; lng: number } | null = null;
      
      if (activity.latitude && activity.longitude) {
        position = { lat: activity.latitude, lng: activity.longitude };
      } else {
        // For demo purposes, generate random positions near the center
        // In production, you'd want to geocode the activity.location
        position = {
          lat: center.lat + (Math.random() - 0.5) * 0.02,
          lng: center.lng + (Math.random() - 0.5) * 0.02,
        };
      }

      if (position) {
        const marker = new window.google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          title: activity.title,
          icon: {
            url: '/api/placeholder/32/32', // Custom marker icon
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        marker.addListener('click', () => {
          setSelectedActivityData(activity);
          onActivitySelect?.(activity);
          
          // Show info window
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(createInfoWindowContent(activity));
            infoWindowRef.current.open(mapInstanceRef.current, marker);
          }
        });

        newMarkers.push({ activity, position, marker });
        bounds.extend(position);
      }
    });

    markersRef.current = newMarkers;

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      mapInstanceRef.current.fitBounds(bounds);
      
      // Don't zoom too close if there's only one marker
      const listener = window.google.maps.event.addListener(mapInstanceRef.current, 'bounds_changed', () => {
        if (mapInstanceRef.current!.getZoom()! > 15) {
          mapInstanceRef.current!.setZoom(15);
        }
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [activities, center, onActivitySelect]);

  // Highlight selected activity
  useEffect(() => {
    if (!selectedActivity || !window.google) return;

    const selectedMarker = markersRef.current.find(
      ({ activity }) => activity.id === selectedActivity.id
    );

    if (selectedMarker?.marker) {
      // Change marker icon to highlight it
      selectedMarker.marker.setIcon({
        url: '/api/placeholder/40/40', // Highlighted marker icon
        scaledSize: new window.google.maps.Size(40, 40),
      });

      // Center map on selected marker
      mapInstanceRef.current?.panTo(selectedMarker.position);
    }

    // Reset other markers
    markersRef.current.forEach(({ activity, marker }) => {
      if (activity.id !== selectedActivity.id && marker) {
        marker.setIcon({
          url: '/api/placeholder/32/32',
          scaledSize: new window.google.maps.Size(32, 32),
        });
      }
    });
  }, [selectedActivity]);

  const createInfoWindowContent = (activity: Activity): string => {
    return `
      <div style="max-width: 300px; padding: 8px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${activity.title}</h3>
        ${activity.mediaUrls?.[0] ? `<img src="${activity.mediaUrls[0]}" alt="${activity.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />` : ''}
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; line-height: 1.4;">${activity.description?.slice(0, 100)}${activity.description && activity.description.length > 100 ? '...' : ''}</p>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <div style="display: flex; align-items: center;">
            <span style="color: #fbbf24;">⭐</span>
            <span style="margin-left: 4px; font-size: 14px;">${activity.averageRating?.toFixed(1) || 'N/A'}</span>
            <span style="margin-left: 4px; font-size: 12px; color: #666;">(${activity.totalReviews || 0})</span>
          </div>
          <div style="font-size: 16px; font-weight: bold; color: #059669;">$${activity.price}</div>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #666;">
          <span>👥 ${activity.maxParticipants} max</span>
          <span>⏱️ ${activity.durationMinutes ? `${Math.floor(activity.durationMinutes / 60)}h ${activity.durationMinutes % 60}m` : 'N/A'}</span>
        </div>
      </div>
    `;
  };

  if (loadError) {
    return (
      <Card className={className} style={{ height }}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Not Available</h3>
            <p className="text-gray-500">{loadError}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className={className} style={{ height }}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading map...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} style={{ height, width: '100%' }} className="rounded-lg" />
      
      {selectedActivityData && (
        <Card className="absolute top-4 right-4 w-80 max-w-[calc(100%-2rem)] bg-white shadow-lg z-10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{selectedActivityData.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedActivityData.mediaUrls?.[0] && (
              <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                <Image
                  src={selectedActivityData.mediaUrls[0]}
                  alt={selectedActivityData.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {selectedActivityData.description}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium">
                  {selectedActivityData.averageRating?.toFixed(1) || 'N/A'}
                </span>
                <span className="ml-1 text-xs text-gray-500">
                  ({selectedActivityData.totalReviews || 0})
                </span>
              </div>
              <div className="text-lg font-bold text-green-600">
                ${selectedActivityData.price}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{selectedActivityData.maxParticipants} max</span>
              </div>
              {selectedActivityData.durationMinutes && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {Math.floor(selectedActivityData.durationMinutes / 60)}h{' '}
                    {selectedActivityData.durationMinutes % 60}m
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mb-3">
              {selectedActivityData.verified && (
                <Badge variant="secondary" className="text-xs">
                  ✓ Verified
                </Badge>
              )}
              {selectedActivityData.activityType?.name && (
                <Badge variant="outline" className="text-xs">
                  {selectedActivityData.activityType.name}
                </Badge>
              )}
            </div>
            
            <Button 
              className="w-full" 
              onClick={() => window.location.href = `/activities/${selectedActivityData.id}`}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ActivityMap;