"use client";

import { useActivitiesStore } from "@/lib/store/useActivitiesStore";

export function DebugActivities() {
  const { activities, isLoading, error } = useActivitiesStore();

  return (
    <div className="border border-red-500 p-4 my-4 bg-gray-100 text-sm">
      <h3 className="font-bold mb-2">Debug Information</h3>
      <div>
        <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>Error:</strong> {error ? error.message : 'None'}
      </div>
      <div>
        <strong>Activities Count:</strong> {activities?.length || 0}
      </div>
      {activities && activities.length > 0 && (
        <div className="mt-2">
          <strong>First Activity:</strong>
          <pre className="text-xs overflow-auto mt-1 bg-gray-200 p-2 rounded">
            {JSON.stringify(activities[0], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
