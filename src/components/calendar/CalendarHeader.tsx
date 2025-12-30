'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface CalendarHeaderProps {
  monthLabel: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  contrastColor?: string;
}

export const CalendarHeader: FC<CalendarHeaderProps> = ({
  monthLabel,
  onPrevMonth,
  onNextMonth,
  onToday,
  contrastColor,
}) => {
  const textColor = contrastColor || 'currentColor';
  const mutedColor = contrastColor
    ? `${contrastColor}60`
    : 'var(--muted-foreground)';

  return (
    <div className="flex items-center justify-between py-4">
      <motion.button
        onClick={onPrevMonth}
        className="rounded-full w-10 h-10 flex items-center justify-center transition-colors"
        style={{
          color: textColor,
          backgroundColor: contrastColor ? `${contrastColor}10` : undefined,
        }}
        whileHover={{ x: -2, backgroundColor: `${contrastColor}20` }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      <div className="flex items-center gap-3">
        <motion.button
          onClick={onToday}
          className="text-xl font-serif transition-colors relative group"
          style={{ color: textColor }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {monthLabel}
          <span
            className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
            style={{ backgroundColor: textColor }}
          />
        </motion.button>
        <motion.button
          onClick={onToday}
          className="transition-colors"
          style={{ color: mutedColor }}
          whileHover={{ rotate: -180, color: textColor }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      <motion.button
        onClick={onNextMonth}
        className="rounded-full w-10 h-10 flex items-center justify-center transition-colors"
        style={{
          color: textColor,
          backgroundColor: contrastColor ? `${contrastColor}10` : undefined,
        }}
        whileHover={{ x: 2, backgroundColor: `${contrastColor}20` }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};
