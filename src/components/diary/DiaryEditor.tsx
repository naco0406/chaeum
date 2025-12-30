'use client';

import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CharacterCounter } from '@/components/diary/CharacterCounter';
import { DiaryFormValues, MOOD_OPTIONS } from '@/lib/validations/diary';
import { DailyColor } from '@/types/color';

interface DiaryEditorProps {
  form: UseFormReturn<DiaryFormValues>;
  characterCount: number;
  maxCharacters: number;
  color: DailyColor;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const DiaryEditor: FC<DiaryEditorProps> = ({
  form,
  characterCount,
  maxCharacters,
  color,
  isSubmitting,
  onSubmit,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const selectedMood = watch('mood');

  return (
    <div className="flex flex-col flex-1 pb-24">
      <Card className="shadow-soft flex-1">
        <CardContent className="p-4 space-y-4">
          {/* 기분 선택 */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              오늘의 기분
            </Label>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() =>
                    setValue('mood', selectedMood === mood.value ? null : mood.value)
                  }
                  className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                    selectedMood === mood.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {mood.emoji} {mood.label}
                </button>
              ))}
            </div>
          </div>

          {/* 일기 내용 */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm text-muted-foreground">
              오늘의 기록
            </Label>
            <Textarea
              id="content"
              placeholder="오늘 하루는 어땠나요? 당신의 이야기를 들려주세요."
              className="min-h-[280px] resize-none shadow-inner-soft text-base leading-relaxed focus:ring-2 transition-all"
              style={{
                '--tw-ring-color': `${color.hex}40`,
              } as React.CSSProperties}
              {...register('content')}
            />
            <div className="flex items-center justify-between">
              {errors.content && (
                <p className="text-xs text-destructive">{errors.content.message}</p>
              )}
              <div className="ml-auto">
                <CharacterCounter current={characterCount} max={maxCharacters} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 저장 버튼 - 하단 고정 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t border-border">
        <div className="max-w-[430px] mx-auto">
          <Button
            type="button"
            className="w-full h-14 text-base"
            style={{
              backgroundColor: color.hex,
              color: getContrastColor(color.hex),
            }}
            disabled={isSubmitting || characterCount === 0}
            onClick={onSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              '오늘의 일기 저장하기'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const getContrastColor = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1C1C1C' : '#FFFFFF';
};
