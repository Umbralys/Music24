import { supabase } from '@/lib/supabase';
import { Message, SubTopic } from '@/types';

// Get messages (posts) for a topic
export async function getMessagesByTopicId(topicId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      author:user_profiles(*)
    `)
    .eq('topic_id', topicId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Message[];
}

// Create a new message (post) in a topic
export async function createTopicMessage(topicId: string, userId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      topic_id: topicId,
      user_id: userId,
      content,
    })
    .select(`
      *,
      author:user_profiles(*)
    `)
    .single();

  if (error) throw error;
  return data as Message;
}

// Subscribe to real-time messages for a topic
export function subscribeToTopicMessages(
  topicId: string,
  onNewMessage: (message: Message) => void
) {
  return supabase
    .channel(`topic-${topicId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `topic_id=eq.${topicId}`,
      },
      async (payload) => {
        // Fetch the full message with author info
        const { data } = await supabase
          .from('messages')
          .select(`*, author:user_profiles(*)`)
          .eq('id', payload.new.id)
          .single();

        if (data) {
          onNewMessage(data as Message);
        }
      }
    )
    .subscribe();
}

// Legacy functions for sub-topics (kept for compatibility)
export async function getSubTopicsByTopicId(topicId: string) {
  const { data, error } = await supabase
    .from('sub_topics')
    .select(`
      *,
      author:user_profiles(*)
    `)
    .eq('topic_id', topicId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as SubTopic[];
}

export async function getMessagesBySubTopicId(subTopicId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      author:user_profiles(*)
    `)
    .eq('sub_topic_id', subTopicId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Message[];
}

export async function createMessage(subTopicId: string, userId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sub_topic_id: subTopicId,
      user_id: userId,
      content,
    } as any)
    .select(`
      *,
      author:user_profiles(*)
    `)
    .single();

  if (error) throw error;
  return data as Message;
}
