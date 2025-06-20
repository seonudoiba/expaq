"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { DetailHeader } from "@/components/shared/detail-header";
import { FeaturedActivities, Activity } from "@/components/shared/featured-activities";
import { Tag, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ActivityType } from "@/types/activity";
import { ActivityTypeService } from "@/services/location-services";

export default function ActivityTypeDetailPage() {
  const params = useParams();
  const [activityType, setActivityType] = useState<ActivityType | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityTypeDetails = async () => {
      try {
        setLoading(true);
        const activityTypeData = await ActivityTypeService.getById(params.id as string);
        setActivityType(activityTypeData);
        
        // Get activities of this type
        const activitiesData = await ActivityTypeService.getActivities(params.id as string);
        setActivities(activitiesData);
      } catch (err) {
        console.error("Error fetching activity type details:", err);
        setError("Failed to load activity type details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchActivityTypeDetails();
    }
  }, [params.id]);

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-500 mb-6">{error}</p>
        <Button asChild>
          <Link href="/activity-types">Back to Categories</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Skeleton className="h-[50vh] w-full" />
        <div className="container mx-auto py-10 px-6">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-40 w-full mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-60 w-full" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-60 w-full mb-4" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activityType) {
    return (      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
        <p className="mb-6">The activity category you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button asChild>
          <Link href="/activity-types">View All Categories</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <DetailHeader
        name={activityType.name}
        image={activityType.image || "/default.png"}
        stats={[
          {
            label: "Activities",
            value: activityType.activityCount,
            icon: "calendar",
          },
        ]}
        backLink={{
          href: "/activity-types",
          label: "Back to Categories",
        }}
      />

      <section className="container mx-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose max-w-none mb-10">
              <h2 className="text-2xl font-bold mb-4">About {activityType.name} Experiences</h2>
              <p className="text-gray-700">
                {activityType.name} experiences offer unique opportunities to engage with local culture,
                learn new skills, and create unforgettable memories. Hosted by passionate experts, 
                these activities are designed to provide authentic and enriching experiences for travelers.
              </p>
            </div>

            {activities.length > 0 ? (
              <FeaturedActivities
                activities={activities}
                title={`${activityType.name} Experiences`}
                viewAllHref={`/activities?activityType=${activityType.id}`}
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium mb-2">No activities yet</h3>
                <p className="text-gray-600 mb-4">
                  There are no {activityType.name} activities available at the moment.
                </p>
                <Button asChild>
                  <Link href="/activities">Browse All Activities</Link>
                </Button>
              </div>
            )}
          </div>

          <aside>
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Category Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <span className="block text-sm text-gray-500">Category</span>
                    <span className="font-medium">{activityType.name}</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <span className="block text-sm text-gray-500">Activities</span>
                    <span className="font-medium">{activityType.activityCount} experiences</span>
                  </div>
                </div>
                
                {/* Call to action */}
                <Button className="w-full mt-4" asChild>
                  <Link href={`/activities?activityType=${activityType.id}`}>
                    Browse All {activityType.name} Activities
                  </Link>
                </Button>
              </div>
            </div>

            {activities.length > 0 && (
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Why Try {activityType.name}?</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="bg-primary/10 rounded-full p-1 h-fit">
                      <div className="h-5 w-5 text-primary flex items-center justify-center">1</div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Experience authentic activities led by passionate local experts
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <div className="bg-primary/10 rounded-full p-1 h-fit">
                      <div className="h-5 w-5 text-primary flex items-center justify-center">2</div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Create lasting memories and unique stories to share
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <div className="bg-primary/10 rounded-full p-1 h-fit">
                      <div className="h-5 w-5 text-primary flex items-center justify-center">3</div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Connect with like-minded travelers and local communities
                    </p>
                  </li>
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
