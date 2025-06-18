"use client";

import { useState, useEffect } from "react";
import { BecomeHostForm } from "@/components/forms/become-host-form";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, LogIn, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BecomeAHostApplicationPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    // Short timeout to avoid immediate flashing during hydration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-lg">Loading application form...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
            Host Application
          </h1>
          <p className="mt-4 text-lg text-gray-500 text-center">
            Complete this form to apply to become a host on Expaq.
          </p>
        </div>

        {/* Case 1: User is not authenticated */}
        {!isAuthenticated && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">Sign In Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <LogIn className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">You need to be signed in to apply as a host</h3>
                <p className="text-muted-foreground max-w-md">
                  Please sign in to your account or create a new one to continue with your host application.
                </p>
                <div className="flex gap-4 pt-4">
                  <Button onClick={() => router.push("/auth?redirect=/become-a-host/apply")}>
                    Sign In
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/auth/register?redirect=/become-a-host/apply")}>
                    Create Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Case 2: User is already a host */}
{isAuthenticated && user?.roles?.some(role => role.name === "HOST") && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">You&apos;re Already a Host!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="rounded-full bg-green-100 p-3">
                  <User className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">You&apos;re already registered as a host</h3>
                <p className="text-muted-foreground max-w-md">
                  It looks like you&apos;re already a host on our platform. You can manage your activities and bookings from your host dashboard.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Button onClick={() => router.push("/host/dashboard")}>
                    Go to Host Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/activities/create")}>
                    Create New Activity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Case 3: User is authenticated but not a host */}
        {isAuthenticated && !user?.roles?.some(role => role.name === "HOST") && (
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
            <BecomeHostForm />
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? <Link href="/contact" className="text-primary hover:underline">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
