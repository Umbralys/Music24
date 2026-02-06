'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { Message, SubTopic, Forum, Topic, MessageVoteInfo, EraBadge } from '@/types';
import { getMessagesBySubTopicId, createMessage } from '@/services/messages';
import { getForumBySlug } from '@/services/forums';
import { getTopicBySlug } from '@/services/topics';
import { getVoteCountsForMessages, getUserEraBadges, upvoteMessage } from '@/services/votes';
import { getOrCreateUserProfile } from '@/services/users';
import { supabase } from '@/lib/supabase';
import { ChatContainer } from '../ui/ChatContainer';
import { MessageList } from '../ui/MessageList';
import { MessageInput } from '../ui/MessageInput';
import { ForumHeader } from '@/features/forums/ui/ForumHeader';
import { Breadcrumb } from '@/features/shared/ui/Breadcrumb';

interface ChatOrchestratorProps {
  forumSlug: string;
  topicSlug: string;
  subTopicSlug: string;
}

export function ChatOrchestrator({ forumSlug, topicSlug, subTopicSlug }: ChatOrchestratorProps) {
  const { user, isLoaded } = useUser();
  const [forum, setForum] = useState<Forum | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [subTopic, setSubTopic] = useState<SubTopic | null>(null);
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

  // Load forum, topic, sub-topic and messages
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Load forum and topic in parallel
        const [forumData, topicData] = await Promise.all([
          getForumBySlug(forumSlug),
          getTopicBySlug(topicSlug),
        ]);
        setForum(forumData);
        setTopic(topicData);

        // Get sub-topic by slug
        const { data: subTopicData, error: subTopicError } = await supabase
          .from('sub_topics')
          .select('*')
          .eq('slug', subTopicSlug)
          .single();

        if (subTopicError || !subTopicData) throw subTopicError || new Error('Sub-topic not found');

        const typedSubTopic = subTopicData as SubTopic;
        setSubTopic(typedSubTopic);

        // Get messages
        const messagesData = await getMessagesBySubTopicId(typedSubTopic.id);
        setMessages(messagesData);

        await loadVotesAndBadges(messagesData, userProfileId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chat');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [forumSlug, topicSlug, subTopicSlug, loadVotesAndBadges, userProfileId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!subTopic) return;

    const channel = supabase
      .channel(`messages:${subTopic.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sub_topic_id=eq.${subTopic.id}`,
        },
        async (payload) => {
          // Fetch the full message with author info
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              author:user_profiles(*)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            const newMessage = data as unknown as Message;
            setMessages((prev) => [...prev, newMessage]);

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
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [subTopic]);

  const handleSendMessage = async (content: string) => {
    if (!userProfileId || !subTopic) return;

    try {
      await createMessage(subTopic.id, userProfileId, content);
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
          <div className="h-64 bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !subTopic) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-400">{error || 'Chat not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Forums', href: '/forums' },
          { label: forum?.name || 'Forum', href: `/forums/${forumSlug}` },
          { label: topic?.title || 'Topic', href: `/forums/${forumSlug}/topics/${topicSlug}` },
          { label: subTopic.title },
        ]}
      />
      <ChatContainer
        header={<ForumHeader title={subTopic.title} />}
        messages={
          <>
            <MessageList
              messages={messages}
              currentUserId={userProfileId || undefined}
              voteMap={voteMap}
              badgeMap={badgeMap}
              onUpvote={handleUpvote}
            />
            <div ref={messagesEndRef} />
          </>
        }
        input={
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={!userProfileId}
          />
        }
      />
    </div>
  );
}
