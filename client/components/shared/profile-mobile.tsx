"use client"

import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';

export function ProfileMobile() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Disclosure as="div" className="block md:hidden">
      {({ open }) => (
        <>
          <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-900 hover:bg-gray-100">
            <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
          </Disclosure.Button>
          
          {open && (
            <div className="absolute right-0 z-10 mt-2 w-full bg-white py-1 shadow-lg">
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                      {user?.userName?.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user?.userName}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    onClick={() => {}}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Disclosure>
  );
}

