"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { MapPin, Tag } from "lucide-react";

interface LocationCardProps {
  id: string;
  name: string;
  image: string;
  itemCount: number;
  type: "city" | "country" | "activityType";
  linkPrefix: string;
  subTitle?: string;
}

export function LocationCard({
  id,
  name,
  image,
  itemCount,
  type,
  linkPrefix,
  subTitle,
}: LocationCardProps) {
  return (
    <Link href={`/${linkPrefix}/${id}`}>
      <Card className="overflow-hidden h-full group transition-all duration-300 hover:shadow-lg">
        <div className="relative h-60 w-full overflow-hidden">
          <Image
            src={image || "/default.png"}
            alt={name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-bold mb-1 group-hover:text-primary-200 transition-colors">
              {name}
            </h3>
            {subTitle && (
              <p className="text-sm text-gray-100 mb-1">
                {subTitle}
              </p>
            )}
            <div className="flex items-center text-sm">
              {type === "city" && (
                <>
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{itemCount} activities</span>
                </>
              )}
              {type === "country" && (
                <>
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{itemCount} destinations</span>
                </>
              )}
              {type === "activityType" && (
                <>
                  <Tag className="h-4 w-4 mr-1" />
                  <span>{itemCount} experiences</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
