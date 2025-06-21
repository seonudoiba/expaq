"use client";

import { ActivityCard } from "@/components/activities/activity-card";
import { Button } from "@/components/ui/button";
import { Activity } from "@/types/activity";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface FeaturedActivitiesProps {
  activities: Activity[];
  title: string;
  viewAllHref: string;
}

export function FeaturedActivities({
  activities,
  title,
  viewAllHref,
}: FeaturedActivitiesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScrollButtons();
      el.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      
      return () => {
        el.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    
    const scrollAmount = 320; // Width of a card plus some margin
    const scrollLeft = direction === 'left' 
      ? el.scrollLeft - scrollAmount 
      : el.scrollLeft + scrollAmount;
      
    el.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={!canScrollLeft}
              onClick={() => scroll('left')}
            >
              <ChevronRight className="h-4 w-4 transform rotate-180" />
              <span className="sr-only">Scroll left</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              disabled={!canScrollRight}
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Scroll right</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={viewAllHref}>
              View all
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-pl-6"
      >
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="min-w-[320px] snap-start"
          >
            <ActivityCard
           activity={activity}
            />
          </div>
        ))}
        {activities.length === 0 && (
          <div className="flex-1 flex items-center justify-center h-64 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No activities available.</p>
          </div>
        )}
      </div>
    </section>
  );
}
