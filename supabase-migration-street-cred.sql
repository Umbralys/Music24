-- Street Cred Migration (Full)
-- Run this in your Supabase SQL Editor

-- Message Votes Table (Street Cred - upvote only)
create table message_votes (
  id uuid default uuid_generate_v4() primary key,
  message_id uuid references messages(id) on delete cascade not null,
  user_id text not null,
  created_at timestamp with time zone default now()
);

-- One vote per user per message
create unique index idx_message_votes_unique on message_votes(message_id, user_id);
create index idx_message_votes_message_id on message_votes(message_id);
create index idx_message_votes_user_id on message_votes(user_id);

-- Enable RLS
alter table message_votes enable row level security;

-- RLS Policies
create policy "Public can view votes" on message_votes for select using (true);
create policy "Authenticated users can vote" on message_votes for insert with check (true);
create policy "Users can remove their own vote" on message_votes for delete using (true);

-- RPC: Batch fetch vote counts + current user's vote status for messages
create or replace function get_vote_counts_for_messages(
  p_message_ids uuid[],
  p_current_user_id text default null
)
returns table (
  message_id uuid,
  vote_count bigint,
  has_voted boolean
)
language sql
stable
as $$
  select
    mv.message_id,
    count(*)::bigint as vote_count,
    coalesce(bool_or(mv.user_id = p_current_user_id), false) as has_voted
  from message_votes mv
  where mv.message_id = any(p_message_ids)
  group by mv.message_id;
$$;

-- RPC: Get per-era badges for a list of users
-- Joins votes -> messages -> topics to compute era-specific vote totals
-- Handles both topic-level messages and sub-topic messages
create or replace function get_user_era_badges(p_user_ids text[])
returns table (
  user_id text,
  era text,
  vote_count bigint,
  badge_name text
)
language sql
stable
as $$
  with user_era_votes as (
    -- Topic-level messages
    select
      m.user_id::text as user_id,
      unnest(t.era_tags) as era,
      count(mv.id) as vote_count
    from messages m
    join message_votes mv on mv.message_id = m.id
    join topics t on t.id = m.topic_id
    where m.user_id::text = any(p_user_ids)
      and m.topic_id is not null
      and t.era_tags is not null
    group by m.user_id, unnest(t.era_tags)

    union all

    -- Sub-topic messages
    select
      m.user_id::text as user_id,
      unnest(t.era_tags) as era,
      count(mv.id) as vote_count
    from messages m
    join message_votes mv on mv.message_id = m.id
    join sub_topics st on st.id = m.sub_topic_id
    join topics t on t.id = st.topic_id
    where m.user_id::text = any(p_user_ids)
      and m.sub_topic_id is not null
      and t.era_tags is not null
    group by m.user_id, unnest(t.era_tags)
  ),
  aggregated as (
    select
      uev.user_id,
      uev.era,
      sum(uev.vote_count)::bigint as total_votes
    from user_era_votes uev
    group by uev.user_id, uev.era
  )
  select
    a.user_id,
    a.era,
    a.total_votes as vote_count,
    case
      when a.total_votes <= 10 then 'Newcomer'
      when a.era = '80s' and a.total_votes between 11 and 50 then 'Beat Boxer'
      when a.era = '80s' and a.total_votes between 51 and 200 then 'Mixtape DJ'
      when a.era = '80s' and a.total_votes > 200 then 'Microphone Fiend'
      when a.era = '90s' and a.total_votes between 11 and 50 then 'Freestyler'
      when a.era = '90s' and a.total_votes between 51 and 200 then 'Rapper'
      when a.era = '90s' and a.total_votes > 200 then 'Multi-Platinum Artist'
      when a.era = '00s' and a.total_votes between 11 and 50 then 'CD Burner'
      when a.era = '00s' and a.total_votes between 51 and 200 then 'Out The Trunk'
      when a.era = '00s' and a.total_votes > 200 then 'CEO'
      else 'Newcomer'
    end as badge_name
  from aggregated a;
$$;
