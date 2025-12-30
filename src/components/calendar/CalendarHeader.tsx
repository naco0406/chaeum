'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarHeaderProps {
  monthLabel: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export const CalendarHeader: FC<CalendarHeaderProps> = ({
  monthLabel,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  return (
    <div className="flex items-center justify-between py-4">
      <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevMonth}
          className="rounded-full w-10 h-10 hover:bg-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </motion.div>

      <div className="flex items-center gap-3">
        <motion.button
          onClick={onToday}
          className="text-xl font-serif hover:text-primary transition-colors relative group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {monthLabel}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
        </motion.button>
        <motion.button
          onClick={onToday}
          className="text-muted-foreground hover:text-primary transition-colors"
          whileHover={{ rotate: -180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNextMonth}
          className="rounded-full w-10 h-10 hover:bg-secondary"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};
