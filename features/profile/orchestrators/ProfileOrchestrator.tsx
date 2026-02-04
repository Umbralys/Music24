'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserProfile } from '@/services/users';
import { UserProfile } from '@/types';
import { ProfileCard } from '../ui/ProfileCard';

export function ProfileOrchestrator() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!isLoaded) return;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const profileData = await getUserProfile(user.id);
        setProfile(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 animate-pulse">
          <div className="h-24 bg-zinc-800 rounded-lg mb-4" />
          <div className="flex items-end gap-4 -mt-12">
            <div className="w-24 h-24 bg-zinc-800 rounded-full" />
            <div className="flex-1 space-y-2 pb-2">
              <div className="h-6 bg-zinc-800 rounded w-32" />
              <div className="h-4 bg-zinc-800 rounded w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-gray-400">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-400">Your profile hasn&apos;t been created yet. Try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ProfileCard profile={profile} isOwnProfile={true} />
    </div>
  );
}
