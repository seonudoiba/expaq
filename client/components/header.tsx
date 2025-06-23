"use client";

import React from "react";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import logo from "/expaqlogo.png"
import { NavigationLink } from "@/components/ui/navigation-link";

import { Navbar } from "@/components/shared/navbar";
import { ProfileMobile } from "@/components/shared/profile-mobile";

import {
  ClientSideNavigationMenu as NavigationMenu,
  ClientSideNavigationMenuList as NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/navigation-wrapper";
import { cn } from "@/lib/utils";
import {
  Search,
  Menu,
  X,
  MapPin,
  Compass,
  Users,
  Calendar,
  Heart,
  MessageSquare,
  Settings,
  LogIn,
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/lib/store/auth";

export function Header() {
  const isMobile = useMobile();
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {" "}
          <NavigationLink href="/" className="flex items-center space-x-2">
            <Image src="/expaqlogo.png" alt={"Expaq"} width={120} height={30} />
          </NavigationLink>
          {!isMobile && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Discover</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <li className="row-span-3">
                        {" "}
                        <NavigationMenuLink asChild>
                          <NavigationLink
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
                            href="/activities"
                          >
                            <div className="mt-4 mb-2 text-lg font-medium text-white">
                              Featured Activities
                            </div>
                            <p className="text-sm leading-tight text-white/90">
                              Discover our handpicked selection of extraordinary
                              experiences
                            </p>
                          </NavigationLink>
                        </NavigationMenuLink>
                      </li>{" "}
                      <ListItem
                        href="/activity-types"
                        title="Experience Categories"
                        useEnhancedNavigation={true}
                      >
                        Browse activities by categories and interests
                      </ListItem>
                      <ListItem
                        href="/cities"
                        title="Explore Cities"
                        useEnhancedNavigation={true}
                      >
                        Find experiences in cities around the world
                      </ListItem>
                      <ListItem
                        href="/countries"
                        title="Discover Countries"
                        useEnhancedNavigation={true}
                      >
                        Explore destinations across the globe
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>{" "}
                </NavigationMenuItem>{" "}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/activities"
                    className={navigationMenuTriggerStyle()}
                  >
                    All Activities
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Become a Host</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                      <li className="row-span-3">
                        {" "}
                        <NavigationMenuLink
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/become-a-host"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Start Hosting
                          </div>{" "}
                          <p className="text-sm leading-tight text-muted-foreground">
                            Share your passions, earn income, and connect with
                            travelers from around the world.
                          </p>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <NavigationLink
                            href="/become-a-host/apply"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              Apply Now
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Fill out the application form to become a host
                            </p>
                          </NavigationLink>
                        </NavigationMenuLink>{" "}
                      </li>
                      <li>
                        {" "}
                        <NavigationMenuLink
                          href="/become-a-host#faq-section"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Host FAQ
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Get answers to common questions about hosting
                          </p>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                {/* Additional menu items that match mobile */}
                {user && (
                  <>
                    {" "}
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        href="/bookings"
                        className={navigationMenuTriggerStyle()}
                      >
                        My Bookings
                      </NavigationMenuLink>
                    </NavigationMenuItem>{" "}
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        href="/messages"
                        className={navigationMenuTriggerStyle()}
                      >
                        Messages
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>{" "}
        <div className="flex items-center gap-1">
          {!isMobile && !showSearch && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}{" "}
          {!isMobile && user && (
            <NavigationLink href="/favorites">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Favorites</span>
              </Button>
            </NavigationLink>
          )}
          {!isMobile && showSearch && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  className="w-[280px] pl-9"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          )}
          {!isMobile && user ? (
            <Navbar />
          ) : !isMobile && !user ? (
            <>
              {" "}
              <NavigationLink href="/login">
                <Button variant="outline">Log in</Button>
              </NavigationLink>
              <NavigationLink href="/register">
                <Button>Sign up</Button>
              </NavigationLink>
            </>
          ) : null}
          {isMobile && user ? <ProfileMobile /> : null}
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="grid gap-6 py-6">
                  <div className="flex items-center gap-2">
                    {" "}
                    <NavigationLink
                      href="/"
                      className="flex items-center space-x-2"
                    >
                      <Image
                        src="/expaqlogo.png"
                        alt={"Expaq"}
                        width={120}
                        height={30}
                      />
                    </NavigationLink>
                  </div>

                  <div className="grid gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search activities..."
                        className="pl-9"
                      />
                    </div>{" "}
                    <nav className="grid gap-2">
                      {" "}
                      <NavigationLink
                        href="/activities"
                        className="flex items-center gap-2 text-lg font-medium"
                      >
                        <Compass className="h-5 w-5" /> Discover
                      </NavigationLink>
                      <NavigationLink
                        href="/activities"
                        className="flex items-center gap-2 text-lg font-medium"
                      >
                        <Calendar className="h-5 w-5" /> All Activities
                      </NavigationLink>
                      {/* Links that are always visible */}{" "}
                      <NavigationLink
                        href="/become-a-host"
                        className="flex items-center gap-2 text-lg font-medium"
                      >
                        <Users className="h-5 w-5" /> Become a Host
                      </NavigationLink>
                      {/* Auth-only links */}
                      {user && (
                        <>
                          {" "}
                          <NavigationLink
                            href="/favorites"
                            className="flex items-center gap-2 text-lg font-medium"
                          >
                            <Heart className="h-5 w-5" /> Favorites
                          </NavigationLink>
                          <NavigationLink
                            href="/bookings"
                            className="flex items-center gap-2 text-lg font-medium"
                          >
                            <Calendar className="h-5 w-5" /> My Bookings
                          </NavigationLink>
                          <NavigationLink
                            href="/messages"
                            className="flex items-center gap-2 text-lg font-medium"
                          >
                            <MessageSquare className="h-5 w-5" /> Messages
                          </NavigationLink>
                          <NavigationLink
                            href="/settings"
                            className="flex items-center gap-2 text-lg font-medium"
                          >
                            <Settings className="h-5 w-5" /> Settings
                          </NavigationLink>
                        </>
                      )}
                    </nav>
                    {!user ? (
                      <div className="grid gap-2 mt-4">
                        {" "}
                        <NavigationLink href="/login">
                          <Button variant="outline" className="w-full">
                            <LogIn className="mr-2 h-4 w-4" /> Log in
                          </Button>
                        </NavigationLink>
                        <NavigationLink href="/register">
                          <Button className="w-full">Sign up</Button>
                        </NavigationLink>
                      </div>
                    ) : (
                      <div className="grid gap-2 mt-4">
                        {user && (
                          <div className="flex items-center gap-2 px-2 py-2">
                            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                              {user?.userName?.[0]}
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                {user?.userName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {user?.email}
                              </div>
                            </div>
                          </div>
                        )}{" "}
                        <NavigationLink href="/profile">
                          <Button variant="outline" className="w-full">
                            Your Profile
                          </Button>{" "}
                        </NavigationLink>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            logout();
                            router.push("/login");
                          }}
                        >
                          Sign out
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { useEnhancedNavigation?: boolean }
>(
  (
    { className, title, children, useEnhancedNavigation = false, ...props },
    ref
  ) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          {useEnhancedNavigation ? (
            <NavigationLink
              href="#"
              className={cn(
                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                className
              )}
              {...props}
            >
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </NavigationLink>
          ) : (
            <a
              ref={ref}
              className={cn(
                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                className
              )}
              {...props}
            >
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </a>
          )}
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
