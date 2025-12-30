import { useQuery } from '@tanstack/react-query';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { mapDiariesToDateMap } from '@/lib/supabase/mappers';
import { Diary } from '@/types/database';

interface DiaryMap {
  [date: string]: Diary;
}

const fetchDiariesByMonth = async (
  year: number,
  month: number
): Promise<DiaryMap> => {
  const supabase = createClient();

  const monthDate = new Date(year, month - 1, 1);
  const startDate = format(startOfMonth(monthDate), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(monthDate), 'yyyy-MM-dd');

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

export const useDiariesByMonth = (year: number, month: number) => {
  const query = useQuery({
    queryKey: ['diaries', year, month],
    queryFn: () => fetchDiariesByMonth(year, month),
    staleTime: 1000 * 60 * 5,
  });

  const getDiaryByDate = (date: Date): Diary | undefined => {
    const dateString = format(date, 'yyyy-MM-dd');
    return query.data?.[dateString];
  };

  const hasDiary = (date: Date): boolean => {
    const dateString = format(date, 'yyyy-MM-dd');
    return !!query.data?.[dateString];
  };

  return {
    diaries: query.data || {},
    isLoading: query.isLoading,
    error: query.error,
    getDiaryByDate,
    hasDiary,
  };
};
