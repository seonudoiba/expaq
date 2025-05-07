import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth';

export function CreateActivityButton() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'HOST') {
      // Show upgrade to host message
      return;
    }

    router.push('/activities/create');
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
    >
      Create Activity
    </Button>
  );
} 