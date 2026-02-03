// Supabase Database Types
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          clerk_id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          favorite_era: '80s' | '90s' | '00s' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          favorite_era?: '80s' | '90s' | '00s' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_id?: string;
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          favorite_era?: '80s' | '90s' | '00s' | null;
          updated_at?: string;
        };
      };
      forums: {
        Row: {
          id: string;
          name: string;
          description: string;
          slug: string;
          icon: string | null;
          era: '80s' | '90s' | '00s' | 'all' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          slug: string;
          icon?: string | null;
          era?: '80s' | '90s' | '00s' | 'all' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          slug?: string;
          icon?: string | null;
          era?: '80s' | '90s' | '00s' | 'all' | null;
          updated_at?: string;
        };
      };
      topics: {
        Row: {
          id: string;
          forum_id: string;
          user_id: string;
          title: string;
          slug: string;
          description: string | null;
          pinned: boolean;
          locked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          forum_id: string;
          user_id: string;
          title: string;
          slug: string;
          description?: string | null;
          pinned?: boolean;
          locked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          pinned?: boolean;
          locked?: boolean;
          updated_at?: string;
        };
      };
      sub_topics: {
        Row: {
          id: string;
          topic_id: string;
          user_id: string;
          title: string;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          user_id: string;
          title: string;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sub_topic_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sub_topic_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          updated_at?: string;
        };
      };
    };
  };
};
