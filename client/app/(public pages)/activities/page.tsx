import { Suspense } from "react";
import { ActivityList } from "@/components/activities/activity-list";
import { ActivityFilters } from "@/components/activities/activity-filters";
// import { CreateActivityButton } from "@/components/activities/create-activity-button";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Users } from "lucide-react";

export default function ActivitiesPage() {
  return (
    <section className=" py-1 md:py-1 lg:py-2">
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Top Experiences
            </h2>
            <p className="text-muted-foreground mt-2">
              Handpicked activities you&apos;ll love
            </p>
          </div>
        </div>
        {/* <CreateActivityButton /> */}
      </div>
      <ActivityFilters />

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Where are you going?" className="pl-10" />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input placeholder="When?" className="pl-10" />
          </div>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Number of people" className="pl-10" />
          </div>
          <Button className="w-full">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>
      </div>
      <div className="">
        <Suspense fallback={<div>Loading activities...</div>}>
          <ActivityList />
        </Suspense>
      </div>
    </section>
  );
}
