'use client';

import { FC } from 'react';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { DiaryHeader } from '@/components/diary/DiaryHeader';
import { DiaryEditor } from '@/components/diary/DiaryEditor';
import { useDiaryForm } from '@/hooks/useDiaryForm';
import { useDiaryMutation } from '@/hooks/useDiaryMutation';
import { useAuth } from '@/providers/AuthProvider';
import { DailyColor } from '@/types/color';
import { toast } from 'sonner';

interface DiaryWriteClientProps {
  color: DailyColor;
  date: Date;
}

export const DiaryWriteClient: FC<DiaryWriteClientProps> = ({ color, date }) => {
  const { user } = useAuth();
  const { form, characterCount, maxCharacters } = useDiaryForm();
  const { saveDiary, isSubmitting } = useDiaryMutation();

  const handleSubmit = () => {
    const values = form.getValues();

    if (!values.content.trim()) {
      toast.error('일기 내용을 입력해주세요.');
      return;
    }

    if (values.content.length > maxCharacters) {
      toast.error('일기는 500자까지 작성할 수 있습니다.');
      return;
    }

    // 로그인하지 않은 경우 로컬 저장 또는 로그인 유도
    if (!user) {
      toast.info('로그인이 필요합니다.', {
        description: '로그인 후 일기를 저장할 수 있습니다.',
        action: {
          label: '로그인',
          onClick: () => {
            window.location.href = '/login';
          },
        },
      });
      return;
    }

    saveDiary({
      content: values.content,
      mood: values.mood,
      date,
      colorIndex: color.index,
      userId: user.id,
    });
  };

  return (
    <AnimatedBackground color={color.hex}>
      <div className="min-h-screen flex flex-col px-4">
        <div className="w-full max-w-[430px] mx-auto flex flex-col flex-1">
          <DiaryHeader date={date} color={color} />
          <DiaryEditor
            form={form}
            characterCount={characterCount}
            maxCharacters={maxCharacters}
            color={color}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </AnimatedBackground>
  );
};
