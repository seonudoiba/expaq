"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import toast from "react-hot-toast";

// Schema for updating existing user to host (only additional fields needed)
const upgradeToHostSchema = z.object({
  profilePictureUrl: z.string().url("Please enter a valid URL").min(1, "Profile picture URL cannot be blank"),
  bio: z.string().min(1, "Bio cannot be blank"),
});

type UpgradeToHostFormData = z.infer<typeof upgradeToHostSchema>;

export function TouristToHostForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, updateUserRole } = useAuthStore();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<UpgradeToHostFormData>({
    resolver: zodResolver(upgradeToHostSchema),
    defaultValues: {
      profilePictureUrl: user?.profilePictureUrl || "",
      bio: user?.bio || "",
    },
  });

  const onSubmit = async (data: UpgradeToHostFormData) => {
    try {
      setIsLoading(true);
      
      // Prepare data for updating existing user to host
      const upgradeData = {
        userId: user?.id,  // Assuming user ID is available
        profilePictureUrl: data.profilePictureUrl,
        bio: data.bio,
        roles: [...(user?.roles || []), "HOST"], // Add HOST role to existing roles
      };

      // Call your upgrade to host API endpoint
      const response = await fetch('/api/auth/upgrade-to-host', {
        method: 'PATCH', // or PUT depending on your API design
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`, // Include auth token
        },
        body: JSON.stringify(upgradeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upgrade to host');
      }

      const result = await response.json();
      
      // Update auth store with updated user data
      if (updateUserRole) {
        await updateUserRole(result);
      }
      
      toast.success("Successfully upgraded to host account!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upgrade to host"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if user is not authenticated
  if (!user) {
    router.push("/become-host");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 11V9a4 4 0 118 0v2M20 8v6M23 11h-6"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Upgrade to Host Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back, {user.firstName}! Just a few more details to become a host.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Current User Info Display */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Current Account Info</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Username:</span> {user.userName || user.username}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-gray-700">
                Profile Picture URL
              </label>
              <div className="mt-1">
                <input
                  {...registerField("profilePictureUrl")}
                  type="url"
                  id="profilePictureUrl"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://example.com/your-photo.jpg"
                />
              </div>
              {errors.profilePictureUrl && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.profilePictureUrl.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <div className="mt-1">
                <textarea
                  {...registerField("bio")}
                  id="bio"
                  rows={4}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
                  placeholder="Tell us about yourself and what makes your hosting special. Share your interests, experience, and what guests can expect when staying with you..."
                />
              </div>
              {errors.bio && (
                <p className="mt-2 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <svg
                      className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 11V9a4 4 0 118 0v2M20 8v6M23 11h-6"
                      />
                    </svg>
                  )}
                </span>
                {isLoading ? "Upgrading Account..." : "Become a Host"}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Maybe later - Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}