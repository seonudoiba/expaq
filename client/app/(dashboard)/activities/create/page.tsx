import { CreateActivityForm } from '@/components/forms/create-activity-form';

export default function CreateActivityPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Create New Activity
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Fill in the details below to create a new activity.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <CreateActivityForm />
      </div>
    </div>
  );
} 