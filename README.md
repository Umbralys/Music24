# Music24 - Hip Hop & R&B Lounge

A modern, mobile-first community platform for hip hop and R&B enthusiasts who grew up in the 80s, 90s, and 00s. Built with Next.js, featuring old-school forum-style discussions in a nostalgic aesthetic.

## Features

- **Forum-Based Structure**: Forums → Topics → Sub-topics → Chats
- **Real-Time Messaging**: Live chat functionality powered by Supabase
- **Authentication**: Secure user authentication via Clerk
- **Mobile-First Design**: Responsive layout optimized for mobile devices
- **Nostalgic Aesthetic**: 90s hip hop-inspired design with modern UX

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Real-Time**: Supabase Realtime

## Project Structure

The project follows a strict **Separation of Concerns (SoC)** architecture using the **Orchestrator/View pattern**:

```
Music24/
├── app/                        # Next.js App Router pages
│   ├── forums/                 # Forum routes
│   ├── sign-in/                # Clerk sign-in
│   └── sign-up/                # Clerk sign-up
├── features/                   # Feature-based modules
│   ├── auth/
│   │   ├── orchestrators/      # Smart components (logic, state, hooks)
│   │   └── ui/                 # Dumb components (presentation only)
│   ├── forums/
│   │   ├── orchestrators/
│   │   └── ui/
│   ├── topics/
│   │   ├── orchestrators/
│   │   └── ui/
│   ├── chat/
│   │   ├── orchestrators/
│   │   └── ui/
│   └── layout/
│       └── ui/
├── lib/                        # Shared utilities
│   └── supabase.ts            # Supabase client
├── services/                   # API calls and data fetching
│   ├── forums.ts
│   ├── topics.ts
│   └── messages.ts
├── types/                      # TypeScript types and interfaces
│   ├── index.ts
│   └── supabase.ts
└── middleware.ts               # Clerk middleware

```

### Architecture Patterns

#### 1. Orchestrator/View Pattern (Smart vs Dumb)

- **Orchestrators (Smart Components)**: Handle logic, state, hooks, effects, and data fetching. They render UI components by passing data via props.
- **UI Components (Dumb/Presentational)**: Pure functional components that receive data and event handlers as props. Zero business logic or API calls.

#### 2. Feature-Based Organization

Code is grouped by domain/feature rather than technical concerns, making it easier to understand and maintain related functionality.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Clerk account ([clerk.com](https://clerk.com))
- A Supabase account ([supabase.com](https://supabase.com))

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Clerk Authentication

1. Create a new application at [clerk.com](https://clerk.com)
2. Copy your API keys from the Clerk dashboard
3. Create a `.env` file based on `.env.example`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 3. Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the following SQL in the Supabase SQL Editor to create tables:

```sql
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
  sub_topic_id uuid references sub_topics(id) on delete cascade,
  user_id text not null,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index idx_topics_forum_id on topics(forum_id);
create index idx_sub_topics_topic_id on sub_topics(topic_id);
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
```

3. Insert sample data:

```sql
-- Sample Forums
insert into forums (name, description, slug, icon, era) values
  ('90s Golden Era', 'Discuss the golden age of hip hop', '90s-golden-era', '🎤', '90s'),
  ('R&B Classics', 'Smooth sounds from the past', 'rnb-classics', '🎵', 'all'),
  ('80s Hip Hop', 'Old school hip hop from the 80s', '80s-hip-hop', '📻', '80s'),
  ('00s Bangers', 'Early 2000s hits', '00s-bangers', '🔥', '00s');
```

4. Copy your Supabase credentials to `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Development

### Running Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Features

When adding features, follow the Orchestrator/View pattern:

1. Create a feature folder in `features/`
2. Add `orchestrators/` for smart components
3. Add `ui/` for presentational components
4. Create service functions in `services/` for API calls
5. Define types in `types/`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT

---

Built with ❤️ for the hip hop and R&B community
