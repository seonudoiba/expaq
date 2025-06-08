"use client"

// import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth';
import { Role } from '@/types';

export function CreateActivityButton() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  // const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!user.roles.some((role: Role) => role.name === 'HOST')) {
      // Show upgrade to host message
      alert('You need to be a host to create an activity. Please upgrade your account.');
      return;
    }

    router.push('/activities/create');
  };


  return (
    <Button
      onClick={handleClick}
      // disabled={isLoading}
    >
      Create Activity
    </Button>
  );
} 