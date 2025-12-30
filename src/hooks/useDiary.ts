import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { mapDiaryFromDB } from '@/lib/supabase/mappers';
import { Diary } from '@/types/database';

const fetchDiary = async (date: string): Promise<Diary | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('diaries')
    .select('*')
    .eq('date', date)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  if (!data) return null;

  return mapDiaryFromDB(data);
};

export const useDiary = (date: string) => {
  const query = useQuery({
    queryKey: ['diary', date],
    queryFn: () => fetchDiary(date),
    enabled: !!date,
  });

  return {
    diary: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
