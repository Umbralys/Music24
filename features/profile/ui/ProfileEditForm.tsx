'use client';

import { useState, FormEvent } from 'react';
import { UserProfile, EraTag } from '@/types';
import { EraSelector } from './EraSelector';

interface ProfileEditFormProps {
  initialData: UserProfile;
  onSubmit: (data: {
    display_name: string;
    bio: string;
    favorite_era?: EraTag;
  }) => Promise<void>;
  onCancel: () => void;
}

export function ProfileEditForm({ initialData, onSubmit, onCancel }: ProfileEditFormProps) {
  const [displayName, setDisplayName] = useState(initialData.display_name || '');
  const [bio, setBio] = useState(initialData.bio || '');
  const [favoriteEra, setFavoriteEra] = useState<EraTag | undefined>(initialData.favorite_era);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await onSubmit({
        display_name: displayName.trim(),
        bio: bio.trim(),
        favorite_era: favoriteEra,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Display Name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="How you want to be known"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about your music journey..."
          rows={4}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors resize-none"
        />
      </div>

      <EraSelector value={favoriteEra} onChange={setFavoriteEra} />

      <div className="flex gap-3 justify-end pt-4 border-t border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
