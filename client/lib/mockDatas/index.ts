import { Activity } from "@/types/activity";

// Mock activities data
const activities: Partial<Activity>[] = [
  {
    id: "a1",
    hostId: "h1",
    hostName: "Michael Johnson",
    hostProfilePictureUrl: "/default.png",
    title: "Italian Pasta Masterclass",
    description: "Learn to make authentic Italian pasta from scratch.",
    price: 55,
    activityType: { id: "t1", name: "Cooking Class", image: "", activityCount: 0 },
    mediaUrls: ["/cooking-class.jpg"],
    maxParticipants: 8,
    minParticipants: 2,
    durationMinutes: 180,
    averageRating: 4.8,
    totalReviews: 24,
    createdAt: "2024-01-10T14:30:00Z",
    active: true,
    verified: true,
  },
  {
    id: "a2",
    hostId: "h2",
    hostName: "Sarah Williams",
    hostProfilePictureUrl: "/default.png",
    title: "Mountain Hiking Experience",
    description: "Guided mountain hike with spectacular views.",
    price: 40,
    activityType: { 
      id: "t2", 
      name: "Outdoor Adventure", 
      image: "",
      activityCount:0
    },
    mediaUrls: ["/hero.jpg"],
    maxParticipants: 12,
    minParticipants: 4,
    durationMinutes: 240,
    averageRating: 4.7,
    totalReviews: 18,
    createdAt: "2024-02-15T09:15:00Z",
    active: true,
    verified: true,
  },
  {
    id: "a3",
    hostId: "h3",
    hostName: "Emma Davis",
    hostProfilePictureUrl: "/default.png",
    title: "Mindfulness Yoga Retreat",
    description: "Rejuvenating yoga session focusing on mindfulness.",
    price: 30,
    activityType: { id: "t3", name: "Wellness", image: "", activityCount: 0 },
    mediaUrls: ["/hero1.jpg"],
    maxParticipants: 15,
    minParticipants: 3,
    durationMinutes: 90,
    averageRating: 4.6,
    totalReviews: 12,
    createdAt: "2024-03-05T11:45:00Z",
    active: true,
    verified: false,
  },
  {
    id: "a4",
    hostId: "h4",
    hostName: "David Brown",
    hostProfilePictureUrl: "/default.png",
    title: "Hidden Gems City Tour",
    description: "Explore secret spots and local favorites in the city.",
    price: 35,
    activityType: { id: "t4", name: "City Tour", image: "", activityCount: 0 },
    mediaUrls: ["/discover.jpg"],
    maxParticipants: 10,
    minParticipants: 2,
    durationMinutes: 180,
    averageRating: 4.9,
    totalReviews: 32,
    createdAt: "2023-12-20T10:00:00Z",
    active: true,
    verified: true,
  },
  {
    id: "a5",
    hostId: "h5",
    hostName: "Anna Martinez",
    hostProfilePictureUrl: "/default.png",
    title: "Spanish Language Immersion",
    description: "Interactive Spanish language session with cultural insights.",
    price: 25,
    activityType: {
      id: "t5",
      name: "Language Exchange",
      image: "",
      activityCount: 0,
    },
    mediaUrls: ["/language-xchange.jpg"],
    maxParticipants: 6,
    minParticipants: 1,
    durationMinutes: 120,
    averageRating: 4.5,
    totalReviews: 8,
    createdAt: "2024-04-10T13:30:00Z",
    active: false,
    verified: false,
  },
];

// Mock pending approval activities
const pendingActivities: Partial<Activity>[] = [
  {
    id: "a6",
    hostId: "h1",
    hostName: "Michael Johnson",
    hostProfilePictureUrl: "/default.png",
    title: "French Pastry Workshop",
    description: "Learn to make exquisite French pastries.",
    price: 60,
    activityType: { id: "t1", name: "Cooking Class", image: "", activityCount: 0 },
    mediaUrls: ["/cooking-class.jpg"],
    maxParticipants: 6,
    minParticipants: 2,
    durationMinutes: 210,
    createdAt: "2024-06-05T15:30:00Z",
    active: false,
    verified: false,
  },
  {
    id: "a7",
    hostId: "h4",
    hostName: "David Brown",
    hostProfilePictureUrl: "/default.png",
    title: "Nightlife Tour",
    description: "Explore the city's vibrant nightlife scene.",
    price: 45,
    activityType: { id: "t4", name: "City Tour", image: "", activityCount: 0 },
    mediaUrls: ["/discover.jpg"],
    maxParticipants: 8,
    minParticipants: 2,
    durationMinutes: 240,
    createdAt: "2024-06-08T09:45:00Z",
    active: false,
    verified: false,
  },
  {
    id: "a8",
    hostId: "h2",
    hostName: "Sarah Williams",
    hostProfilePictureUrl: "/default.png",
    title: "Kayaking Adventure",
    description: "Guided kayaking experience through scenic waterways.",
    price: 55,
    activityType: {
      id: "t2",
      name: "Outdoor Adventure",
      image: "",
      activityCount: 0,
    },
    mediaUrls: ["/hero.jpg"],
    maxParticipants: 8,
    minParticipants: 2,
    durationMinutes: 180,
    createdAt: "2024-06-10T11:20:00Z",
    active: false,
    verified: false,
  },
];

