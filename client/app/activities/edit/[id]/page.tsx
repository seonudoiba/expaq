"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { activityService } from "@/services/services";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const updateActivitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  maxParticipants: z.number().min(1, "Maximum participants must be at least 1"),
  address: z.string().min(1, "Address is required"),
  city: z.object({ id: z.string() }),
  country: z.object({ id: z.string() }),
  activityType: z.object({ id: z.string() }),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180)
    .max(180, "Longitude must be between -180 and 180"),
});

export default function EditActivityPage() {
  const { toast } = useToast();
  const params = useParams();
  const activityId = params.id as string;


  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof updateActivitySchema>>({
    resolver: zodResolver(updateActivitySchema),
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!activityId) {
      toast({
        title: "Error",
        description: "Activity ID is required.",
        variant: "destructive",
      });
      setError("Activity ID is required to edit an activity.");
      return;
    }

    const fetchActivity = async () => {
      try {
        const activity = await activityService.getById(activityId);
        // Set each field individually to ensure type safety
        setValue("title", activity.title);
        setValue("description", activity.description);
        setValue("price", activity.price);
        setValue("startDate", activity.startDate);
        setValue("startDate", activity.startDate);
        setValue("endDate", activity.endDate);
        setValue("maxParticipants", activity.maxParticipants);
        setValue("city", { id: activity.city.id });
        setValue("country", { id: activity.country.id });
        setValue("activityType", { id: activity.activityType.id });
        setValue("latitude", activity.latitude);
        setValue("longitude", activity.longitude);
      } catch (error) {
        console.error("Error fetching activity:", error);
        toast({
          title: "Error",
          description: "Failed to fetch activity details.",
          variant: "destructive",
        });
        setError("Failed to fetch activity details. Please try again later.");
      }
    };

    fetchActivity();
  }, [activityId, toast, setValue]);

  const onSubmit = async (data: z.infer<typeof updateActivitySchema>) => {
    if (!activityId) {
      toast({
        title: "Error",
        description: "Activity ID is required.",
        variant: "destructive",
      });
      return;
    }
    try {
      await activityService.update(activityId, data);
      toast({
        title: "Success",
        description: "Activity updated successfully.",
      });
    } catch (error) {
      console.error("Error updating activity:", error);
      toast({
        title: "Error",
        description: "Failed to update activity.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Activity Description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price")}
                  placeholder="Price"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  {...register("maxParticipants")}
                  placeholder="Max Participants"
                />
                {errors.maxParticipants && (
                  <p className="text-red-500 text-sm">
                    {errors.maxParticipants.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="Address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  {...register("latitude")}
                  placeholder="Latitude"
                />
                {errors.latitude && (
                  <p className="text-red-500 text-sm">
                    {errors.latitude.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  {...register("longitude")}
                  placeholder="Longitude"
                />
                {errors.longitude && (
                  <p className="text-red-500 text-sm">
                    {errors.longitude.message}
                  </p>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
