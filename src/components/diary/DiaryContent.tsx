'use client';

import { FC } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Diary } from '@/types/database';
import { MOOD_OPTIONS } from '@/lib/validations/diary';

interface DiaryContentProps {
  diary: Diary;
}

export const DiaryContent: FC<DiaryContentProps> = ({ diary }) => {
  const moodOption = diary.mood
    ? MOOD_OPTIONS.find((m) => m.value === diary.mood)
    : null;

  const createdAt = format(new Date(diary.createdAt), 'a h:mm', { locale: ko });
  const isEdited = diary.createdAt !== diary.updatedAt;
  const updatedAt = isEdited
    ? format(new Date(diary.updatedAt), 'M월 d일 a h:mm', { locale: ko })
    : null;

  return (
    <Card className="shadow-soft">
      <CardContent className="p-5 space-y-4">
        {/* 기분 표시 */}
        {moodOption && (
          <div className="flex items-center gap-2">
            <span className="text-xl">{moodOption.emoji}</span>
            <span className="text-sm text-muted-foreground">
              {moodOption.label}
            </span>
          </div>
        )}

        {/* 일기 내용 */}
        <div className="prose prose-sm max-w-none">
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {diary.content}
          </p>
        </div>

        {/* 작성 시간 */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {createdAt}에 작성
            {isEdited && ` · ${updatedAt}에 수정됨`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
