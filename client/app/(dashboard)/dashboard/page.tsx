import { Suspense } from 'react';
import { ActivityList } from '@/components/activities/activity-list';
import { ActivityFilters } from '@/components/activities/activity-filters';
import { CreateActivityButton } from '@/components/activities/create-activity-button';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <CreateActivityButton />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Suspense fallback={<div>Loading activities...</div>}>
            <ActivityList />
          </Suspense>
        </div>
        <div>
          <ActivityFilters />
        </div>
      </div>
    </div>
  );
} 