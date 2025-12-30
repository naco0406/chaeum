import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
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

  return {
    id: data.id,
    userId: data.user_id,
    date: data.date,
    dayOfYear: data.day_of_year,
    content: data.content,
    mood: data.mood,
    colorIndex: data.color_index,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
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
