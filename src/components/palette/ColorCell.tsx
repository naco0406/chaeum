'use client';

import { FC, useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyColor } from '@/types/color';
import { createColorPalette } from '@/lib/color-contrast';

interface ColorCellProps {
  dayIndex: number;
  color: DailyColor;
  hasDiary: boolean;
  isToday: boolean;
  isFuture: boolean;
  contrastColor: string;
}

export const ColorCell: FC<ColorCellProps> = ({
  dayIndex,
  color,
  hasDiary,
  isToday,
  isFuture,
  contrastColor,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const currentYear = new Date().getFullYear();
  const date = new Date(currentYear, 0, dayIndex);

  // 셀 색상에 맞는 대비색 계산 (툴팁용)
  const cellPalette = useMemo(() => createColorPalette(color.hex), [color.hex]);

  // 미래 날짜는 클릭 불가
  const href = isFuture ? undefined : `/color/${dayIndex}`;

  const content = (
    <motion.div
      className="relative aspect-square rounded cursor-pointer"
      style={{
        backgroundColor: color.hex,
        // 기록됨: 100%, 미기록: 35%, 미래: 15%
        opacity: isFuture ? 0.15 : hasDiary ? 1 : 0.35,
      }}
      whileHover={!isFuture ? { scale: 1.15 } : {}}
      whileTap={!isFuture ? { scale: 0.95 } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* 오늘 표시 링 */}
      {isToday && (
        <div
          className="absolute inset-0 rounded"
          style={{
            border: `2px solid ${contrastColor}`,
          }}
        />
      )}

      {/* 호버 시 툴팁 - 불투명, 작게 */}
      <AnimatePresence>
        {isHovered && !isFuture && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap pointer-events-none"
          >
            <div
              className="px-2 py-1.5 rounded-lg shadow-lg"
              style={{
                backgroundColor: cellPalette.contrast,
                color: color.hex,
              }}
            >
              <p className="font-medium text-xs">{color.nameKo}</p>
              <p className="text-[10px]" style={{ opacity: 0.7 }}>
                {format(date, 'M/d')} · {hasDiary ? '기록됨' : '미기록'}
              </p>
            </div>
            {/* 화살표 */}
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
              style={{ backgroundColor: cellPalette.contrast }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};
