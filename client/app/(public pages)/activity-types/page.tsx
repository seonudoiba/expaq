"use client";

import { Suspense, useEffect, useState } from "react";
import { HeroSection } from "@/components/shared/hero-section";
import { LocationGrid } from "@/components/shared/location-grid";
import { ActivityType } from "@/types/activity";
import { ActivityTypeService } from "@/services/location-services";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityTypesPage() {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        setLoading(true);
        const data = await ActivityTypeService.getAll();
        setActivityTypes(data);
      } catch (err) {
        console.error("Error fetching activity types:", err);
        setError("Failed to load activity types. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivityTypes();
  }, []);

  return (
    <div>
      <HeroSection
        title="Experience Categories"
        subtitle="Discover a world of activities and adventures tailored to your interests"
        imageSrc="/hero1.jpg"
        overlayColor="rgba(0, 0, 0, 0.6)"
      />

      <section className="container mx-auto py-16 px-6" id="browse">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
          <p className="text-gray-600">
            Find the perfect experiences based on your interests. From culinary adventures and outdoor 
            activities to workshops and cultural immersions, explore our diverse categories of 
            experiences hosted by passionate locals.
          </p>
        </div>

        {error && (
          <div className="text-center py-10">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-60 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
          </div>
        ) : (
          <Suspense fallback={<div>Loading...</div>}>
            <LocationGrid
              items={activityTypes.map(type => ({
                id: type.id,
                name: type.name,
                image: type.image,
                itemCount: type.activityCount
              }))}
              type="activityType"
              linkPrefix="activity-types"
            />
          </Suspense>
        )}
      </section>
    </div>
  );
}
