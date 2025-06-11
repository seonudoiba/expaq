import { Suspense } from "react";
import { ActivityList } from "@/components/activities/activity-list";
import { ActivityFilters } from "@/components/activities/activity-filters";
// import { CreateActivityButton } from "@/components/activities/create-activity-button";


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

      
      <div className="">
        <Suspense fallback={<div>Loading activities...</div>}>
          <ActivityList />
        </Suspense>
      </div>
    </section>
  );
}
