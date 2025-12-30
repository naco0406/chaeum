import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { diarySchema, DiaryFormValues } from '@/lib/validations/diary';

export const useDiaryForm = () => {
  const form = useForm<DiaryFormValues>({
    resolver: zodResolver(diarySchema),
    defaultValues: {
      content: '',
      mood: null,
    },
  });

  const content = form.watch('content');
  const characterCount = content?.length || 0;
  const maxCharacters = 500;

  return {
    form,
    characterCount,
    maxCharacters,
    isValid: form.formState.isValid,
    errors: form.formState.errors,
  };
};
