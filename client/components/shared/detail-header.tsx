"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Tag, ChevronLeft } from "lucide-react";
import Link from 'next/link';

interface DetailHeaderProps {
  name: string;
  image: string;
  stats: {
    label: string;
    value: string | number;
    icon?: 'map' | 'calendar' | 'tag';
  }[];
  backLink: {
    href: string;
    label: string;
  };
}

export function DetailHeader({ name, image, stats, backLink }: DetailHeaderProps) {
  const renderIcon = (iconName?: 'map' | 'calendar' | 'tag') => {
    switch (iconName) {
      case 'map':
        return <MapPin className="h-5 w-5 text-primary" />;
      case 'calendar':
        return <Calendar className="h-5 w-5 text-primary" />;
      case 'tag':
        return <Tag className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="relative">
      {/* Hero image with gradient overlay */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <Image
          src={image || "/default.png"}
          alt={name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>
      
      {/* Content positioned over the image */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/20 mb-6"
          >
            <Link href={backLink.href}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {backLink.label}
            </Link>
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{name}</h1>
          
          <div className="flex flex-wrap gap-6 mt-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center">
                {renderIcon(stat.icon)}
                <div className="ml-2">
                  <p className="text-sm text-gray-200">{stat.label}</p>
                  <p className="text-lg font-semibold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
