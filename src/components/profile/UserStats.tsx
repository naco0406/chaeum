'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Flame, Calendar, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStats } from '@/hooks/useUserStats';

interface StatItemProps {
  icon: FC<{ className?: string }>;
  label: string;
  value: string | number;
  color?: string;
  index: number;
}

const StatItem: FC<StatItemProps> = ({
  icon: Icon,
  label,
  value,
  color,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
      className="flex flex-col items-center p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
        style={{ backgroundColor: color ? `${color}20` : undefined }}
      >
        <Icon
          className="w-5 h-5"
          style={{ color: color || 'var(--primary)' }}
        />
      </div>
      <p className="text-2xl font-serif text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
};

const StatsSkeleton: FC = () => {
  return (
    <div className="rounded-3xl glass-strong border border-border/30 p-5 shadow-soft">
      <Skeleton className="w-24 h-5 mb-4" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center p-4 rounded-2xl bg-secondary/30"
          >
            <Skeleton className="w-10 h-10 rounded-full mb-2" />
            <Skeleton className="w-12 h-7 mb-1" />
            <Skeleton className="w-16 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const UserStats: FC = () => {
  const { data: stats, isLoading } = useUserStats();

  if (isLoading) {
    return <StatsSkeleton />;
  }

  if (!stats) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl glass-strong border border-border/30 p-5 shadow-soft"
    >
      <h3 className="text-base font-serif mb-4 text-center">나의 기록</h3>
      <div className="grid grid-cols-2 gap-3">
        <StatItem
          icon={BookOpen}
          label="총 일기"
          value={`${stats.totalDiaries}개`}
          color="oklch(0.70 0.08 230)"
          index={0}
        />
        <StatItem
          icon={Flame}
          label="연속 작성"
          value={`${stats.currentStreak}일`}
          color="oklch(0.55 0.18 25)"
          index={1}
        />
        <StatItem
          icon={TrendingUp}
          label="최장 연속"
          value={`${stats.longestStreak}일`}
          color="oklch(0.75 0.12 145)"
          index={2}
        />
        <StatItem
          icon={Calendar}
          label="자주 쓰는 날"
          value={stats.mostFrequentDay || '-'}
          color="oklch(0.50 0.12 280)"
          index={3}
        />
      </div>
    </motion.div>
  );
};
