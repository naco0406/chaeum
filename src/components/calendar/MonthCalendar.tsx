'use client';

import { FC, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarWeekdays } from '@/components/calendar/CalendarWeekdays';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { useCalendar } from '@/hooks/useCalendar';
import { useDiariesByMonth } from '@/hooks/useDiariesByMonth';

export const MonthCalendar: FC = () => {
  const {
    year,
    month,
    monthLabel,
    calendarDays,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
  } = useCalendar();

  const { diaries, isLoading } = useDiariesByMonth(year, month);
  const [direction, setDirection] = useState(0);

  const handlePrevMonth = useCallback(() => {
    setDirection(-1);
    goToPrevMonth();
  }, [goToPrevMonth]);

  const handleNextMonth = useCallback(() => {
    setDirection(1);
    goToNextMonth();
  }, [goToNextMonth]);

  const handleToday = useCallback(() => {
    setDirection(0);
    goToToday();
  }, [goToToday]);

  const monthKey = `${year}-${month}`;

  // 이번 달 통계
  const monthStats = useMemo(() => {
    const diaryCount = Object.keys(diaries).length;
    const daysInMonth = calendarDays.filter((d) => d.isCurrentMonth).length;
    return {
      diaryCount,
      daysInMonth,
      percentage: Math.round((diaryCount / daysInMonth) * 100) || 0,
    };
  }, [diaries, calendarDays]);

  return (
    <div className="min-h-screen px-4 pt-6 pb-8">
      <div className="w-full max-w-[430px] mx-auto space-y-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-1">나의 감정 기록</p>
          <h1 className="text-2xl font-serif">캘린더</h1>
        </motion.div>

        {/* 통계 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="text-center p-4 rounded-2xl glass border border-border/30">
            <p className="text-2xl font-serif text-primary">
              {monthStats.diaryCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">작성한 일기</p>
          </div>
          <div className="text-center p-4 rounded-2xl glass border border-border/30">
            <p className="text-2xl font-serif text-primary">
              {monthStats.daysInMonth}
            </p>
            <p className="text-xs text-muted-foreground mt-1">이번 달 일수</p>
          </div>
          <div className="text-center p-4 rounded-2xl glass border border-border/30">
            <p className="text-2xl font-serif text-primary">
              {monthStats.percentage}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">달성률</p>
          </div>
        </motion.div>

        {/* 캘린더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl glass-strong border border-border/30 p-5 shadow-soft"
        >
          <CalendarHeader
            monthLabel={monthLabel}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
          <CalendarWeekdays />
          <CalendarGrid
            days={calendarDays}
            diaries={diaries}
            isLoading={isLoading}
            direction={direction}
            monthKey={monthKey}
          />
        </motion.div>

        {/* 범례 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-8 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-damcheong to-damcheong/70 shadow-soft" />
            <span>일기 작성</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-dashed border-muted-foreground/30" />
            <span>미작성</span>
          </div>
        </motion.div>

        {/* 동기부여 메시지 */}
        {monthStats.diaryCount === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center text-sm text-muted-foreground"
          >
            이번 달 첫 일기를 시작해보세요 ✨
          </motion.p>
        )}
      </div>
    </div>
  );
};
