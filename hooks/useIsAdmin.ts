'use client';

import { useUser } from '@clerk/nextjs';

export function useIsAdmin(): boolean {
  const { user } = useUser();

  if (!user) return false;

  const isAdmin =
    user.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID ||
    user.emailAddresses?.[0]?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return isAdmin;
}
