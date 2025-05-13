"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Search, Menu, X, MapPin, Compass, Users, Calendar, Heart, MessageSquare, Settings, LogIn } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function Header() {
  const isMobile = useMobile()
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Compass className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Expaq</span>
          </Link>
          {!isMobile && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Discover</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
                            href="/activities"
                          >
                            <div className="mt-4 mb-2 text-lg font-medium text-white">Featured Activities</div>
                            <p className="text-sm leading-tight text-white/90">
                              Discover our handpicked selection of extraordinary experiences
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/activities/outdoor" title="Outdoor Adventures">
                        Hiking, kayaking, and more outdoor activities
                      </ListItem>
                      <ListItem href="/activities/food" title="Food & Drink">
                        Cooking classes, food tours, and tastings
                      </ListItem>
                      <ListItem href="/activities/culture" title="Cultural Experiences">
                        Art, history, and local traditions
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/activities" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>All Activities</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/become-a-host" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Become a Host</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!isMobile && !showSearch && (
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}
          {!isMobile && showSearch && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search activities..." className="w-[300px] pl-9" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          )}
          {!isMobile && (
            <>
              <Link href="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
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
                    <Compass className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">Expaq</span>
                  </div>
                  <div className="grid gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search activities..." className="pl-9" />
                    </div>
                    <nav className="grid gap-2">
                      <Link href="/activities" className="flex items-center gap-2 text-lg font-medium">
                        <Compass className="h-5 w-5" /> Discover
                      </Link>
                      <Link href="/activities" className="flex items-center gap-2 text-lg font-medium">
                        <Calendar className="h-5 w-5" /> All Activities
                      </Link>
                      <Link href="/favorites" className="flex items-center gap-2 text-lg font-medium">
                        <Heart className="h-5 w-5" /> Favorites
                      </Link>
                      <Link href="/bookings" className="flex items-center gap-2 text-lg font-medium">
                        <Calendar className="h-5 w-5" /> My Bookings
                      </Link>
                      <Link href="/messages" className="flex items-center gap-2 text-lg font-medium">
                        <MessageSquare className="h-5 w-5" /> Messages
                      </Link>
                      <Link href="/become-a-host" className="flex items-center gap-2 text-lg font-medium">
                        <Users className="h-5 w-5" /> Become a Host
                      </Link>
                      <Link href="/settings" className="flex items-center gap-2 text-lg font-medium">
                        <Settings className="h-5 w-5" /> Settings
                      </Link>
                    </nav>
                    <div className="grid gap-2 mt-4">
                      <Link href="/login">
                        <Button variant="outline" className="w-full">
                          <LogIn className="mr-2 h-4 w-4" /> Log in
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="w-full">Sign up</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"