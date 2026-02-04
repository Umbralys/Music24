import { supabase } from '@/lib/supabase';
import { Topic, EraTag } from '@/types';

export async function getTopicsByForumId(forumId: string) {
  const { data, error } = await supabase
    .from('topics')
    .select(`
      *,
      author:user_profiles(*),
      messages(count)
    `)
    .eq('forum_id', forumId)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform the data to include message_count
  const topics = data?.map((topic: any) => ({
    ...topic,
    message_count: topic.messages?.[0]?.count || 0,
    messages: undefined, // Remove the nested messages array
  }));

  return topics as unknown as Topic[];
}

export async function getTopicBySlug(slug: string) {
  const { data, error } = await supabase
    .from('topics')
    .select(`
      *,
      author:user_profiles(*),
      messages(count)
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Topic not found');

  // Transform to include message_count
  const topicData = data as any;
  const topic = {
    ...topicData,
    message_count: topicData.messages?.[0]?.count || 0,
    messages: undefined,
  };

  return topic as unknown as Topic;
}

export async function createTopic(
  forumId: string,
  userId: string,
  title: string,
  description?: string,
  eraTags?: EraTag[]
) {
  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const { data, error } = await supabase
    .from('topics')
    .insert({
      forum_id: forumId,
      user_id: userId,
      title,
      slug,
      description,
      era_tags: eraTags && eraTags.length > 0 ? eraTags : null,
      pinned: false,
      locked: false,
    })
    .select(`
      *,
      author:user_profiles(*)
    `)
    .single();

  if (error) throw error;
  return data as unknown as Topic;
}
