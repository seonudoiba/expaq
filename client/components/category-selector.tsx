import Link from "next/link"
import { MountainIcon as Hiking, Utensils, Landmark, Waves, Music, Camera, Bike, SpadeIcon as Spa } from "lucide-react"

export function CategorySelector() {
  const categories = [
    {
      name: "Outdoor Adventures",
      icon: <Hiking className="h-6 w-6" />,
      href: "/activities/outdoor",
      color: "bg-green-100 text-green-700",
    },
    {
      name: "Food & Drink",
      icon: <Utensils className="h-6 w-6" />,
      href: "/activities/food",
      color: "bg-orange-100 text-orange-700",
    },
    {
      name: "Cultural",
      icon: <Landmark className="h-6 w-6" />,
      href: "/activities/culture",
      color: "bg-purple-100 text-purple-700",
    },
    {
      name: "Water Activities",
      icon: <Waves className="h-6 w-6" />,
      href: "/activities/water",
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "Music & Nightlife",
      icon: <Music className="h-6 w-6" />,
      href: "/activities/music",
      color: "bg-pink-100 text-pink-700",
    },
    {
      name: "Photography",
      icon: <Camera className="h-6 w-6" />,
      href: "/activities/photography",
      color: "bg-amber-100 text-amber-700",
    },
    {
      name: "Cycling",
      icon: <Bike className="h-6 w-6" />,
      href: "/activities/cycling",
      color: "bg-red-100 text-red-700",
    },
    {
      name: "Wellness",
      icon: <Spa className="h-6 w-6" />,
      href: "/activities/wellness",
      color: "bg-teal-100 text-teal-700",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={category.href}
          className="flex flex-col items-center p-4 rounded-lg border bg-card hover:border-primary transition-colors"
        >
          <div className={`rounded-full p-3 mb-3 ${category.color}`}>{category.icon}</div>
          <span className="text-center font-medium">{category.name}</span>
        </Link>
      ))}
    </div>
  )
}