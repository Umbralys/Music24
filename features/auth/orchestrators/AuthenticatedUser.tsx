'use client';

import { useUser } from '@clerk/nextjs';
import { UserButton } from '../ui/UserButton';
import Link from 'next/link';

export function AuthenticatedUser() {
  let isSignedIn = false;
  let isLoaded = false;
  let hasClerk = true;

  try {
    const user = useUser();
    isSignedIn = user.isSignedIn;
    isLoaded = user.isLoaded;
  } catch (error) {
    // Clerk is not configured
    hasClerk = false;
  }

  // Show setup message if Clerk is not configured
  if (!hasClerk) {
    return (
      <div className="text-xs text-gray-400 hidden sm:block">
        <Link href="https://dashboard.clerk.com" target="_blank" className="hover:text-blue-400">
          Setup Clerk →
        </Link>
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="w-10 h-10 bg-gray-800 rounded-full animate-pulse" />;
  }

  if (!isSignedIn) {
    return (
      <div className="flex gap-4 items-center">
        <Link
          href="/sign-in"
          className="text-sm font-medium hover:text-blue-400 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="text-sm font-medium bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return <UserButton />;
}
