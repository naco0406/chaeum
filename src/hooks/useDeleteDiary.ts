import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

const deleteDiary = async (diaryId: string): Promise<void> => {
  const supabase = createClient();

  const { error } = await supabase
    .from('diaries')
    .delete()
    .eq('id', diaryId);

  if (error) {
    throw error;
  }
};

export const useDeleteDiary = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteDiary,
    onSuccess: () => {
      toast.success('일기가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['diaries'] });
      queryClient.invalidateQueries({ queryKey: ['diary'] });
      router.push('/records');
    },
    onError: (error) => {
      console.error('Failed to delete diary:', error);
      toast.error('일기 삭제에 실패했습니다.', {
        description: '잠시 후 다시 시도해주세요.',
      });
    },
  });

  return {
    deleteDiary: mutation.mutate,
    isDeleting: mutation.isPending,
  };
};
