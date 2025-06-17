"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  User, CreditCard, Settings, Bell, Shield, 
  HelpCircle, Trash2, LogOut, UserCircle,
  Check, Camera, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Navigation items for the settings sidebar
  const navigationItems = [
    { 
      id: "profile", 
      label: "Profile Information", 
      icon: User, 
      href: "/settings/profile" 
    },
    { 
      id: "account", 
      label: "Account Settings", 
      icon: Settings, 
      href: "/settings/account" 
    },
    { 
      id: "payment", 
      label: "Payment Methods", 
      icon: CreditCard, 
      href: "/settings/payment" 
    },
    { 
      id: "notifications", 
      label: "Notifications", 
      icon: Bell, 
      href: "/settings/notifications" 
    },
    { 
      id: "privacy", 
      label: "Privacy & Security", 
      icon: Shield, 
      href: "/settings/privacy" 
    },
    { 
      id: "help", 
      label: "Help & Support", 
      icon: HelpCircle, 
      href: "/settings/help" 
    },
  ];

  // Handle delete account
  const handleDeleteAccount = async () => {
    // Here you would call the API to delete the account
    try {
      // await userService.deleteAccount();
      logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Please sign in</h2>
          <p className="text-gray-500 mb-4">You need to be signed in to access settings.</p>
          <Button onClick={() => router.push("/auth/login")}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {isMobile && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}
      
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <div className="w-full md:w-1/4">
          {/* User profile overview */}
          <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={user.profilePictureUrl || user.avatar} 
                    alt={user.userName} 
                  />
                  <AvatarFallback className="bg-primary/10">
                    {user.userName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Link 
                  href="/settings/profile" 
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 shadow-sm"
                >
                  <Camera size={14} />
                </Link>
              </div>
              
              <h3 className="text-lg font-semibold">{user.userName || "User"}</h3>
              <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
              
              <Link 
                href={`/profile`}
                className="text-sm text-primary hover:text-primary/80 inline-flex items-center"
              >
                View public profile
                <Check size={14} className="ml-1" />
              </Link>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <div className="p-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-md",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            
            <Separator />
            
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                DANGER ZONE
              </p>
              <button
                onClick={() => setDeleteAccountDialog(true)}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md w-full text-left text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Account</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md w-full text-left hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="w-full md:w-3/4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            {children}
          </div>
        </div>
      </div>
      
      {/* Delete Account Dialog */}
      <AlertDialog open={deleteAccountDialog} onOpenChange={setDeleteAccountDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
