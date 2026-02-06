-- Music24 Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User Profiles Table
create table user_profiles (
  id uuid default uuid_generate_v4() primary key,
  clerk_id text unique not null,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  favorite_era text check (favorite_era in ('80s', '90s', '00s')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Forums Table
create table forums (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  slug text unique not null,
  icon text,
  era text check (era in ('80s', '90s', '00s', 'all')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Topics Table
create table topics (
  id uuid default uuid_generate_v4() primary key,
  forum_id uuid references forums(id) on delete cascade,
  user_id text not null,
  title text not null,
  slug text not null,
  description text,
  era_tags text[] check (era_tags <@ array['80s', '90s', '00s']),
  pinned boolean default false,
  locked boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Sub-Topics Table
create table sub_topics (
  id uuid default uuid_generate_v4() primary key,
  topic_id uuid references topics(id) on delete cascade,
  user_id text not null,
  title text not null,
  slug text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Messages Table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  topic_id uuid references topics(id) on delete cascade,
  sub_topic_id uuid references sub_topics(id) on delete cascade,
  user_id text not null,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index idx_topics_forum_id on topics(forum_id);
create index idx_sub_topics_topic_id on sub_topics(topic_id);
create index idx_messages_topic_id on messages(topic_id);
create index idx_messages_sub_topic_id on messages(sub_topic_id);
create index idx_messages_created_at on messages(created_at);

-- Enable Row Level Security (RLS)
alter table user_profiles enable row level security;
alter table forums enable row level security;
alter table topics enable row level security;
alter table sub_topics enable row level security;
alter table messages enable row level security;

-- RLS Policies (Public read, authenticated write)
create policy "Public can view forums" on forums for select using (true);
create policy "Public can view topics" on topics for select using (true);
create policy "Public can view sub_topics" on sub_topics for select using (true);
create policy "Public can view messages" on messages for select using (true);

create policy "Authenticated users can create topics" on topics for insert with check (true);
create policy "Authenticated users can create sub_topics" on sub_topics for insert with check (true);
create policy "Authenticated users can create messages" on messages for insert with check (true);

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

-- Sample Data
insert into forums (name, description, slug, icon, era) values
  ('90s Golden Era', 'Discuss the golden age of hip hop - Wu-Tang, Nas, Biggie, Tupac and more', '90s-golden-era', '🎤', '90s'),
  ('R&B Classics', 'Smooth sounds from SWV, Jodeci, Boyz II Men, TLC, and more', 'rnb-classics', '🎵', 'all'),
  ('80s Hip Hop', 'Old school hip hop from Run-DMC, LL Cool J, Public Enemy, and the pioneers', '80s-hip-hop', '📻', '80s'),
  ('00s Bangers', 'Early 2000s hits from 50 Cent, Nelly, Usher, Beyoncé and more', '00s-bangers', '🔥', '00s'),
  ('Underground Gems', 'Deep cuts and underground classics that deserve more love', 'underground-gems', '💎', 'all');
