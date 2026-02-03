import { supabase } from '@/lib/supabase';
import { Forum } from '@/types';

export async function getForums() {
  // Get forums with topic counts
  const { data, error } = await supabase
    .from('forums')
    .select(`
      *,
      topics(count)
    `)
    .order('name', { ascending: true });

  if (error) throw error;

  // Get post counts per forum by joining messages through topics
  const forumsWithCounts = await Promise.all(
    (data || []).map(async (forum: any) => {
      // Get all topic IDs for this forum
      const { data: topics } = await supabase
        .from('topics')
        .select('id')
        .eq('forum_id', forum.id);

      let postCount = 0;
      if (topics && topics.length > 0) {
        const topicIds = topics.map((t: any) => t.id);
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .in('topic_id', topicIds);
        postCount = count || 0;
      }

      return {
        ...forum,
        topic_count: forum.topics?.[0]?.count || 0,
        post_count: postCount,
        topics: undefined,
      };
    })
  );

  return forumsWithCounts as Forum[];
}

export async function getForumBySlug(slug: string) {
  const { data, error } = await supabase
    .from('forums')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as Forum;
}

export async function createForum(
  name: string,
  description: string,
  icon?: string,
  era?: '80s' | '90s' | '00s' | 'all'
) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const { data, error } = await supabase
    .from('forums')
    .insert({ name, description, slug, icon, era })
    .select()
    .single();

  if (error) throw error;
  return data as Forum;
}

export async function deleteForum(id: string) {
  const { error } = await supabase
    .from('forums')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
