import { DiaryMood } from '@/types/database';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          nickname: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nickname?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nickname?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      diaries: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          day_of_year: number;
          content: string;
          mood: DiaryMood | null;
          color_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          day_of_year: number;
          content: string;
          mood?: DiaryMood | null;
          color_index: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          day_of_year?: number;
          content?: string;
          mood?: DiaryMood | null;
          color_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      diary_mood: DiaryMood;
    };
  };
}
