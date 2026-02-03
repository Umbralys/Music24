'use client';

import { useEffect, useState } from 'react';
import { Forum } from '@/types';
import { getForums } from '@/services/forums';
import { ForumList } from '../ui/ForumList';
import { ForumHeader } from '../ui/ForumHeader';

export function ForumsOrchestrator() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadForums() {
      try {
        setLoading(true);
        const data = await getForums();
        setForums(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load forums');
      } finally {
        setLoading(false);
      }
    }

    loadForums();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ForumHeader
          title="Forums"
          description="Explore discussions about the golden era of hip hop and R&B"
        />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="forum-card animate-pulse">
              <div className="h-20 bg-zinc-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ForumHeader title="Forums" />
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ForumHeader
        title="Forums"
        description="Explore discussions about the golden era of hip hop and R&B"
      />
      <ForumList forums={forums} />
    </div>
  );
}
