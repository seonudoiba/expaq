// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"

// interface ActivitySkeletonProps {
//   count?: number
// }

// export function ActivitySkeleton({ count = 6 }: ActivitySkeletonProps) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {Array.from({ length: count }).map((_, i) => (
//         <Card key={i} className="overflow-hidden">
//           <div className="relative h-48 w-full">
//             <Skeleton className="h-full w-full" />
//             <div className="absolute top-3 left-3">
//               <Skeleton className="h-6 w-16 rounded-full" />
//             </div>
//           </div>
//           <CardContent className="p-4">
//             <div className="flex items-center mb-2">
//               <Skeleton className="h-4 w-4 mr-1" />
//               <Skeleton className="h-4 w-24" />
//             </div>
//             <Skeleton className="h-6 w-full mb-2" />
//             <Skeleton className="h-6 w-3/4 mb-2" />
//             <div className="flex items-center">
//               <Skeleton className="h-4 w-4 mr-1" />
//               <Skeleton className="h-4 w-8 mr-1" />
//               <Skeleton className="h-4 w-20" />
//             </div>
//           </CardContent>
//           <CardFooter className="p-4 pt-0">
//             <Skeleton className="h-6 w-20" />
//           </CardFooter>
//         </Card>
//       ))}
//     </div>
//   )
// }
