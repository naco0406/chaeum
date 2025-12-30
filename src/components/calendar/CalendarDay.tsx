'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarDay as CalendarDayType } from '@/hooks/useCalendar';
import { DailyColor } from '@/types/color';
import { Diary } from '@/types/database';

interface CalendarDayProps {
  day: CalendarDayType;
  color: DailyColor;
  diary?: Diary;
}

export const CalendarDay: FC<CalendarDayProps> = ({ day, color, diary }) => {
  const router = useRouter();
  const hasDiary = !!diary;
  const isSunday = day.date.getDay() === 0;
  const isSaturday = day.date.getDay() === 6;

  const handleClick = () => {
    if (!day.isCurrentMonth) return;

    const dateString = format(day.date, 'yyyy-MM-dd');
    if (hasDiary) {
      router.push(`/diary/${dateString}`);
    } else {
      router.push(`/diary/write?date=${dateString}`);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={!day.isCurrentMonth}
      whileHover={day.isCurrentMonth ? { scale: 1.08 } : undefined}
      whileTap={day.isCurrentMonth ? { scale: 0.95 } : undefined}
      className={`
        relative aspect-square flex flex-col items-center justify-center p-1 rounded-xl
        transition-all duration-200
        ${day.isCurrentMonth ? 'cursor-pointer hover:bg-secondary/50' : 'cursor-default opacity-30'}
        ${day.isToday ? 'bg-primary/5' : ''}
      `}
    >
      {/* 날짜 숫자 */}
      <span
        className={`
          text-sm z-10 mb-1 font-medium
          ${day.isToday ? 'text-primary font-bold' : ''}
          ${
            !day.isCurrentMonth
              ? 'text-muted-foreground/40'
              : isSunday
                ? 'text-red-400'
                : isSaturday
                  ? 'text-blue-400'
                  : 'text-foreground'
          }
        `}
      >
        {day.dayOfMonth}
      </span>

      {/* 색상 원 */}
      <div className="relative">
        {hasDiary ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-7 h-7 rounded-full shadow-soft relative overflow-hidden"
            style={{ backgroundColor: color.hex }}
          >
            {/* 하이라이트 */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, white 0%, transparent 50%)',
              }}
            />
          </motion.div>
        ) : (
          <div
            className="w-7 h-7 rounded-full border-2 border-dashed transition-colors"
            style={{ borderColor: `${color.hex}30` }}
          />
        )}

        {/* 일기 있음 마커 */}
        {hasDiary && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background"
          />
        )}
      </div>

      {/* 오늘 표시 */}
      {day.isToday && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-1 rounded-xl border-2 border-primary/30 pointer-events-none"
        />
      )}
    </motion.button>
  );
};
