import { z } from 'zod';
import { DiaryMood } from '@/types/database';

export const diarySchema = z.object({
  content: z
    .string()
    .min(1, '일기 내용을 입력해주세요.')
    .max(500, '일기는 500자까지 작성할 수 있습니다.'),
  mood: z
    .enum([
      'happy',
      'peaceful',
      'sad',
      'angry',
      'anxious',
      'grateful',
      'tired',
      'excited',
    ] as const)
    .nullable(),
});

export type DiaryFormValues = z.infer<typeof diarySchema>;

export const MOOD_OPTIONS: { value: DiaryMood; label: string; emoji: string }[] = [
  { value: 'happy', label: '행복', emoji: '😊' },
  { value: 'peaceful', label: '평온', emoji: '😌' },
  { value: 'grateful', label: '감사', emoji: '🙏' },
  { value: 'excited', label: '설렘', emoji: '✨' },
  { value: 'tired', label: '피곤', emoji: '😴' },
  { value: 'anxious', label: '불안', emoji: '😰' },
  { value: 'sad', label: '슬픔', emoji: '😢' },
  { value: 'angry', label: '화남', emoji: '😤' },
];
