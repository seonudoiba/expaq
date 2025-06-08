import { cn } from "@/lib/utils"
import React from "react"

/**
 * A skeleton loader component that can be styled with different sizes and shapes.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...props}
    />
  )
}