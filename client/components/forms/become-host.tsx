"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import toast from "react-hot-toast";
import { fileService } from "@/services/services";

// Extended schema for become host that matches your DTO
const becomeHostSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name cannot be blank"),
  lastName: z.string().min(1, "Last name cannot be blank"),
  profilePictureUrl: z.string().url("Please enter a valid URL").min(1, "Profile picture URL cannot be blank"),
  bio: z.string().min(1, "Bio cannot be blank"),
});

type BecomeHostFormData = z.infer<typeof becomeHostSchema>;

export function BecomeHostForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const becomeHost = useAuthStore((state) => state.becomeHost);
  

  const {
    register: becomeHostField,
    handleSubmit,
    formState: { errors },
  } = useForm<BecomeHostFormData>({
    resolver: zodResolver(becomeHostSchema),
  });

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    if (isAuthenticated && user) {
      // If user is logged in, redirect to tourist-to-host page
      router.push("/become-a-host/tourist-to-host");
    }
  }, [isAuthenticated, user, router]);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const userId = user?.id; // Assuming user ID is available in the auth store
      if (!userId) throw new Error("User ID is required for file upload");

      const imageUrl = await fileService.upload(file, userId);
      setUploadedImageUrl(imageUrl);
      toast.success("Profile picture uploaded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload profile picture"
      );
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: BecomeHostFormData) => {
    try {
      if (!uploadedImageUrl) {
        toast.error("Please upload a profile picture");
        return;
      }
      setIsLoading(true);
      const formData = { ...data, profilePictureUrl: uploadedImageUrl };
      await becomeHost(formData);
      toast.success("Registration successful!");
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to register"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // If user is authenticated, show loading while redirecting
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-centerr min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to host upgrade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 mt-8">

      <div className="my-12 border-b text-center">
        <div className="leading-none px-2 inline-block text-3xl text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
          Become a Host
        </div>
      </div>

      <div className="mx-auto max-w-2xl ">
        <div className="space-y-4">
          <input
            {...becomeHostField("firstName")}
            type="text"
            id="firstName"
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.firstName.message}
            </p>
          )}
          
          <input
            {...becomeHostField("lastName")}
            type="text"
            id="lastName"
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.lastName.message}
            </p>
          )}
          
          <input
            {...becomeHostField("userName")}
            type="text"
            id="userName"
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            placeholder="Choose a userName"
          />
          {errors.userName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.userName.message}
            </p>
          )}
          
          <input
            {...becomeHostField("email")}
            type="email"
            id="email"
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
          
          <input
            {...becomeHostField("password")}
            type="password"
            id="password"
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            placeholder="Create a password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
          
          <input
            type="file"
            id="profilePicture"
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            onChange={onFileChange}
            disabled={uploading}
          />
          {uploading && (
            <p className="mt-1 text-sm text-gray-600">Uploading profile picture...</p>
          )}
          
          <textarea
            {...becomeHostField("bio")}
            id="bio"
            rows={4}
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white resize-none"
            placeholder="Tell us about yourself and what makes your hosting special..."
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
          )}
          
          <button
            className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading || uploading}
          >
            <svg
              className="w-6 h-6 -ml-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6M23 11h-6" />
            </svg>
            <span className="ml-3">
              {isLoading ? "Creating host account..." : "Become a Host"}
            </span>
          </button>
          
          <p className="mt-6 text-xs text-gray-600 text-center">
            By creating a host account, you agree to Expaq&apos;s{" "}
            <a href="/terms" className="border-b border-gray-500 border-dotted hover:text-indigo-600">
              Terms of Service
            </a>
            {" "}and{" "}
            <a href="/privacy" className="border-b border-gray-500 border-dotted hover:text-indigo-600">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}