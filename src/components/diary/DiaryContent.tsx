'use client';

import { FC } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Diary } from '@/types/database';
import { MOOD_OPTIONS } from '@/lib/validations/diary';

interface DiaryContentProps {
  diary: Diary;
  contrastColor?: string;
}

export const DiaryContent: FC<DiaryContentProps> = ({
  diary,
  contrastColor,
}) => {
  const moodOption = diary.mood
    ? MOOD_OPTIONS.find((m) => m.value === diary.mood)
    : null;

  const createdAt = format(new Date(diary.createdAt), 'a h:mm', { locale: ko });
  const isEdited = diary.createdAt !== diary.updatedAt;
  const updatedAt = isEdited
    ? format(new Date(diary.updatedAt), 'M월 d일 a h:mm', { locale: ko })
    : null;

  const textColor = contrastColor || 'currentColor';

  // cardBg와 cardBorder는 hex로 전달되어야 함
  const cardBg = contrastColor === '#ffffff' ? '#ffffff1f' : '#00000010';
  const cardBorder = contrastColor === '#ffffff' ? '#ffffff33' : '#0000001a';

  return (
    <div
      className="rounded-3xl backdrop-blur-md p-5 space-y-4"
      style={{
        backgroundColor: contrastColor ? cardBg : 'var(--card)',
        border: contrastColor
          ? `1px solid ${cardBorder}`
          : '1px solid var(--border)',
      }}
    >
      {/* 기분 표시 */}
      {moodOption && (
        <div className="flex items-center gap-2">
          <span className="text-xl">{moodOption.emoji}</span>
          <span
            className="text-sm"
            style={{ color: textColor, opacity: 0.7 }}
          >
            {moodOption.label}
          </span>
        </div>
      )}

      {/* 일기 내용 */}
      <div>
        <p
          className="text-base leading-relaxed whitespace-pre-wrap"
          style={{ color: textColor }}
        >
          {diary.content}
        </p>
      </div>

      {/* 작성 시간 */}
      <div
        className="pt-4"
        style={{
          borderTop: contrastColor
            ? `1px solid ${contrastColor}15`
            : '1px solid var(--border)',
        }}
      >
        <p
          className="text-xs"
          style={{ color: textColor, opacity: 0.5 }}
        >
          {createdAt}에 작성
          {isEdited && ` · ${updatedAt}에 수정됨`}
        </p>
      </div>
    </div>
  );
};
