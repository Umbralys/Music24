'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { Message, SubTopic, Forum, Topic } from '@/types';
import { getMessagesBySubTopicId, createMessage } from '@/services/messages';
import { getForumBySlug } from '@/services/forums';
import { getTopicBySlug } from '@/services/topics';
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
  const { user } = useUser();
  const [forum, setForum] = useState<Forum | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [subTopic, setSubTopic] = useState<SubTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chat');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [forumSlug, topicSlug, subTopicSlug]);

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
            setMessages((prev) => [...prev, data as unknown as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [subTopic]);

  const handleSendMessage = async (content: string) => {
    if (!user || !subTopic) return;

    try {
      // Note: In production, you'd store the Clerk user ID in your user_profiles table
      // For now, we'll use the Clerk user ID directly
      await createMessage(subTopic.id, user.id, content);
    } catch (err) {
      console.error('Failed to send message:', err);
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
            <MessageList messages={messages} currentUserId={user?.id} />
            <div ref={messagesEndRef} />
          </>
        }
        input={
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={!user}
          />
        }
      />
    </div>
  );
}
