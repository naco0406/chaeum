'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { startOfDay, parseISO, differenceInDays } from 'date-fns';

interface UserStats {
  totalDiaries: number;
  currentStreak: number;
  longestStreak: number;
  mostFrequentDay: string | null;
  mostFrequentMonth: string | null;
  joinedDaysAgo: number;
}

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_NAMES = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

const calculateStreak = (dates: string[]): { current: number; longest: number } => {
  if (dates.length === 0) {
    return { current: 0, longest: 0 };
  }

  const sortedDates = [...dates]
    .map((d) => startOfDay(parseISO(d)))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = startOfDay(new Date());
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  // Calculate current streak
  const daysSinceLastEntry = differenceInDays(today, sortedDates[0]);
  if (daysSinceLastEntry <= 1) {
    currentStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = differenceInDays(sortedDates[i - 1], sortedDates[i]);
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = differenceInDays(sortedDates[i - 1], sortedDates[i]);
    if (diff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { current: currentStreak, longest: longestStreak };
};

const getMostFrequent = (items: number[], names: string[]): string | null => {
  if (items.length === 0) return null;

  const counts: Record<number, number> = {};
  items.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(counts));
  const mostFrequent = Object.entries(counts).find(
    ([, count]) => count === maxCount
  );

  if (mostFrequent) {
    return names[Number(mostFrequent[0])];
  }
  return null;
};

export const useUserStats = () => {
  const { user } = useAuth();
  const supabase = createClient();

  return useQuery<UserStats>({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: diaries, error } = await supabase
        .from('diaries')
        .select('date, created_at')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      const dates = diaries?.map((d) => d.date) || [];
      const { current, longest } = calculateStreak(dates);

      // Get day of week distribution
      const dayOfWeekDistribution = dates.map((date) => parseISO(date).getDay());
      const mostFrequentDay = getMostFrequent(dayOfWeekDistribution, DAY_NAMES);

      // Get month distribution
      const monthDistribution = dates.map((date) => parseISO(date).getMonth());
      const mostFrequentMonth = getMostFrequent(monthDistribution, MONTH_NAMES);

      // Calculate days since joining
      const joinedDaysAgo = user.created_at
        ? differenceInDays(new Date(), parseISO(user.created_at))
        : 0;

      return {
        totalDiaries: dates.length,
        currentStreak: current,
        longestStreak: longest,
        mostFrequentDay,
        mostFrequentMonth,
        joinedDaysAgo,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
