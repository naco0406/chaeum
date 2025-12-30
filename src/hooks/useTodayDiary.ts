import { format } from 'date-fns';
import { useDiary } from '@/hooks/useDiary';

export const useTodayDiary = () => {
  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');

  const { diary, isLoading, error, refetch } = useDiary(todayString);

  return {
    diary,
    hasTodayDiary: !!diary,
    isLoading,
    error,
    refetch,
    todayString,
  };
};
