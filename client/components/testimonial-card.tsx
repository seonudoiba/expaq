import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useMemo } from "react"

interface TestimonialCardProps {
  name: string
  location: string
  image: string
  rating: number
  text: string
}

export function TestimonialCard({ name, location, image, rating, text }: TestimonialCardProps) {
  const starRatings = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => {
      if (i < Math.floor(rating)) {
        return "full"
      } else if (i < Math.ceil(rating)) {
        return "partial"
      } else {
        return "empty"
      }
    })
  }, [rating])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative h-12 w-12 rounded-full overflow-hidden">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>
          <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        </div>
        <div className="flex mb-4">
          {starRatings.map((type, i) => (
            <div key={i} className="relative h-4 w-4">
              <Star className="absolute top-0 left-0 h-4 w-4 text-muted" />
              {type === "full" && <Star className="absolute top-0 left-0 h-4 w-4 text-yellow-500 fill-current" />}
              {type === "partial" && (
                <Star
                  className="absolute top-0 left-0 h-4 w-4 text-yellow-500 fill-current"
                  style={{ clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)` }}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  )
}