'use client';

import { FC, useMemo, useEffect } from 'react';
import { format, getDayOfYear } from 'date-fns';
import { motion } from 'framer-motion';
import { ColorCell } from '@/components/palette/ColorCell';
import { useDiariesByYear } from '@/hooks/useDiariesByYear';
import { getColorByDate, getColorByIndex } from '@/lib/color-utils';

// 중립적 라이트 테마 색상
const PALETTE_THEME = {
  bg: '#FAFAF9', // warm white
  cardBg: '#FFFFFF',
  cardBorder: '#E7E5E4',
  text: '#1C1917',
  textMuted: '#78716C',
  accent: '#57534E',
};

export const ColorPaletteView: FC = () => {
  const currentYear = new Date().getFullYear();
  const today = new Date();
  const todayIndex = getDayOfYear(today);

  const todayColor = useMemo(() => getColorByDate(today), []);
  const { diaries, filledCount } = useDiariesByYear(currentYear);

  // 배경색 설정
  useEffect(() => {
    document.documentElement.style.backgroundColor = PALETTE_THEME.bg;
    document.body.style.backgroundColor = PALETTE_THEME.bg;
  }, []);

  // 계절별 그룹핑
  const seasons = useMemo(() => {
    return [
      { name: '봄', nameEn: 'SPRING', start: 1, end: 90, emoji: '🌸', gradient: 'from-pink-100 to-green-50' },
      { name: '여름', nameEn: 'SUMMER', start: 91, end: 181, emoji: '☀️', gradient: 'from-yellow-50 to-blue-50' },
      { name: '가을', nameEn: 'AUTUMN', start: 182, end: 273, emoji: '🍂', gradient: 'from-orange-50 to-amber-50' },
      { name: '겨울', nameEn: 'WINTER', start: 274, end: 365, emoji: '❄️', gradient: 'from-blue-50 to-slate-50' },
    ];
  }, []);

  // 현재 계절 찾기
  const currentSeason = useMemo(() => {
    return seasons.find((s) => todayIndex >= s.start && todayIndex <= s.end);
  }, [seasons, todayIndex]);

  // 날짜로부터 dateKey 생성
  const getDateKey = (dayIndex: number) => {
    const date = new Date(currentYear, 0, dayIndex);
    return format(date, 'yyyy-MM-dd');
  };

  return (
    <div
      className="min-h-screen-dvh px-4 pt-14 pb-32"
      style={{ backgroundColor: PALETTE_THEME.bg }}
    >
      <div className="max-w-[500px] mx-auto">
        {/* 헤더 */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p
            className="text-xs tracking-[0.3em] uppercase mb-1"
            style={{ color: PALETTE_THEME.textMuted }}
          >
            {currentYear}
          </p>
          <h1
            className="text-2xl font-serif"
            style={{ color: PALETTE_THEME.text }}
          >
            나의 색채 여정
          </h1>
        </motion.div>

        {/* 진행률 카드 - 오늘의 색상 강조 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl p-6 mb-8 shadow-sm"
          style={{
            backgroundColor: PALETTE_THEME.cardBg,
            border: `1px solid ${PALETTE_THEME.cardBorder}`,
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            {/* 오늘의 색상 원 */}
            <div
              className="w-14 h-14 rounded-2xl shadow-lg flex-shrink-0"
              style={{
                backgroundColor: todayColor.hex,
                boxShadow: `0 8px 24px ${todayColor.hex}40`,
              }}
            />
            <div className="flex-1">
              <p className="text-sm" style={{ color: PALETTE_THEME.textMuted }}>
                오늘의 색
              </p>
              <p className="text-lg font-serif" style={{ color: PALETTE_THEME.text }}>
                {todayColor.nameKo}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-serif" style={{ color: PALETTE_THEME.text }}>
                {filledCount}
              </p>
              <p className="text-xs" style={{ color: PALETTE_THEME.textMuted }}>
                / 365 기록
              </p>
            </div>
          </div>

          {/* 프로그레스 바 */}
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: '#F5F5F4' }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(filledCount / 365) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                background: `linear-gradient(90deg, ${todayColor.hex} 0%, #A8A29E 100%)`,
              }}
            />
          </div>

          <p
            className="text-xs mt-3 text-center"
            style={{ color: PALETTE_THEME.textMuted }}
          >
            {currentSeason
              ? `${currentSeason.emoji} ${currentSeason.name}의 ${todayIndex - currentSeason.start + 1}번째 날`
              : '새해의 시작'}
          </p>
        </motion.div>

        {/* 계절별 색상 팔레트 */}
        {seasons.map((season, seasonIndex) => (
          <motion.div
            key={season.name}
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + seasonIndex * 0.1 }}
          >
            {/* 계절 헤더 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{season.emoji}</span>
                <h2
                  className="text-lg font-serif"
                  style={{ color: PALETTE_THEME.text }}
                >
                  {season.name}
                </h2>
                <span
                  className="text-xs tracking-widest"
                  style={{ color: PALETTE_THEME.textMuted }}
                >
                  {season.nameEn}
                </span>
              </div>
              <span
                className="text-xs"
                style={{ color: PALETTE_THEME.textMuted }}
              >
                {season.end - season.start + 1}일
              </span>
            </div>

            {/* 색상 그리드 - 불투명 흰색 배경 */}
            <div
              className="rounded-2xl p-3 shadow-sm"
              style={{
                backgroundColor: PALETTE_THEME.cardBg,
                border: `1px solid ${PALETTE_THEME.cardBorder}`,
              }}
            >
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from(
                  { length: season.end - season.start + 1 },
                  (_, i) => {
                    const dayIndex = season.start + i;
                    const color = getColorByIndex(dayIndex);
                    const dateKey = getDateKey(dayIndex);
                    const hasDiary = !!diaries[dateKey];
                    const isToday = dayIndex === todayIndex;
                    const isFuture = dayIndex > todayIndex;

                    return (
                      <ColorCell
                        key={dayIndex}
                        dayIndex={dayIndex}
                        color={color}
                        hasDiary={hasDiary}
                        isToday={isToday}
                        isFuture={isFuture}
                        contrastColor={PALETTE_THEME.text}
                      />
                    );
                  }
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* 범례 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-6 text-xs"
          style={{ color: PALETTE_THEME.textMuted }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded"
              style={{ backgroundColor: todayColor.hex }}
            />
            <span>기록됨</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded"
              style={{
                backgroundColor: todayColor.hex,
                opacity: 0.35,
              }}
            />
            <span>미기록</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded"
              style={{
                backgroundColor: todayColor.hex,
                border: `2px solid ${PALETTE_THEME.text}`,
              }}
            />
            <span>오늘</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
