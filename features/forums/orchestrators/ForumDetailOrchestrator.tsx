'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Forum, Topic, EraTag } from '@/types';
import { getForumBySlug } from '@/services/forums';
import { getTopicsByForumId, createTopic } from '@/services/topics';
import { getOrCreateUserProfile } from '@/services/users';
import { ForumHeader } from '../ui/ForumHeader';
import { TopicList } from '@/features/topics/ui/TopicList';
import { CreateTopicModal } from '../ui/CreateTopicModal';
import { Breadcrumb } from '@/features/shared/ui/Breadcrumb';
import { useIsAdmin } from '@/hooks/useIsAdmin';

interface ForumDetailOrchestratorProps {
  slug: string;
}

export function ForumDetailOrchestrator({ slug }: ForumDetailOrchestratorProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const [forum, setForum] = useState<Forum | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load or create user profile
  useEffect(() => {
    async function loadUserProfile() {
      if (user?.id) {
        try {
          const profile = await getOrCreateUserProfile(
            user.id,
            user.emailAddresses?.[0]?.emailAddress,
            user.firstName ?? undefined,
            user.lastName ?? undefined,
            user.imageUrl
          );
          setUserProfileId(profile.id);
        } catch (err) {
          console.error('Failed to load user profile:', err);
        }
      }
    }
    if (isLoaded) {
      loadUserProfile();
    }
  }, [user, isLoaded]);

  useEffect(() => {
    async function loadForumAndTopics() {
      try {
        setLoading(true);
        const forumData = await getForumBySlug(slug);
        setForum(forumData);

        const topicsData = await getTopicsByForumId(forumData.id);
        setTopics(topicsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load forum');
      } finally {
        setLoading(false);
      }
    }

    loadForumAndTopics();
  }, [slug]);

  const handleCreateTopic = async (title: string, description: string, eraTags: EraTag[]) => {
    if (!forum || !userProfileId) return;

    try {
      const newTopic = await createTopic(forum.id, userProfileId, title, description || undefined, eraTags);
      setShowCreateModal(false);
      // Navigate to the new topic
      router.push(`/forums/${slug}/topics/${newTopic.slug}`);
    } catch (err) {
      console.error('Failed to create topic:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-zinc-800 rounded w-1/3"></div>
          <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !forum) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-400">{error || 'Forum not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Forums', href: '/forums' },
          { label: forum.name },
        ]}
      />
      <div className="flex justify-between items-start mb-6">
        <ForumHeader
          title={forum.name}
          description={forum.description}
        />
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
          >
            New Topic
          </button>
        )}
      </div>

      <TopicList topics={topics} forumSlug={slug} />

      {showCreateModal && (
        <CreateTopicModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTopic}
        />
      )}
    </div>
  );
}
