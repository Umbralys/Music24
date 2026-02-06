'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { Topic, Message, Forum, MessageVoteInfo, EraBadge } from '@/types';
import { getTopicBySlug } from '@/services/topics';
import { getForumBySlug } from '@/services/forums';
import { getMessagesByTopicId, createTopicMessage, subscribeToTopicMessages } from '@/services/messages';
import { getVoteCountsForMessages, getUserEraBadges, upvoteMessage } from '@/services/votes';
import { ForumHeader } from '@/features/forums/ui/ForumHeader';
import { MessageList } from '@/features/chat/ui/MessageList';
import { MessageInput } from '@/features/chat/ui/MessageInput';
import { getOrCreateUserProfile } from '@/services/users';
import { Breadcrumb } from '@/features/shared/ui/Breadcrumb';

interface TopicDetailOrchestratorProps {
  forumSlug: string;
  topicSlug: string;
}

export function TopicDetailOrchestrator({ forumSlug, topicSlug }: TopicDetailOrchestratorProps) {
  const { user, isLoaded } = useUser();
  const [forum, setForum] = useState<Forum | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteMap, setVoteMap] = useState<Record<string, MessageVoteInfo>>({});
  const [badgeMap, setBadgeMap] = useState<Record<string, EraBadge[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  // Batch-load votes and badges for a set of messages
  const loadVotesAndBadges = useCallback(async (msgs: Message[], currentUserId: string | null) => {
    try {
      const messageIds = msgs.map(m => m.id);
      const authorIds = [...new Set(msgs.map(m => m.user_id))];

      const [votes, badges] = await Promise.all([
        getVoteCountsForMessages(messageIds, currentUserId || undefined),
        getUserEraBadges(authorIds),
      ]);

      setVoteMap(votes);
      setBadgeMap(badges);
    } catch (err) {
      console.error('Failed to load votes/badges:', err);
    }
  }, []);

  // Load forum, topic and messages
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [forumData, topicData] = await Promise.all([
          getForumBySlug(forumSlug),
          getTopicBySlug(topicSlug),
        ]);
        setForum(forumData);
        setTopic(topicData);

        const messagesData = await getMessagesByTopicId(topicData.id);
        setMessages(messagesData);

        await loadVotesAndBadges(messagesData, userProfileId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load topic');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [forumSlug, topicSlug, loadVotesAndBadges, userProfileId]);

  // Real-time subscription
  useEffect(() => {
    if (!topic?.id) return;

    const channel = subscribeToTopicMessages(topic.id, (newMessage) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m.id === newMessage.id)) {
          return prev;
        }
        return [...prev, newMessage];
      });

      // New message starts with 0 votes
      setVoteMap(prev => ({
        ...prev,
        [newMessage.id]: { vote_count: 0, has_voted: false },
      }));

      // Fetch badges for the author if not cached
      if (newMessage.user_id) {
        setBadgeMap(prev => {
          if (prev[newMessage.user_id]) return prev;
          getUserEraBadges([newMessage.user_id]).then(badges => {
            setBadgeMap(p => ({ ...p, ...badges }));
          });
          return prev;
        });
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [topic?.id]);

  const handleSendMessage = async (content: string) => {
    if (!topic || !userProfileId) return;

    try {
      await createTopicMessage(topic.id, userProfileId, content);
      // Message will be added via real-time subscription
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleUpvote = async (messageId: string) => {
    if (!userProfileId) return;

    try {
      const { voted } = await upvoteMessage(messageId, userProfileId);
      if (voted) {
        setVoteMap(prev => ({
          ...prev,
          [messageId]: {
            vote_count: (prev[messageId]?.vote_count || 0) + 1,
            has_voted: true,
          },
        }));
      }
    } catch (err) {
      console.error('Failed to upvote:', err);
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

  if (error || !topic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-400">{error || 'Topic not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-4rem)]">
      <Breadcrumb
        items={[
          { label: 'Forums', href: '/forums' },
          { label: forum?.name || 'Forum', href: `/forums/${forumSlug}` },
          { label: topic.title },
        ]}
      />
      <ForumHeader
        title={topic.title}
        description={topic.description || undefined}
      />

      <div className="flex-1 overflow-y-auto mt-6 p-4">
        <MessageList
          messages={messages}
          currentUserId={userProfileId || undefined}
          voteMap={voteMap}
          badgeMap={badgeMap}
          onUpvote={handleUpvote}
        />
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 sticky bottom-0 bg-[var(--background)] py-4">
        {user ? (
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={!userProfileId || topic.locked}
          />
        ) : (
          <p className="text-center text-gray-400 py-4">
            <a href="/sign-in" className="text-blue-400 hover:text-blue-300">Sign in</a> to post a reply
          </p>
        )}
      </div>
    </div>
  );
}
