'use client';

import { FC, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { format, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useDiary } from '@/hooks/useDiary';
import { useDiaryMutation } from '@/hooks/useDiaryMutation';
import { useAuth } from '@/providers/AuthProvider';
import { DailyColor } from '@/types/color';
import { DiaryMood } from '@/types/database';
import { toast } from 'sonner';
import { createColorPalette } from '@/lib/color-contrast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { diarySchema, DiaryFormValues } from '@/lib/validations/diary';

interface DiaryWriteClientProps {
  color: DailyColor;
  date: Date;
  isEdit?: boolean;
}

// 감정 데이터
const MOOD_DATA: {
  value: DiaryMood;
  label: string;
  description: string;
}[] = [
  { value: 'happy', label: '행복', description: '기쁘고 즐거운' },
  { value: 'peaceful', label: '평온', description: '고요하고 차분한' },
  { value: 'grateful', label: '감사', description: '마음이 충만한' },
  { value: 'excited', label: '설렘', description: '두근거리는' },
  { value: 'tired', label: '피곤', description: '지치고 쉬고 싶은' },
  { value: 'anxious', label: '불안', description: '마음이 어수선한' },
  { value: 'sad', label: '슬픔', description: '마음이 무거운' },
  { value: 'angry', label: '화남', description: '속상하고 답답한' },
];

export const DiaryWriteClient: FC<DiaryWriteClientProps> = ({
  color,
  date,
  isEdit = false,
}) => {
  const { user } = useAuth();
  const dateString = format(date, 'yyyy-MM-dd');
  const isTodayDate = isToday(date);

  // 기존 일기 로드 (편집 모드일 때)
  const { diary: existingDiary, isLoading: isLoadingDiary } = useDiary(
    isEdit ? dateString : ''
  );

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

  const { saveDiary, updateDiary, isSubmitting } = useDiaryMutation();
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [mounted, setMounted] = useState(false);

  const formattedDate = format(date, 'M월 d일', { locale: ko });
  const dayOfWeek = format(date, 'EEEE', { locale: ko });
  const selectedMood = form.watch('mood');
  const selectedMoodData = MOOD_DATA.find((m) => m.value === selectedMood);

  // HSL 기반 대비색 팔레트 생성
  const palette = useMemo(() => createColorPalette(color.hex), [color.hex]);
  const contrastColor = palette.contrast;
  const darkerColor = palette.darker;

  // 기존 일기 데이터로 폼 초기화
  useEffect(() => {
    if (existingDiary && isEdit) {
      form.setValue('content', existingDiary.content);
      form.setValue('mood', existingDiary.mood as DiaryMood | null);
    }
  }, [existingDiary, isEdit, form]);

  useEffect(() => {
    setMounted(true);
    document.documentElement.style.backgroundColor = darkerColor;
    document.body.style.backgroundColor = darkerColor;
  }, [darkerColor]);

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

    if (isEdit && existingDiary) {
      // 수정 모드
      updateDiary({
        id: existingDiary.id,
        content: values.content,
        mood: values.mood,
      });
    } else {
      // 새로 작성
      saveDiary({
        content: values.content,
        mood: values.mood,
        date,
        colorIndex: color.index,
        userId: user.id,
      });
    }
  };

  // 날짜에 따른 텍스트
  const getDateContextText = () => {
    if (isTodayDate) return '오늘';
    return `${formattedDate}`;
  };

  if (!mounted || (isEdit && isLoadingDiary)) {
    return (
      <div
        className="min-h-screen-dvh"
        style={{ backgroundColor: color.hex }}
      />
    );
  }

  return (
    <div className="min-h-screen-dvh relative overflow-hidden">
      {/* 풀스크린 색상 배경 */}
      <div
        className="fixed inset-0 -z-10 transition-colors duration-700"
        style={{
          background: `linear-gradient(180deg, ${color.hex} 0%, ${darkerColor} 100%)`,
        }}
      />

      {/* 노이즈 텍스처 */}
      <div
        className="fixed inset-0 z-[1] opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 상단 네비게이션 */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="max-w-[500px] mx-auto flex items-center justify-between">
          <Link href={isTodayDate ? '/' : `/diary/${dateString}`}>
            <motion.button
              className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{
                backgroundColor: `${contrastColor}15`,
                color: contrastColor,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: contrastColor, opacity: 0.6 }}
            >
              {isTodayDate ? dayOfWeek : `${format(date, 'yyyy')} · ${dayOfWeek}`}
            </p>
            <p
              className="text-sm font-medium"
              style={{ color: contrastColor }}
            >
              {formattedDate}
            </p>
          </motion.div>

          <motion.button
            className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm"
            style={{
              backgroundColor:
                characterCount > 0 ? contrastColor : `${contrastColor}15`,
              color: characterCount > 0 ? color.hex : contrastColor,
            }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting || characterCount === 0}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Check className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="relative z-10 pt-24 pb-32 px-4 min-h-screen-dvh flex flex-col">
        <div className="max-w-[500px] mx-auto w-full flex-1 flex flex-col">
          {/* 색상 정보 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <p
              className="text-xs tracking-[0.3em] uppercase mb-2"
              style={{ color: contrastColor, opacity: 0.5 }}
            >
              No. {String(color.index).padStart(3, '0')}
            </p>
            <h1
              className="text-3xl font-serif mb-2"
              style={{ color: contrastColor }}
            >
              {color.nameKo}
            </h1>
            <p
              className="text-sm font-light"
              style={{ color: contrastColor, opacity: 0.7 }}
            >
              {color.description}
            </p>
          </motion.div>

          {/* 감정 선택 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <button
              onClick={() => setShowMoodSelector(!showMoodSelector)}
              className="w-full py-4 rounded-2xl backdrop-blur-sm flex items-center justify-center gap-3 transition-all"
              style={{
                backgroundColor: `${contrastColor}10`,
                borderColor: `${contrastColor}20`,
                color: contrastColor,
              }}
            >
              {selectedMoodData ? (
                <>
                  <span className="font-medium">{selectedMoodData.label}</span>
                  <span style={{ opacity: 0.6 }}>
                    {selectedMoodData.description} 하루
                  </span>
                </>
              ) : (
                <span style={{ opacity: 0.6 }}>
                  {isTodayDate ? '오늘의' : '그날의'} 감정을 선택하세요
                </span>
              )}
            </button>

            {/* 감정 선택 그리드 */}
            <AnimatePresence>
              {showMoodSelector && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-4 gap-2 pt-3">
                    {MOOD_DATA.map((mood, index) => (
                      <motion.button
                        key={mood.value}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => {
                          form.setValue(
                            'mood',
                            selectedMood === mood.value ? null : mood.value
                          );
                          setShowMoodSelector(false);
                        }}
                        className="py-3 rounded-xl text-center transition-all"
                        style={{
                          backgroundColor:
                            selectedMood === mood.value
                              ? contrastColor
                              : `${contrastColor}10`,
                          color:
                            selectedMood === mood.value
                              ? color.hex
                              : contrastColor,
                        }}
                      >
                        <span className="text-sm font-medium">
                          {mood.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 일기 작성 영역 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1 flex flex-col"
          >
            <div
              className="flex-1 rounded-3xl backdrop-blur-sm p-6 flex flex-col"
              style={{
                backgroundColor: palette.cardBg,
                border: `1px solid ${palette.cardBorder}`,
              }}
            >
              <Textarea
                placeholder={
                  isTodayDate
                    ? '오늘은 어떤 하루였나요?\n\n기억하고 싶은 순간, 느꼈던 감정, 스쳐간 생각들...\n당신의 이야기를 들려주세요.'
                    : `${formattedDate}은 어떤 하루였나요?\n\n그날의 기억, 느꼈던 감정, 스쳐간 생각들...\n당신의 이야기를 들려주세요.`
                }
                className="flex-1 min-h-[300px] resize-none border-0 bg-transparent p-0 text-base leading-relaxed focus-visible:ring-0 placeholder:leading-relaxed"
                style={{
                  color: contrastColor,
                  caretColor: contrastColor,
                }}
                {...form.register('content')}
              />

              {/* 하단 정보 */}
              <div
                className="flex items-center justify-between pt-4 mt-4 border-t"
                style={{ borderColor: `${contrastColor}15` }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: contrastColor, opacity: 0.3 }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: contrastColor, opacity: 0.5 }}
                  >
                    {color.hex.toUpperCase()}
                  </span>
                </div>
                <span
                  className="text-xs font-mono"
                  style={{
                    color: contrastColor,
                    opacity: characterCount > maxCharacters ? 1 : 0.5,
                  }}
                >
                  {characterCount} / {maxCharacters}
                </span>
              </div>
            </div>
          </motion.div>

          {/* 저장 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <motion.button
              className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-base font-medium disabled:opacity-50 transition-all"
              style={{
                backgroundColor: contrastColor,
                color: color.hex,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting || characterCount === 0}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  저장 중...
                </>
              ) : isEdit ? (
                '일기 수정하기'
              ) : isTodayDate ? (
                '오늘의 일기 저장하기'
              ) : (
                `${formattedDate} 일기 저장하기`
              )}
            </motion.button>

            <p
              className="text-center text-xs mt-4"
              style={{ color: contrastColor, opacity: 0.4 }}
            >
              {color.nameKo}의 {isTodayDate ? '하루' : '그날'}을 기록합니다
            </p>
          </motion.div>
        </div>
      </main>

      {/* 감정 선택 오버레이 닫기 */}
      <AnimatePresence>
        {showMoodSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-0"
            onClick={() => setShowMoodSelector(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
