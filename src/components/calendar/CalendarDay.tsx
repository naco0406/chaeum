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
  contrastColor?: string;
}

export const CalendarDay: FC<CalendarDayProps> = ({
  day,
  color,
  diary,
  contrastColor,
}) => {
  const router = useRouter();
  const hasDiary = !!diary;
  const isSunday = day.date.getDay() === 0;
  const isSaturday = day.date.getDay() === 6;
  const textColor = contrastColor || 'currentColor';

  const handleClick = () => {
    if (!day.isCurrentMonth) return;

    const dateString = format(day.date, 'yyyy-MM-dd');
    if (hasDiary) {
      router.push(`/diary/${dateString}`);
    } else {
      router.push(`/diary/write?date=${dateString}`);
    }
  };

  // 날짜 숫자 색상 결정
  const getDateColor = () => {
    if (!day.isCurrentMonth) {
      return contrastColor ? `${contrastColor}30` : 'var(--muted-foreground)';
    }
    if (day.isToday) {
      return textColor;
    }
    // 일요일/토요일 색상은 대비색이 있을 때는 살짝 다른 투명도로 표시
    if (isSunday || isSaturday) {
      return contrastColor ? textColor : isSunday ? 'rgb(248, 113, 113)' : 'rgb(96, 165, 250)';
    }
    return textColor;
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={!day.isCurrentMonth}
      whileHover={day.isCurrentMonth ? { scale: 1.08 } : undefined}
      whileTap={day.isCurrentMonth ? { scale: 0.95 } : undefined}
      className="relative aspect-square flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-200"
      style={{
        cursor: day.isCurrentMonth ? 'pointer' : 'default',
        opacity: day.isCurrentMonth ? 1 : 0.3,
        backgroundColor: day.isToday
          ? contrastColor
            ? `${contrastColor}15`
            : 'var(--primary-5)'
          : undefined,
      }}
    >
      {/* 날짜 숫자 */}
      <span
        className="text-sm z-10 mb-1"
        style={{
          color: getDateColor(),
          fontWeight: day.isToday ? 700 : 500,
          opacity: isSunday || isSaturday ? 0.9 : 1,
        }}
      >
        {day.dayOfMonth}
      </span>

      {/* 색상 원 - 항상 그 날의 색상을 표시 */}
      <div className="relative">
        <motion.div
          initial={hasDiary ? { scale: 0.5, opacity: 0 } : undefined}
          animate={hasDiary ? { scale: 1, opacity: 1 } : undefined}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-7 h-7 rounded-full relative overflow-hidden"
          style={{
            backgroundColor: color.hex,
            opacity: hasDiary ? 1 : 0.35,
            boxShadow: hasDiary ? `0 2px 8px ${color.hex}40` : undefined,
          }}
        >
          {/* 하이라이트 (일기 있을 때만) */}
          {hasDiary && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, white 0%, transparent 50%)',
              }}
            />
          )}
        </motion.div>

        {/* 일기 있음 마커 - 작은 점 */}
        {hasDiary && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border"
            style={{
              backgroundColor: textColor,
              borderColor: color.hex,
            }}
          />
        )}
      </div>

      {/* 오늘 표시 */}
      {day.isToday && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-1 rounded-xl border-2 pointer-events-none"
          style={{
            borderColor: contrastColor ? `${contrastColor}40` : 'var(--primary-30)',
          }}
        />
      )}
    </motion.button>
  );
};
