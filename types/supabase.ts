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
        Relationships: [];
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
        Relationships: [];
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
          era_tags: ('80s' | '90s' | '00s')[] | null;
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
          era_tags?: ('80s' | '90s' | '00s')[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          pinned?: boolean;
          locked?: boolean;
          era_tags?: ('80s' | '90s' | '00s')[] | null;
          updated_at?: string;
        };
        Relationships: [];
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
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          topic_id: string | null;
          sub_topic_id: string | null;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          topic_id?: string | null;
          sub_topic_id?: string | null;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          topic_id?: string | null;
          sub_topic_id?: string | null;
          content?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      message_votes: {
        Row: {
          id: string;
          message_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          message_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_vote_counts_for_messages: {
        Args: {
          p_message_ids: string[];
          p_current_user_id?: string;
        };
        Returns: {
          message_id: string;
          vote_count: number;
          has_voted: boolean;
        }[];
      };
      get_user_era_badges: {
        Args: {
          p_user_ids: string[];
        };
        Returns: {
          user_id: string;
          era: string;
          vote_count: number;
          badge_name: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
