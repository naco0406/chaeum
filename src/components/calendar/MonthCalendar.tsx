'use client';

import { FC, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarWeekdays } from '@/components/calendar/CalendarWeekdays';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { ImmersiveBackground } from '@/components/common/ImmersiveBackground';
import { useCalendar } from '@/hooks/useCalendar';
import { useDiariesByMonth } from '@/hooks/useDiariesByMonth';
import { getColorByDate } from '@/lib/color-utils';
import { createColorPalette } from '@/lib/color-contrast';

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

  // 오늘의 색상
  const todayColor = useMemo(() => getColorByDate(new Date()), []);
  const palette = useMemo(
    () => createColorPalette(todayColor.hex),
    [todayColor.hex]
  );

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
    <ImmersiveBackground color={todayColor.hex} enableAnimation={true}>
      <div className="px-4 pt-6 pb-32">
        <div className="w-full max-w-[430px] mx-auto space-y-6">
          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p
              className="text-sm mb-1 tracking-widest uppercase"
              style={{ color: palette.contrast, opacity: 0.6 }}
            >
              나의 감정 기록
            </p>
            <h1
              className="text-2xl font-serif"
              style={{ color: palette.contrast }}
            >
              캘린더
            </h1>
          </motion.div>

          {/* 통계 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { value: monthStats.diaryCount, label: '작성한 일기' },
              { value: monthStats.daysInMonth, label: '이번 달 일수' },
              { value: `${monthStats.percentage}%`, label: '달성률' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-2xl backdrop-blur-md"
                style={{
                  backgroundColor: palette.cardBg,
                  border: `1px solid ${palette.cardBorder}`,
                }}
              >
                <p
                  className="text-2xl font-serif"
                  style={{ color: palette.contrast }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: palette.contrast, opacity: 0.6 }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* 캘린더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl backdrop-blur-md p-5"
            style={{
              backgroundColor: palette.cardBg,
              border: `1px solid ${palette.cardBorder}`,
            }}
          >
            <CalendarHeader
              monthLabel={monthLabel}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              contrastColor={palette.contrast}
            />
            <CalendarWeekdays contrastColor={palette.contrast} />
            <CalendarGrid
              days={calendarDays}
              diaries={diaries}
              isLoading={isLoading}
              direction={direction}
              monthKey={monthKey}
              contrastColor={palette.contrast}
            />
          </motion.div>

          {/* 범례 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-8 text-xs"
            style={{ color: palette.contrast, opacity: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${todayColor.hex} 0%, ${palette.darker} 100%)`,
                }}
              />
              <span>일기 작성</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full border-2 border-dashed"
                style={{ borderColor: `${palette.contrast}30` }}
              />
              <span>미작성</span>
            </div>
          </motion.div>

          {/* 동기부여 메시지 */}
          {monthStats.diaryCount === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center text-sm"
              style={{ color: palette.contrast, opacity: 0.7 }}
            >
              이번 달 첫 일기를 시작해보세요
            </motion.p>
          )}
        </div>
      </div>
    </ImmersiveBackground>
  );
};
