import { supabase } from '@/lib/supabase';
import { MessageVoteInfo, EraBadge, EraTag, EraBadgeName } from '@/types';

// Upvote a message (one-way — cannot be removed)
export async function upvoteMessage(messageId: string, userId: string): Promise<{ voted: boolean }> {
  const { error } = await supabase
    .from('message_votes')
    .insert({ message_id: messageId, user_id: userId });

  // Unique constraint violation means already voted — not an error
  if (error && error.code === '23505') {
    return { voted: false };
  }
  if (error) throw error;
  return { voted: true };
}

// Batch fetch vote counts for a list of messages
export async function getVoteCountsForMessages(
  messageIds: string[],
  currentUserId?: string
): Promise<Record<string, MessageVoteInfo>> {
  if (messageIds.length === 0) return {};

  const { data, error } = await supabase.rpc('get_vote_counts_for_messages', {
    p_message_ids: messageIds,
    p_current_user_id: currentUserId,
  });

  if (error) throw error;

  const result: Record<string, MessageVoteInfo> = {};
  for (const id of messageIds) {
    result[id] = { vote_count: 0, has_voted: false };
  }
  for (const row of data || []) {
    result[row.message_id] = {
      vote_count: row.vote_count,
      has_voted: row.has_voted,
    };
  }
  return result;
}

// Fetch era badges for a list of user IDs
export async function getUserEraBadges(
  userIds: string[]
): Promise<Record<string, EraBadge[]>> {
  if (userIds.length === 0) return {};

  const { data, error } = await supabase.rpc('get_user_era_badges', {
    p_user_ids: userIds,
  });

  if (error) throw error;

  // Group raw badges by user
  const raw: Record<string, EraBadge[]> = {};
  for (const row of data || []) {
    if (!raw[row.user_id]) {
      raw[row.user_id] = [];
    }
    raw[row.user_id].push({
      era: row.era as EraTag,
      vote_count: row.vote_count,
      badge_name: row.badge_name as EraBadgeName,
    });
  }

  // Filter Newcomer badges:
  // - If any non-Newcomer badge exists, remove all Newcomer entries
  // - If all badges are Newcomer, keep only one
  const result: Record<string, EraBadge[]> = {};
  for (const [userId, badges] of Object.entries(raw)) {
    const nonNewcomer = badges.filter(b => b.badge_name !== 'Newcomer');
    if (nonNewcomer.length > 0) {
      result[userId] = nonNewcomer;
    } else {
      result[userId] = [badges[0]];
    }
  }
  return result;
}
