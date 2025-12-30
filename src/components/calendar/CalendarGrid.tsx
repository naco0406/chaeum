'use client';

import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDay } from '@/components/calendar/CalendarDay';
import { CalendarDay as CalendarDayType } from '@/hooks/useCalendar';
import { Skeleton } from '@/components/ui/skeleton';
import { getColorByIndex } from '@/lib/color-utils';
import { Diary } from '@/types/database';

interface CalendarGridProps {
  days: CalendarDayType[];
  diaries: { [date: string]: Diary };
  isLoading: boolean;
  direction: number;
  monthKey: string;
  contrastColor?: string;
}

export const CalendarGrid: FC<CalendarGridProps> = ({
  days,
  diaries,
  isLoading,
  direction,
  monthKey,
  contrastColor,
}) => {
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 42 }).map((_, index) => (
          <div key={index} className="aspect-square p-1">
            <Skeleton
              className="w-full h-full rounded-lg"
              style={{
                backgroundColor: contrastColor ? `${contrastColor}10` : undefined,
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={monthKey}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="grid grid-cols-7 gap-1"
        >
          {days.map((day) => {
            const color = getColorByIndex(day.dayOfYear);
            const dateKey = day.date.toISOString().split('T')[0];
            const diary = diaries[dateKey];

            return (
              <CalendarDay
                key={day.date.toISOString()}
                day={day}
                color={color}
                diary={diary}
                contrastColor={contrastColor}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
