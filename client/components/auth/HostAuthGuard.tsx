"use client";

import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface HostAuthGuardProps {
  children: ReactNode;
}

export default function HostAuthGuard({ children }: HostAuthGuardProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user has the required host role
    const validateHostPermission = async () => {
      try {
        if (!user) {
          console.log("No user found in auth store");
          toast({
            title: "Authentication Required",
            description: "Please log in to create activities",
            variant: "destructive",
          });
          
          // Save current URL to redirect back after login
          localStorage.setItem('redirectTo', window.location.pathname);
          
          // Redirect to login
          router.push("/login");
          return;
        }

        // Check if user has host role
        const hasHostRole = user.roles && Array.isArray(user.roles) && 
                          user.roles.some(role => 
                            typeof role === 'string' 
                              ? role.toLowerCase() === 'host' 
                              : role.name?.toLowerCase() === 'host'
                          );
        
        console.log("User roles check:", user.roles, "Has host role:", hasHostRole);
        
        if (!hasHostRole) {
          toast({
            title: "Permission Denied",
            description: "You need to be a host to create activities",
            variant: "destructive",
          });
          
          // Redirect to become-a-host page
          router.push("/become-a-host");
        }
      } catch (error) {
        console.error("Error validating host permissions:", error);
      }
    };

    validateHostPermission();
  }, [toast, user, router]);

  // Listen for auth:unauthorized events
  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const customEvent = event as CustomEvent;
      toast({
        title: "Session Expired",
        description: customEvent.detail?.message || "Please log in again",
        variant: "destructive",
      });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [toast]);

  return <>{children}</>;
}
