import React from "react";
import {
//   BoxCubeIcon,
//   CalenderIcon,
  GridIcon,
//   ListIcon,
//   PageIcon,
//   PieChartIcon,
//   PlugInIcon,
//   TableIcon,
  UserCircleIcon,
} from "@/icons/index";

// Custom icon for activities and reviews
export const ActivityIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
  </svg>
);

export const ReviewsIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

export const SettingsIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const PaymentsIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
  </svg>
);

export const ReportsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
  </svg>
);

export const SystemMonitorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
  </svg>
);

export const ModerationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export const adminNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/admin", // Main admin dashboard
  },
  {
    icon: <UserCircleIcon />,
    name: "User Management",
    subItems: [
      { name: "All Users", path: "/admin/users", pro: false },
      { name: "Guests", path: "/admin/users/guests", pro: false },
      { name: "Hosts", path: "/admin/users/hosts", pro: false },
      { name: "Admins", path: "/admin/users/admins", pro: false },
      { name: "Verification", path: "/admin/users/verification", pro: false },
    ],
  },
  {
    icon: <ActivityIcon />,
    name: "Activities",
    subItems: [
      { name: "All Activities", path: "/admin/activities", pro: false },
      { name: "Categories", path: "/admin/activities/categories", pro: false },
      { name: "Featured", path: "/admin/activities/featured", pro: false },
      { name: "Pending Review", path: "/admin/activities/pending", pro: false },
    ],
  },
  {
    icon: <ReviewsIcon />,
    name: "Reviews",
    subItems: [
      { name: "All Reviews", path: "/admin/reviews", pro: false },
      { name: "Flagged Reviews", path: "/admin/reviews/flagged", pro: false },
    ],
  },
  {
    icon: <PaymentsIcon />,
    name: "Payments",
    subItems: [
      { name: "Transactions", path: "/admin/payments/transactions", pro: false },
      { name: "Refunds", path: "/admin/payments/refunds", pro: false },
      { name: "Payouts", path: "/admin/payments/payouts", pro: false },
    ],
  },  {
    icon: <ReportsIcon />,
    name: "Analytics",
    subItems: [
      { name: "Platform Overview", path: "/admin/analytics/overview", pro: false },
      { name: "User Growth", path: "/admin/analytics/users", pro: false },
      { name: "Revenue", path: "/admin/analytics/revenue", pro: false },
      { name: "Activity Trends", path: "/admin/analytics/activities", pro: false },
    ],
  },
  {
    icon: <ModerationIcon />,
    name: "Moderation",
    subItems: [
      { name: "User Activity", path: "/admin/moderation/user-activity", pro: false },
      { name: "Reported Content", path: "/admin/moderation/reported-content", pro: false },
      { name: "Content Filters", path: "/admin/moderation/content-filters", pro: false },
    ],
  },
  {    icon: <SettingsIcon />,
    name: "Settings",
    subItems: [
      { name: "General", path: "/admin/settings/general", pro: false },
      { name: "Appearance", path: "/admin/settings/appearance", pro: false },
      { name: "Fees & Commission", path: "/admin/settings/fees", pro: false },
      { name: "Email Templates", path: "/admin/settings/emails", pro: false },
    ],
  },
  {
    icon: <SystemMonitorIcon />,
    name: "System",
    subItems: [
      { name: "Monitoring", path: "/admin/system/monitoring", pro: false },
      { name: "Logs", path: "/admin/system/logs", pro: false },
      { name: "Audit Trail", path: "/admin/system/audit", pro: false },
      { name: "Health Status", path: "/admin/system/health", pro: false },
    ],
  },
];
