import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { DiaryFormValues } from '@/lib/validations/diary';
import { getDayOfYear } from '@/lib/color-utils';

interface CreateDiaryParams extends DiaryFormValues {
  date: Date;
  colorIndex: number;
  userId: string;
}

interface UpdateDiaryParams {
  id: string;
  content: string;
  mood: DiaryFormValues['mood'];
}

const createDiary = async (params: CreateDiaryParams) => {
  const supabase = createClient();
  const dateString = format(params.date, 'yyyy-MM-dd');

  const { data, error } = await supabase
    .from('diaries')
    .insert({
      user_id: params.userId,
      date: dateString,
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

  return { data, dateString };
};

const updateDiaryFn = async (params: UpdateDiaryParams) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('diaries')
    .update({
      content: params.content,
      mood: params.mood,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
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

  const createMutation = useMutation({
    mutationFn: createDiary,
    onSuccess: (result) => {
      toast.success('일기가 저장되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['diaries'] });
      queryClient.invalidateQueries({ queryKey: ['diary', result.dateString] });
      router.push(`/diary/${result.dateString}`);
    },
    onError: (error) => {
      console.error('Failed to save diary:', error);
      toast.error('일기 저장에 실패했습니다.', {
        description: '잠시 후 다시 시도해주세요.',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateDiaryFn,
    onSuccess: (data) => {
      toast.success('일기가 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['diaries'] });
      queryClient.invalidateQueries({ queryKey: ['diary', data.date] });
      router.push(`/diary/${data.date}`);
    },
    onError: (error) => {
      console.error('Failed to update diary:', error);
      toast.error('일기 수정에 실패했습니다.', {
        description: '잠시 후 다시 시도해주세요.',
      });
    },
  });

  return {
    saveDiary: createMutation.mutate,
    updateDiary: updateMutation.mutate,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    error: createMutation.error || updateMutation.error,
  };
};
