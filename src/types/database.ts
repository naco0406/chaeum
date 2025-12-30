import { DailyColor } from '@/types/color';

export type DiaryMood =
  | 'happy'
  | 'peaceful'
  | 'sad'
  | 'angry'
  | 'anxious'
  | 'grateful'
  | 'tired'
  | 'excited';

export interface User {
  id: string;
  email: string;
  nickname: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface Diary {
  id: string;
  userId: string;
  date: string;
  dayOfYear: number;
  content: string;
  mood: DiaryMood | null;
  colorIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryWithColor extends Diary {
  color: DailyColor;
}
