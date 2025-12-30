'use client';

import { FC } from 'react';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const CalendarWeekdays: FC = () => {
  return (
    <div className="grid grid-cols-7 mb-2">
      {WEEKDAYS.map((day, index) => (
        <div
          key={day}
          className={`text-center text-sm py-2 ${
            index === 0
              ? 'text-red-400'
              : index === 6
                ? 'text-blue-400'
                : 'text-muted-foreground'
          }`}
        >
          {day}
        </div>
      ))}
    </div>
  );
};
