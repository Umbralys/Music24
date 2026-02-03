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

-- Sample Data
insert into forums (name, description, slug, icon, era) values
  ('90s Golden Era', 'Discuss the golden age of hip hop - Wu-Tang, Nas, Biggie, Tupac and more', '90s-golden-era', '🎤', '90s'),
  ('R&B Classics', 'Smooth sounds from SWV, Jodeci, Boyz II Men, TLC, and more', 'rnb-classics', '🎵', 'all'),
  ('80s Hip Hop', 'Old school hip hop from Run-DMC, LL Cool J, Public Enemy, and the pioneers', '80s-hip-hop', '📻', '80s'),
  ('00s Bangers', 'Early 2000s hits from 50 Cent, Nelly, Usher, Beyoncé and more', '00s-bangers', '🔥', '00s'),
  ('Underground Gems', 'Deep cuts and underground classics that deserve more love', 'underground-gems', '💎', 'all');
