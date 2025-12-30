'use client';

import { FC } from 'react';
import Link from 'next/link';
import { format, addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiaryNavigationProps {
  currentDate: Date;
  hasPrevDiary?: boolean;
  hasNextDiary?: boolean;
}

export const DiaryNavigation: FC<DiaryNavigationProps> = ({
  currentDate,
  hasPrevDiary = true,
  hasNextDiary = true,
}) => {
  const prevDate = subDays(currentDate, 1);
  const nextDate = addDays(currentDate, 1);
  const today = new Date();

  const isPrevDisabled = !hasPrevDiary;
  const isNextDisabled = !hasNextDiary || nextDate > today;

  const prevDateString = format(prevDate, 'yyyy-MM-dd');
  const nextDateString = format(nextDate, 'yyyy-MM-dd');

  return (
    <div className="flex items-center justify-between py-4">
      {isPrevDisabled ? (
        <div className="w-24" />
      ) : (
        <Link href={`/diary/${prevDateString}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">
              {format(prevDate, 'M/d', { locale: ko })}
            </span>
          </Button>
        </Link>
      )}

      <Link href="/calendar">
        <Button variant="outline" size="sm">
          캘린더
        </Button>
      </Link>

      {isNextDisabled ? (
        <div className="w-24" />
      ) : (
        <Link href={`/diary/${nextDateString}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <span className="text-sm">
              {format(nextDate, 'M/d', { locale: ko })}
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      )}
    </div>
  );
};
