"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CreditCard, User, Bell, Shield, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store/auth";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  // Different setting categories with descriptions
  const settingCategories = [
    {
      id: "profile",
      title: "Profile Information",
      description: "Manage your personal information visible to others",
      icon: User,
      href: "/settings/profile",
    },
    {
      id: "account",
      title: "Account Settings",
      description: "Update your email, password, and account status",
      icon: Settings,
      href: "/settings/account",
    },
    {
      id: "payment",
      title: "Payment Methods",
      description: "Add and manage your payment methods",
      icon: CreditCard,
      href: "/settings/payment",
    },
    {
      id: "notifications",
      title: "Notification Preferences",
      description: "Control what notifications you receive",
      icon: Bell,
      href: "/settings/notifications",
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      description: "Keep your account secure and control your data",
      icon: Shield,
      href: "/settings/privacy",
    },
    {
      id: "help",
      title: "Help & Support",
      description: "Get help with using ExpAq",
      icon: HelpCircle,
      href: "/settings/help",
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Settings Overview</h1>
      <p className="text-muted-foreground mb-8">
        Manage your profile, account settings, and preferences
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <category.icon className="h-5 w-5 text-primary" />
                <CardTitle>{category.title}</CardTitle>
              </div>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
              {category.id === "profile" && (
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <div className="font-medium">{user.userName || "Not set"}</div>
                    <div className="text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost" 
                className="w-full justify-between" 
                onClick={() => router.push(category.href)}
              >
                Go to {category.title}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
