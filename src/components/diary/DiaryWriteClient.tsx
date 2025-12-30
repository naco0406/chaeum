'use client';

import { FC, useState, useRef } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Send, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDiaryForm } from '@/hooks/useDiaryForm';
import { useDiaryMutation } from '@/hooks/useDiaryMutation';
import { useAuth } from '@/providers/AuthProvider';
import { DailyColor } from '@/types/color';
import { DiaryMood } from '@/types/database';
import { toast } from 'sonner';

interface DiaryWriteClientProps {
  color: DailyColor;
  date: Date;
}

// 감정 옵션 - 더 감성적인 표현
const MOOD_DATA: {
  value: DiaryMood;
  label: string;
  description: string;
  gradient: string;
}[] = [
  {
    value: 'happy',
    label: '행복',
    description: '마음이 따뜻하고 기쁜',
    gradient: 'from-amber-400 to-orange-400',
  },
  {
    value: 'peaceful',
    label: '평온',
    description: '고요하고 차분한',
    gradient: 'from-sky-400 to-cyan-400',
  },
  {
    value: 'grateful',
    label: '감사',
    description: '마음이 충만한',
    gradient: 'from-rose-400 to-pink-400',
  },
  {
    value: 'excited',
    label: '설렘',
    description: '두근거리고 기대되는',
    gradient: 'from-violet-400 to-purple-400',
  },
  {
    value: 'tired',
    label: '피곤',
    description: '지치고 쉬고 싶은',
    gradient: 'from-slate-400 to-gray-400',
  },
  {
    value: 'anxious',
    label: '불안',
    description: '마음이 어수선한',
    gradient: 'from-yellow-400 to-amber-500',
  },
  {
    value: 'sad',
    label: '슬픔',
    description: '마음이 무거운',
    gradient: 'from-blue-400 to-indigo-400',
  },
  {
    value: 'angry',
    label: '화남',
    description: '속상하고 답답한',
    gradient: 'from-red-400 to-rose-500',
  },
];

// 색상에서 대비색 계산
const getContrastColor = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1C1C1C' : '#FFFFFF';
};

