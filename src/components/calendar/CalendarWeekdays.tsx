'use client';

import { FC } from 'react';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface CalendarWeekdaysProps {
  contrastColor?: string;
}

export const CalendarWeekdays: FC<CalendarWeekdaysProps> = ({
  contrastColor,
}) => {
  return (
    <div className="grid grid-cols-7 mb-2">
      {WEEKDAYS.map((day, index) => {
        let color = contrastColor || 'var(--muted-foreground)';
        let opacity = 0.6;

        // 일요일은 빨간색 계열, 토요일은 파란색 계열
        if (index === 0) {
          color = contrastColor ? `${contrastColor}` : 'rgb(248, 113, 113)';
          opacity = 0.8;
        } else if (index === 6) {
          color = contrastColor ? `${contrastColor}` : 'rgb(96, 165, 250)';
          opacity = 0.8;
        }

        return (
          <div
            key={day}
            className="text-center text-sm py-2"
            style={{ color, opacity }}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
};
