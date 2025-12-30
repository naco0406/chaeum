'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Flame, Calendar, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStats } from '@/hooks/useUserStats';

interface UserStatsProps {
  contrastColor?: string;
}

interface StatItemProps {
  icon: FC<{ className?: string }>;
  label: string;
  value: string | number;
  index: number;
  contrastColor?: string;
}

const StatItem: FC<StatItemProps> = ({
  icon: Icon,
  label,
  value,
  index,
  contrastColor,
}) => {
  const textColor = contrastColor || 'currentColor';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
      className="flex flex-col items-center p-4 rounded-2xl transition-colors"
      style={{
        backgroundColor: contrastColor ? `${contrastColor}08` : 'var(--secondary-30)',
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
        style={{ backgroundColor: contrastColor ? `${contrastColor}15` : undefined }}
      >
        <span style={{ color: textColor, opacity: 0.8 }}>
          <Icon className="w-5 h-5" />
        </span>
      </div>
      <p className="text-2xl font-serif" style={{ color: textColor }}>
        {value}
      </p>
      <p
        className="text-xs mt-1"
        style={{ color: textColor, opacity: 0.6 }}
      >
        {label}
      </p>
    </motion.div>
  );
};

const StatsSkeleton: FC<{ contrastColor?: string }> = ({ contrastColor }) => {
  return (
    <div
      className="rounded-3xl backdrop-blur-md p-5"
      style={{
        backgroundColor: contrastColor ? `${contrastColor}08` : 'var(--glass-strong)',
        border: contrastColor
          ? `1px solid ${contrastColor}15`
          : '1px solid var(--border-30)',
      }}
    >
      <Skeleton
        className="w-24 h-5 mb-4 mx-auto"
        style={{ backgroundColor: contrastColor ? `${contrastColor}15` : undefined }}
      />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center p-4 rounded-2xl"
            style={{ backgroundColor: contrastColor ? `${contrastColor}08` : 'var(--secondary-30)' }}
          >
            <Skeleton
              className="w-10 h-10 rounded-full mb-2"
              style={{ backgroundColor: contrastColor ? `${contrastColor}15` : undefined }}
            />
            <Skeleton
              className="w-12 h-7 mb-1"
              style={{ backgroundColor: contrastColor ? `${contrastColor}15` : undefined }}
            />
            <Skeleton
              className="w-16 h-3"
              style={{ backgroundColor: contrastColor ? `${contrastColor}15` : undefined }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const UserStats: FC<UserStatsProps> = ({ contrastColor }) => {
  const { data: stats, isLoading } = useUserStats();
  const textColor = contrastColor || 'currentColor';

  if (isLoading) {
    return <StatsSkeleton contrastColor={contrastColor} />;
  }

  if (!stats) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl backdrop-blur-md p-5"
      style={{
        backgroundColor: contrastColor ? `${contrastColor}08` : 'var(--glass-strong)',
        border: contrastColor
          ? `1px solid ${contrastColor}15`
          : '1px solid var(--border-30)',
      }}
    >
      <h3
        className="text-base font-serif mb-4 text-center"
        style={{ color: textColor }}
      >
        나의 기록
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <StatItem
          icon={BookOpen}
          label="총 일기"
          value={`${stats.totalDiaries}개`}
          index={0}
          contrastColor={contrastColor}
        />
        <StatItem
          icon={Flame}
          label="연속 작성"
          value={`${stats.currentStreak}일`}
          index={1}
          contrastColor={contrastColor}
        />
        <StatItem
          icon={TrendingUp}
          label="최장 연속"
          value={`${stats.longestStreak}일`}
          index={2}
          contrastColor={contrastColor}
        />
        <StatItem
          icon={Calendar}
          label="자주 쓰는 날"
          value={stats.mostFrequentDay || '-'}
          index={3}
          contrastColor={contrastColor}
        />
      </div>
    </motion.div>
  );
};
