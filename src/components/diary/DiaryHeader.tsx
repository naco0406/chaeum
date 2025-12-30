'use client';

import { FC } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DailyColor } from '@/types/color';

interface DiaryHeaderProps {
  date: Date;
  color: DailyColor;
}

export const DiaryHeader: FC<DiaryHeaderProps> = ({ date, color }) => {
  const formattedDate = format(date, 'M월 d일 EEEE', { locale: ko });

  return (
    <header className="flex items-center justify-between py-4">
      <Link href="/">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </Link>

      <div className="flex items-center gap-3">
        <div
          className="w-6 h-6 rounded-full shadow-soft"
          style={{ backgroundColor: color.hex }}
        />
        <div className="text-center">
          <p className="text-sm font-medium">{formattedDate}</p>
          <p className="text-xs text-muted-foreground">{color.nameKo}</p>
        </div>
      </div>

      <div className="w-10" />
    </header>
  );
};
