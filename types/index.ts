// User & Profile Types
export interface UserProfile {
  id: string;
  clerk_id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  favorite_era?: '80s' | '90s' | '00s';
  created_at: string;
  updated_at: string;
}

// Forum Types
export interface Forum {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon?: string;
  era?: '80s' | '90s' | '00s' | 'all';
  created_at: string;
  updated_at: string;
  topic_count?: number;
  post_count?: number;
}

// Era Tag Type
export type EraTag = '80s' | '90s' | '00s';

// Topic Types
export interface Topic {
  id: string;
  forum_id: string;
  user_id: string;
  title: string;
  slug: string;
  description?: string;
  era_tags?: EraTag[];
  pinned: boolean;
  locked: boolean;
  created_at: string;
  updated_at: string;
  sub_topic_count?: number;
  message_count?: number;
  last_message_at?: string;
  author?: UserProfile;
}

// Sub-Topic Types
export interface SubTopic {
  id: string;
  topic_id: string;
  user_id: string;
  title: string;
  slug: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
  last_message_at?: string;
  author?: UserProfile;
}

// Message/Chat Types (Posts)
export interface Message {
  id: string;
  topic_id?: string;
  sub_topic_id?: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: UserProfile;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
