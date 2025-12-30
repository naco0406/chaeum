import { useState, useMemo, useCallback } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  format,
} from 'date-fns';

export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayOfYear: number;
}

export const useCalendar = (initialDate?: Date) => {
  const [currentMonth, setCurrentMonth] = useState(initialDate || new Date());

  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date());
  }, []);

  const goToMonth = useCallback((date: Date) => {
    setCurrentMonth(date);
  }, []);

  const calendarDays = useMemo((): CalendarDay[] => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const today = new Date();

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd }).map(
      (date) => {
        const startOfYear = new Date(date.getFullYear(), 0, 0);
        const diff = date.getTime() - startOfYear.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        return {
          date,
          dayOfMonth: date.getDate(),
          isCurrentMonth: isSameMonth(date, currentMonth),
          isToday: isSameDay(date, today),
          dayOfYear,
        };
      }
    );
  }, [currentMonth]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;
  const monthLabel = format(currentMonth, 'yyyy년 M월');

  return {
    currentMonth,
    year,
    month,
    monthLabel,
    calendarDays,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    goToMonth,
  };
};
