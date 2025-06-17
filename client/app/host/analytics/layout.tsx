"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  CalendarDays, 
  Star, 
  Users, 
  DollarSign, 
  TrendingUp,
  Map,
  Clock,
  ArrowLeft
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Navigation items for the analytics sidebar
  const navigationItems = [
    { 
      id: "overview", 
      label: "Overview Dashboard", 
      icon: BarChart3, 
      href: "/host/analytics" 
    },
    { 
      id: "revenue", 
      label: "Revenue & Earnings", 
      icon: DollarSign, 
      href: "/host/analytics/revenue" 
    },
    { 
      id: "bookings", 
      label: "Bookings Analysis", 
      icon: CalendarDays, 
      href: "/host/analytics/bookings" 
    },
    { 
      id: "participants", 
      label: "Participant Insights", 
      icon: Users, 
      href: "/host/analytics/participants" 
    },
    {
      id: "reviews",
      label: "Reviews & Ratings",
      icon: Star,
      href: "/host/analytics/reviews"
    },
    {
      id: "performance",
      label: "Activity Performance",
      icon: TrendingUp,
      href: "/host/analytics/performance"
    },
    {
      id: "regions",
      label: "Geographic Data",
      icon: Map,
      href: "/host/analytics/regions"
    },
    {
      id: "timing",
      label: "Seasonal Trends",
      icon: Clock,
      href: "/host/analytics/timing"
    }
  ];

  // Check if the user is a host
  const isHost = user?.roles?.some(role => role.name === "HOST");

  if (!user) {
    return null;
  }

  if (!isHost) {
    router.push("/not-authorized");
    return null;
  }

  // Menu items
  const SidebarItems = (
    <>
      <div className="flex items-center gap-2 mb-8">
        <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-8">
        Comprehensive insights for your activities
      </p>
      <div className="space-y-1">
        {navigationItems.map((item) => (
          <Link key={item.id} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                pathname === item.href && "bg-secondary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r">
        <div className="flex flex-col gap-4 p-6">
          {SidebarItems}
        </div>
      </aside>

      {/* Mobile sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="md:hidden absolute left-4 top-4 z-10"
          >
            <BarChart3 className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <ScrollArea className="h-full p-6">
            {SidebarItems}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex items-center mb-8">
            <Link href="/host/dashboard">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            {isMobile && <h1 className="text-xl font-semibold">Analytics</h1>}
          </div>
          <Separator className="mb-8" />
          {children}
        </div>
      </div>
    </div>
  );
}
