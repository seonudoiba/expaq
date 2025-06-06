"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadActivityImages } from "@/lib/api/services";
import { useToast } from "@/components/ui/use-toast";

export default function UploadActivityImagePage() {
  const { toast } = useToast();
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const activityId = searchParams.get("activityId");


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
  };

  const handleUpload = async () => {
    if (!image || !activityId) {
      toast({
        title: "Error",
        description: "Please select an image and ensure activity ID is available.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);

      // Fetch or use a valid activityId
      await uploadActivityImages(activityId, [image]);

      toast({
        title: "Success",
        description: "Image uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Upload Activity Image</h1>
      <div className="space-y-4">
        <Input type="file" accept="image/*" onChange={handleImageChange} disabled={isLoading} />
        <Button onClick={handleUpload} disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload Image"}
        </Button>
      </div>
    </div>
  );
}
