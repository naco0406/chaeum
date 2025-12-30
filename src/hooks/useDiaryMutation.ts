import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { DiaryFormValues } from '@/lib/validations/diary';
import { getDayOfYear } from '@/lib/color-utils';

interface CreateDiaryParams extends DiaryFormValues {
  date: Date;
  colorIndex: number;
  userId: string;
}

const createDiary = async (params: CreateDiaryParams) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('diaries')
    .insert({
      user_id: params.userId,
      date: params.date.toISOString().split('T')[0],
      day_of_year: getDayOfYear(params.date),
      content: params.content,
      mood: params.mood,
      color_index: params.colorIndex,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const useDiaryMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createDiary,
    onSuccess: () => {
      toast.success('일기가 저장되었습니다.', {
        description: '오늘의 기록이 완료되었어요.',
      });
      queryClient.invalidateQueries({ queryKey: ['diaries'] });
      router.push('/');
    },
    onError: (error) => {
      console.error('Failed to save diary:', error);
      toast.error('일기 저장에 실패했습니다.', {
        description: '잠시 후 다시 시도해주세요.',
      });
    },
  });

  return {
    saveDiary: mutation.mutate,
    isSubmitting: mutation.isPending,
    error: mutation.error,
  };
};
