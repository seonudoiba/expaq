"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { activityService } from "@/services/services";
import { useAuthStore } from "@/lib/store/auth";
import { Activity } from "@/types/activity";
// import type { Activity } from "@/types";

export default function HostDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || !user.id) {
      router.push("/login");
      return;
    }

    const fetchHostData = async () => {
      setIsLoading(true);
      try {
        const hostActivities: Activity[] =
          await activityService.getHostDashboardActivities(user.id);
        setActivities(hostActivities);
      } catch (error) {
        console.error("Error fetching host activities:", error);
        toast({
          title: "Error",
          description: "Failed to fetch activities. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHostData();
  }, [user, router, toast]);

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    setIsLoading(true);
    try {
      await activityService.delete(activityId);
      setActivities((prev) =>
        prev.filter((activity) => activity.id !== activityId)
      );
      toast({
        title: "Success",
        description: "Activity deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast({
        title: "Error",
        description: "Failed to delete activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      {" "}
      <Card>
        <CardHeader>
          <CardTitle>Host Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Quick metrics summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="py-4 px-6">
                <CardTitle className="text-sm font-medium">
                  Total Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-6">
                <div className="text-2xl font-bold">
                  {isLoading ? "--" : activities.length * 14}
                </div>
                <p className="text-xs text-muted-foreground">
                  +8 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4 px-6">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-6">
                <div className="text-2xl font-bold">
                  ${isLoading ? "--" : activities.length * 2456}
                </div>
                <p className="text-xs text-muted-foreground">
                  +$842 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4 px-6">
                <CardTitle className="text-sm font-medium">
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-6">
                <div className="text-2xl font-bold">
                  {isLoading ? "--" : "4.7"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on {activities.length * 8} reviews
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4 px-6">
                <CardTitle className="text-sm font-medium">
                  Upcoming Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-6">
                <div className="text-2xl font-bold">
                  {isLoading ? "--" : activities.length * 3}
                </div>
                <p className="text-xs text-muted-foreground">Next 7 days</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid p-y-6 gap-8 mt-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold">Profile</h2>
              <div className="border p-4 rounded-md">
                <p>
                  <strong>Name:</strong> {user?.userName}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => router.push("/profile/edit")}
                >
                  Edit Profile
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold">Analytics</h2>
              <div className="border p-4 rounded-md">
                <p className="mb-4">
                  Access detailed analytics for your activities, including
                  bookings, revenue, participant data, and more.
                </p>
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => router.push("/host/analytics")}
                >
                  View Analytics Dashboard
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-6 mt-8">
            <h2 className="text-xl font-bold">Your Activities</h2>
            {isLoading ? (
              <p>Loading...</p>
            ) : activities.length > 0 ? (
              <ul className="space-y-4">
                {activities.map((activity) => (
                  <li key={activity.id} className="border p-4 rounded-md">
                    <h3 className="text-lg font-semibold">{activity.title}</h3>
                    <p>{activity.description}</p>
                    <div className="flex justify-between mt-4">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          router.push(`/activities/edit/${activity.id}`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteActivity(activity.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No activities found. Create one to get started!</p>
            )}
          </div>{" "}
          
        </CardContent>
      </Card>
    </div>
  );
}
