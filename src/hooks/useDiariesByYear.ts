import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { mapDiariesToDateMap } from '@/lib/supabase/mappers';
import { Diary } from '@/types/database';

interface DiaryMap {
  [date: string]: Diary;
}

const fetchDiariesByYear = async (year: number): Promise<DiaryMap> => {
  const supabase = createClient();

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const { data, error } = await supabase
    .from('diaries')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    throw error;
  }

  return mapDiariesToDateMap(data ?? []);
};

export const useDiariesByYear = (year: number) => {
  const query = useQuery({
    queryKey: ['diaries', 'year', year],
    queryFn: () => fetchDiariesByYear(year),
    staleTime: 1000 * 60 * 5,
  });

  const getDiaryByDate = (date: Date): Diary | undefined => {
    const dateString = date.toISOString().split('T')[0];
    return query.data?.[dateString];
  };

  const hasDiary = (date: Date): boolean => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return !!query.data?.[dateString];
  };

  const filledCount = Object.keys(query.data || {}).length;

  return {
    diaries: query.data || {},
    isLoading: query.isLoading,
    error: query.error,
    getDiaryByDate,
    hasDiary,
    filledCount,
    totalDays: 365,
  };
};
