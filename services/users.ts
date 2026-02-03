import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

// Get user profile by Clerk ID
export async function getUserProfile(clerkId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data as UserProfile | null;
}

// Get or create user profile (auto-creates if doesn't exist)
export async function getOrCreateUserProfile(
  clerkId: string,
  email?: string,
  firstName?: string,
  lastName?: string,
  imageUrl?: string
) {
  // Try to get existing profile
  let profile = await getUserProfile(clerkId);

  if (!profile) {
    // Create new profile
    const username = email?.split('@')[0] || `user_${clerkId.slice(-8)}`;
    const displayName = [firstName, lastName].filter(Boolean).join(' ') || undefined;

    profile = await upsertUserProfile(clerkId, username, displayName, imageUrl);
  }

  return profile;
}

// Create or update user profile
export async function upsertUserProfile(
  clerkId: string,
  username: string,
  displayName?: string,
  avatarUrl?: string
) {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(
      {
        clerk_id: clerkId,
        username,
        display_name: displayName,
        avatar_url: avatarUrl,
      },
      { onConflict: 'clerk_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

// Get user profile by ID
export async function getUserProfileById(id: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as UserProfile;
}
