'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Forum, Topic } from '@/types';
import { getForums, createForum, deleteForum } from '@/services/forums';
import { ForumHeader } from '@/features/forums/ui/ForumHeader';
import { AdminForumList } from '../ui/AdminForumList';
import { CreateForumModal } from '../ui/CreateForumModal';

export function AdminOrchestrator() {
  const { user, isLoaded } = useUser();
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Check if user is admin (first user or specified admin)
  const isAdmin = user?.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID ||
                  user?.emailAddresses?.[0]?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

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

    if (isLoaded && user) {
      loadForums();
    }
  }, [isLoaded, user]);

  const handleCreateForum = async (
    name: string,
    description: string,
    icon: string,
    era: '80s' | '90s' | '00s' | 'all'
  ) => {
    try {
      const newForum = await createForum(name, description, icon || undefined, era);
      setForums((prev) => [...prev, newForum].sort((a, b) => a.name.localeCompare(b.name)));
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create forum:', err);
    }
  };

  const handleDeleteForum = async (id: string) => {
    if (!confirm('Are you sure you want to delete this forum? All topics and posts will be deleted.')) {
      return;
    }

    try {
      await deleteForum(id);
      setForums((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error('Failed to delete forum:', err);
    }
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-zinc-800 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
          <p className="text-gray-400 mb-4">Please sign in to access the admin panel.</p>
          <a
            href="/sign-in"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-sm transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  
   if (!isAdmin) {
     return (
       <div className="container mx-auto px-4 py-8">
         <div className="text-center py-12">
           <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
           <p className="text-gray-400">You don't have permission to access this page.</p>
         </div>
       </div>
     );
   }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ForumHeader title="Admin Panel" description="Manage forums and content" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="forum-card animate-pulse">
              <div className="h-16 bg-zinc-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ForumHeader title="Admin Panel" />
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <ForumHeader title="Admin Panel" description="Manage forums and content" />
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
        >
          + New Forum
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">Forums ({forums.length})</h2>
        <AdminForumList forums={forums} onDelete={handleDeleteForum} />
      </div>

      {showCreateModal && (
        <CreateForumModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateForum}
        />
      )}
    </div>
  );
}
