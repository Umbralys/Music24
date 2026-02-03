import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify the webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Webhook verification failed', { status: 400 });
  }

  // Handle the event
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, username, first_name, last_name, image_url, email_addresses } = evt.data;

    // Generate username from email if not provided
    const finalUsername = username || email_addresses?.[0]?.email_address?.split('@')[0] || `user_${id.slice(-8)}`;
    const displayName = [first_name, last_name].filter(Boolean).join(' ') || undefined;

    const { error } = await supabaseAdmin
      .from('user_profiles')
      .upsert(
        {
          clerk_id: id,
          username: finalUsername,
          display_name: displayName,
          avatar_url: image_url,
        },
        { onConflict: 'clerk_id' }
      );

    if (error) {
      console.error('Failed to upsert user profile:', error);
      return new Response('Failed to sync user', { status: 500 });
    }

    console.log(`User profile synced: ${id}`);
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    if (id) {
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .delete()
        .eq('clerk_id', id);

      if (error) {
        console.error('Failed to delete user profile:', error);
        return new Response('Failed to delete user', { status: 500 });
      }

      console.log(`User profile deleted: ${id}`);
    }
  }

  return new Response('Webhook processed', { status: 200 });
}
