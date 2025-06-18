"use client";

import { useState } from "react";
import { LocationCard } from "./location-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface LocationGridProps {
  items: Array<{
    id: string;
    name: string;
    image: string;
    itemCount?: number;
    countryId?: string; // For cities
    subTitle?: string;
  }>;
  type: "city" | "country" | "activityType";
  linkPrefix: string;
}

export function LocationGrid({ items, type, linkPrefix }: LocationGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={`Search ${type === "activityType" ? "activity types" : type + "s"}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchTerm && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSearchTerm("")}
          >
            Clear
          </Button>
        )}
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900">No results found</h3>
          <p className="mt-2 text-gray-500">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <LocationCard
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              itemCount={item.itemCount || 0}
              type={type}
              linkPrefix={linkPrefix}
              subTitle={item.subTitle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
