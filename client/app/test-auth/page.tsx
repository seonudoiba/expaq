"use client";

import { ProtectedComponent } from '@/components/auth/ProtectedComponent';

export default function TestProtectedPage() {
  return (
    <ProtectedComponent
      requiredRoles={["ADMIN", "host"]}
      customMessages={{
        unauthorized: "This test page requires either ADMIN or host access.",
        unauthenticated: "Please sign in to test protected content access."
      }}
    >
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Protected Content</h1>
        <p className="mb-4">
          This content is only visible to authenticated users with the required permissions.
        </p>
        <div className="bg-green-100 p-4 border border-green-300 rounded">
          <p className="text-green-700">
            If you can see this, you have successfully authenticated and have the required permissions!
          </p>
        </div>
      </div>
    </ProtectedComponent>
  );
}
