'use client';

import { FC } from 'react';

interface CharacterCounterProps {
  current: number;
  max: number;
}

export const CharacterCounter: FC<CharacterCounterProps> = ({ current, max }) => {
  const isNearLimit = current >= max * 0.9;
  const isOverLimit = current > max;

  return (
    <p
      className={`text-xs text-right ${
        isOverLimit
          ? 'text-destructive'
          : isNearLimit
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-muted-foreground'
      }`}
    >
      {current}/{max}
    </p>
  );
};
