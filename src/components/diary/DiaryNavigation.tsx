'use client';

import { FC } from 'react';
import Link from 'next/link';
import { format, addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DiaryNavigationProps {
  currentDate: Date;
  hasPrevDiary?: boolean;
  hasNextDiary?: boolean;
  contrastColor?: string;
}

export const DiaryNavigation: FC<DiaryNavigationProps> = ({
  currentDate,
  hasPrevDiary = true,
  hasNextDiary = true,
  contrastColor,
}) => {
  const prevDate = subDays(currentDate, 1);
  const nextDate = addDays(currentDate, 1);
  const currentYear = new Date().getFullYear();
  const yearStart = new Date(currentYear, 0, 1);
  const yearEnd = new Date(currentYear, 11, 31);

  // 같은 연도 내에서만 네비게이션 허용
  const isPrevDisabled = !hasPrevDiary || prevDate < yearStart;
  const isNextDisabled = !hasNextDiary || nextDate > yearEnd;

  const prevDateString = format(prevDate, 'yyyy-MM-dd');
  const nextDateString = format(nextDate, 'yyyy-MM-dd');
  const textColor = contrastColor || 'currentColor';

  return (
    <div className="flex items-center justify-between py-4">
      {isPrevDisabled ? (
        <div className="w-24" />
      ) : (
        <Link href={`/diary/${prevDateString}`}>
          <motion.button
            className="flex items-center gap-1 px-3 py-2 rounded-xl"
            style={{
              backgroundColor: contrastColor ? `${contrastColor}10` : undefined,
              color: textColor,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">
              {format(prevDate, 'M/d', { locale: ko })}
            </span>
          </motion.button>
        </Link>
      )}

      <Link href="/records">
        <motion.button
          className="px-4 py-2 rounded-xl text-sm font-medium"
          style={{
            backgroundColor: contrastColor ? `${contrastColor}15` : undefined,
            color: textColor,
            border: contrastColor
              ? `1px solid ${contrastColor}25`
              : '1px solid var(--border)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          기록
        </motion.button>
      </Link>

      {isNextDisabled ? (
        <div className="w-24" />
      ) : (
        <Link href={`/diary/${nextDateString}`}>
          <motion.button
            className="flex items-center gap-1 px-3 py-2 rounded-xl"
            style={{
              backgroundColor: contrastColor ? `${contrastColor}10` : undefined,
              color: textColor,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm">
              {format(nextDate, 'M/d', { locale: ko })}
            </span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </Link>
      )}
    </div>
  );
};
