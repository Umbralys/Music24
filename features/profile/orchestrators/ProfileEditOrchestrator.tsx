'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { getUserProfile, updateUserProfile } from '@/services/users';
import { UserProfile, EraTag } from '@/types';
import { ProfileEditForm } from '../ui/ProfileEditForm';

export function ProfileEditOrchestrator() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (data: {
    display_name: string;
    bio: string;
    favorite_era?: EraTag;
  }) => {
    if (!user) return;

    const updatedProfile = await updateUserProfile(user.id, data);
    setProfile(updatedProfile);
    setSuccess(true);

    setTimeout(() => {
      router.push('/profile');
    }, 1000);
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (!isLoaded || loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 animate-pulse">
          <div className="h-8 bg-zinc-800 rounded w-48 mb-6" />
          <div className="space-y-4">
            <div className="h-12 bg-zinc-800 rounded" />
            <div className="h-24 bg-zinc-800 rounded" />
            <div className="h-12 bg-zinc-800 rounded" />
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
          <p className="text-gray-400">Please sign in to edit your profile.</p>
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

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-green-400 mb-2">Profile Updated</h2>
          <p className="text-gray-400">Redirecting to your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>
        <ProfileEditForm
          initialData={profile}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
