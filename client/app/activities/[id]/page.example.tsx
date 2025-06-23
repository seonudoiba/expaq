"use client";

import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityReviews from "@/components/activities/ActivityReviews";

export default function ActivityPage() {
  const { id } = useParams() as { id: string };

  return (
    <div className="container mx-auto py-8">
      {/* Activity details would be here */}
      <div className="mt-10">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            {/* Activity details content goes here */}
            <div className="p-4">
              <h2>Activity Details</h2>
              {/* Details content */}
            </div>
          </TabsContent>

          <TabsContent value="itinerary">
            {/* Itinerary content goes here */}
            <div className="p-4">
              <h2>Itinerary</h2>
              {/* Itinerary content */}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="p-4">
              <ActivityReviews activityId={id} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
