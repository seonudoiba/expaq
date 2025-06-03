import Image from 'next/image';
import Link from 'next/link';
import {activityType, Location} from '../../types/index'
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";

interface ActivityCardProps {
  id: string;
  title: string;
  description: string;
  city: Location;
  country: Location;
  activityType: activityType;
  location: string;
  price: string;
  startDate: string;
  endDate: string;
  image?: string;
  rating: number;
  reviewCount: number;
}

export function ActivityCard({
  id,
  title,
  description,
  city,
  country,
  activityType,
  price,
  startDate,
  endDate,
  image,
  rating,
  reviewCount,
}: ActivityCardProps) {
  return (
    <Link href={`/activities/${id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                  <div className="relative h-64 w-full">
                    <Image
                      src={image || "/default-image.jpg"} 
                      alt={title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute top-3 left-3 z-10">
                      {activityType.name}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {city.name}, {country.name}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-800 line-clamp-2">
                      {description}
                    </p>
                    <div className="flex items-center text-sm py-2 text-gray-800">
                      <svg
                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-800"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 14a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 018 14zm0-4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 018 10zm0-4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 018 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {startDate} -{" "}
                      {endDate}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium mr-1">
                        {rating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        ({reviewCount} reviews)
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div className="font-semibold">
                      {price}{" "}
                      <span className="text-muted-foreground font-normal text-sm">
                        / person
                      </span>
                    </div>
                  </CardFooter>
                </Card>
      {/* <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none sm:h-48">
          {image ? (
            <Image
              src={image}
              alt={title}
              className="h-full w-full object-cover object-center sm:h-full sm:w-full"
              width={500}
              height={300}
            />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>
        <div className="flex flex-1 flex-col space-y-2 p-4">
          <h3 className="text-sm font-medium text-gray-900">
            <span aria-hidden="true" className="absolute inset-0" />
            {title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {city.name}, {country.name}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 14a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 018 14zm0-4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 018 10zm0-4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 018 6z"
                clipRule="evenodd"
              />
            </svg>
            {startDate} - {endDate}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-sm text-gray-600">
                {typeof rating === "number" ? rating.toFixed(1) : "N/A"} ({reviewCount} reviews)
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900">{price}</p>
          </div>
        </div>
      </div> */}
    </Link>
  );
}