export const DiaryWriteClient: FC<DiaryWriteClientProps> = ({ color, date }) => {
  const { user } = useAuth();
  const { form, characterCount, maxCharacters } = useDiaryForm();
  const { saveDiary, isSubmitting } = useDiaryMutation();
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const formattedDate = format(date, 'M월 d일', { locale: ko });
  const dayOfWeek = format(date, 'EEEE', { locale: ko });
  const selectedMood = form.watch('mood');
  const selectedMoodData = MOOD_DATA.find((m) => m.value === selectedMood);

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

    saveDiary({
      content: values.content,
      mood: values.mood,
      date,
      colorIndex: color.index,
      userId: user.id,
    });
  };

  const scrollToContent = () => {
    contentRef.current?.focus();
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen relative">
      {/* 배경 그라데이션 */}
      <div
        className="fixed inset-0 transition-colors duration-1000"
        style={{
          background: `linear-gradient(180deg, ${color.hex}15 0%, transparent 40%, transparent 60%, ${color.hex}08 100%)`,
        }}
      />

      {/* 색상 블롭 효과 */}
      <motion.div
        className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30 pointer-events-none"
        style={{ backgroundColor: color.hex }}
        animate={{
          x: [0, 30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 상단 네비게이션 */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-[500px] mx-auto flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full glass border border-border/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 rounded-full glass border border-border/30 text-sm"
          >
            {formattedDate}
          </motion.div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full glass border border-border/30"
            style={{
              backgroundColor: characterCount > 0 ? color.hex : undefined,
              color: characterCount > 0 ? getContrastColor(color.hex) : undefined,
            }}
            disabled={isSubmitting || characterCount === 0}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="relative z-10 pt-20 pb-32 px-4">
        <div className="max-w-[500px] mx-auto">
          {/* 히어로 섹션 - 색상 소개 */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="min-h-[50vh] flex flex-col items-center justify-center text-center py-12"
          >
            {/* 색상 오브 */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
              className="relative mb-8"
            >
              {/* 글로우 */}
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-50"
                style={{ backgroundColor: color.hex, transform: 'scale(1.3)' }}
              />
              {/* 메인 원 */}
              <motion.div
                className="relative w-32 h-32 rounded-full shadow-float"
                style={{ backgroundColor: color.hex }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* 하이라이트 */}
                <div
                  className="absolute inset-3 rounded-full opacity-30"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 30%, white 0%, transparent 60%)',
                  }}
                />
              </motion.div>
            </motion.div>

            {/* 날짜 & 요일 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <p className="text-sm text-muted-foreground mb-1">{dayOfWeek}</p>
              <h1 className="text-4xl font-serif">{formattedDate}</h1>
            </motion.div>

            {/* 색상 이름 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <h2
                className="text-2xl font-serif mb-1"
                style={{ color: color.hex }}
              >
                {color.nameKo}
              </h2>
              <p className="text-sm text-muted-foreground tracking-widest uppercase">
                {color.nameEn}
              </p>
            </motion.div>

            {/* 색상 설명 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground leading-relaxed max-w-xs mb-8"
            >
              {color.description}
            </motion.p>

            {/* 스크롤 유도 */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={scrollToContent}
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-xs">오늘의 이야기를 들려주세요</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.section>

          {/* 감정 선택 섹션 */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="py-12"
          >
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground mb-2">
                지금 이 순간
              </p>
              <h3 className="text-xl font-serif">어떤 마음인가요?</h3>
            </div>

            {/* 선택된 감정 표시 */}
            <AnimatePresence mode="wait">
              {selectedMoodData ? (
                <motion.button
                  key="selected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setShowMoodPicker(true)}
                  className="w-full p-6 rounded-3xl glass-strong border border-border/30 text-center mb-4"
                >
                  <div
                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${selectedMoodData.gradient} text-white mb-3`}
                  >
                    <span className="text-lg font-medium">
                      {selectedMoodData.label}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {selectedMoodData.description} 하루
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-3">
                    탭하여 변경
                  </p>
                </motion.button>
              ) : (
                <motion.button
                  key="picker"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMoodPicker(true)}
                  className="w-full p-6 rounded-3xl glass border border-dashed border-border/50 text-center"
                >
                  <p className="text-muted-foreground">
                    오늘의 감정을 선택해보세요
                  </p>
                </motion.button>
              )}
            </AnimatePresence>

            {/* 감정 선택 그리드 */}
            <AnimatePresence>
              {showMoodPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {MOOD_DATA.map((mood, index) => (
                      <motion.button
                        key={mood.value}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          form.setValue(
                            'mood',
                            selectedMood === mood.value ? null : mood.value
                          );
                          setShowMoodPicker(false);
                        }}
                        className={`p-4 rounded-2xl text-left transition-all ${
                          selectedMood === mood.value
                            ? 'ring-2 ring-offset-2 glass-strong'
                            : 'glass border border-border/30 hover:border-border'
                        }`}
                        style={{
                          ringColor:
                            selectedMood === mood.value ? color.hex : undefined,
                        }}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mood.gradient} mb-3`}
                        />
                        <p className="font-medium mb-0.5">{mood.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {mood.description}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* 일기 작성 섹션 */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="py-12"
          >
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground mb-2">
                오늘 하루의 이야기
              </p>
              <h3 className="text-xl font-serif">자유롭게 기록하세요</h3>
            </div>

            <div className="rounded-3xl glass-strong border border-border/30 p-6">
              <Textarea
                ref={contentRef}
                placeholder="오늘은 어떤 하루였나요? 기억하고 싶은 순간, 느꼈던 감정, 스쳐간 생각들... 당신의 이야기를 들려주세요."
                className="min-h-[240px] resize-none border-0 bg-transparent p-0 text-base leading-relaxed focus-visible:ring-0 placeholder:text-muted-foreground/50"
                {...form.register('content')}
              />

              {/* 글자 수 & 색상 정보 */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {color.division} · {color.category}
                  </span>
                </div>
                <span
                  className={`text-xs ${
                    characterCount > maxCharacters
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  }`}
                >
                  {characterCount} / {maxCharacters}
                </span>
              </div>
            </div>
          </motion.section>

          {/* 저장 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-8"
          >
            <Button
              className="w-full h-14 text-base rounded-2xl font-medium shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${color.hex} 0%, ${color.hex}dd 100%)`,
                color: getContrastColor(color.hex),
              }}
              disabled={isSubmitting || characterCount === 0}
              onClick={handleSubmit}
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

            <p className="text-center text-xs text-muted-foreground mt-4">
              {color.hex.toUpperCase()} · {color.nameKo}의 하루
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
