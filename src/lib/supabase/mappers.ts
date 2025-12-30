import { Diary } from '@/types/database';
import { Database } from '@/types/supabase';

// Supabase Row 타입 추출
type DiaryRow = Database['public']['Tables']['diaries']['Row'];

/**
 * Supabase의 snake_case 데이터를 프론트엔드의 camelCase로 변환
 * 타입 안전한 매퍼 함수
 */
export const mapDiaryFromDB = (row: DiaryRow): Diary => ({
  id: row.id,
  userId: row.user_id,
  date: row.date,
  dayOfYear: row.day_of_year,
  content: row.content,
  mood: row.mood,
  colorIndex: row.color_index,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * 여러 일기를 한 번에 변환
 */
export const mapDiariesFromDB = (rows: DiaryRow[]): Diary[] => {
  return rows.map(mapDiaryFromDB);
};

/**
 * 날짜를 키로 하는 일기 맵 생성
 */
export const mapDiariesToDateMap = (rows: DiaryRow[]): Record<string, Diary> => {
  const map: Record<string, Diary> = {};
  rows.forEach((row) => {
    map[row.date] = mapDiaryFromDB(row);
  });
  return map;
};
