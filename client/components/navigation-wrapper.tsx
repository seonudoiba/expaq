"use client";

import dynamic from "next/dynamic";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Export all components with dynamic imports to ensure client-side rendering
export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
};

// Create a wrapper component that will be imported with no SSR
export const ClientSideNavigationMenu = dynamic(
  () => Promise.resolve(NavigationMenu),
  { ssr: false }
);

export const ClientSideNavigationMenuList = dynamic(
  () => Promise.resolve(NavigationMenuList),
  { ssr: false }
);