// Mock activity categories
const categories = [
  { id: "t1", name: "Cooking Class", count: 42 },
  { id: "t2", name: "Outdoor Adventure", count: 38 },
  { id: "t3", name: "Wellness", count: 25 },
  { id: "t4", name: "City Tour", count: 31 },
  { id: "t5", name: "Language Exchange", count: 19 },
  { id: "t6", name: "Art & Craft", count: 22 },
  { id: "t7", name: "Music & Dance", count: 15 },
  { id: "t8", name: "Photography", count: 12 },
];

// Featured activities
const featuredActivities = [
  {
    activityId: "a1",
    title: "Italian Pasta Masterclass",
    featuredOrder: 1,
    startDate: "2024-06-01T00:00:00Z",
    endDate: "2024-07-31T23:59:59Z",
  },
  {
    activityId: "a2",
    title: "Mountain Hiking Experience",
    featuredOrder: 2,
    startDate: "2024-06-01T00:00:00Z",
    endDate: "2024-07-31T23:59:59Z",
  },
  {
    activityId: "a4",
    title: "Hidden Gems City Tour",
    featuredOrder: 3,
    startDate: "2024-06-15T00:00:00Z",
    endDate: "2024-08-15T23:59:59Z",
  },
];



// Simplify our approach - define icon types as strings instead of JSX
// to avoid TSX parsing issues in a TS file
// Mock data for platform overview
const platformMetrics = [  {
    title: "Total Users",
    value: "12,856",
    change: "+15.3%",
    trend: "up",
    icon: "UserCircle", // Store icon name as string
    description: "Total users on the platform"
  },
  {
    title: "Total Hosts",
    value: "1,432",
    change: "+8.7%",
    trend: "up",
    icon: "UserCircle", // Store icon name as string
    description: "Total hosts on the platform"
  },
  {
    title: "Active Activities",
    value: "3,245",
    change: "+12.4%",
    trend: "up",
    icon: "Box", // Store icon name as string
    description: "Currently active experiences"
  },
  {
    title: "Revenue (Month)",
    value: "$143,245",
    change: "+23.6%",
    trend: "up",
    icon: "PieChart", // Store icon name as string
    description: "Platform revenue this month"
  }
];

// Mock data for the growth chart
const growthData = [
  { month: "Jan", users: 2500, hosts: 350, activities: 1200 },
  { month: "Feb", users: 3000, hosts: 400, activities: 1300 },
  { month: "Mar", users: 3400, hosts: 450, activities: 1450 },
  { month: "Apr", users: 4200, hosts: 480, activities: 1500 },
  { month: "May", users: 4800, hosts: 520, activities: 1700 },
  { month: "Jun", users: 5200, hosts: 550, activities: 1900 },
  { month: "Jul", users: 6100, hosts: 600, activities: 2200 },
  { month: "Aug", users: 6800, hosts: 700, activities: 2300 },
  { month: "Sep", users: 7500, hosts: 750, activities: 2500 },
  { month: "Oct", users: 8300, hosts: 820, activities: 2700 },
  { month: "Nov", users: 9100, hosts: 950, activities: 2900 },
  { month: "Dec", users: 10000, hosts: 1000, activities: 3100 },
];

// Mock data for activity categories
const activityCategoryData = [
  { name: "Cooking Classes", value: 30 },
  { name: "Language Exchange", value: 25 },
  { name: "Outdoor Adventures", value: 20 },
  { name: "Local Tours", value: 15 },
  { name: "Art & Craft", value: 10 }
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Mock data for pending items
const pendingItems = [
  { type: "Host Verification", count: 24 },
  { type: "Activity Approval", count: 37 },
  { type: "Refund Requests", count: 12 },
  { type: "User Reports", count: 7 },
];

export {activities, pendingActivities, categories, featuredActivities, pendingItems, COLORS, activityCategoryData, growthData, platformMetrics}