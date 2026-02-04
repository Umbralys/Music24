'use client';

import { UserProfile } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface ProfileCardProps {
  profile: UserProfile;
  isOwnProfile: boolean;
}

const ERA_STYLES: Record<string, { bg: string; text: string }> = {
  '80s': { bg: 'bg-gradient-to-r from-pink-500 to-cyan-400', text: 'text-white' },
  '90s': { bg: 'bg-gradient-to-r from-yellow-500 to-blue-500', text: 'text-white' },
  '00s': { bg: 'bg-gradient-to-r from-gray-300 to-gray-500', text: 'text-gray-900' },
};

export function ProfileCard({ profile, isOwnProfile }: ProfileCardProps) {
  const eraStyle = profile.favorite_era ? ERA_STYLES[profile.favorite_era] : null;

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-blue-600/20 to-amber-500/20" />

      <div className="px-6 pb-6">
        <div className="flex items-end gap-4 -mt-12">
          <div className="relative">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name || profile.username}
                width={96}
                height={96}
                className="rounded-full border-4 border-zinc-900 bg-zinc-800"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-zinc-900 bg-zinc-800 flex items-center justify-center">
                <span className="text-3xl text-gray-500">
                  {(profile.display_name || profile.username).charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-xl font-bold text-white">
              {profile.display_name || profile.username}
            </h1>
            <p className="text-sm text-gray-400">@{profile.username}</p>
          </div>

          {isOwnProfile && (
            <Link
              href="/profile/edit"
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition-colors border border-zinc-700"
            >
              Edit Profile
            </Link>
          )}
        </div>

        {profile.favorite_era && eraStyle && (
          <div className="mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${eraStyle.bg} ${eraStyle.text}`}>
              {profile.favorite_era} Era
            </span>
          </div>
        )}

        {profile.bio && (
          <p className="mt-4 text-gray-300 text-sm leading-relaxed">
            {profile.bio}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-zinc-800">
          <p className="text-xs text-gray-500">
            Member since {new Date(profile.created_at).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
