'use client';

import { FC, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  PenLine,
  Trash2,
  Edit3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteDiaryDialog } from '@/components/diary/DeleteDiaryDialog';
import { useDiary } from '@/hooks/useDiary';
import { useDeleteDiary } from '@/hooks/useDeleteDiary';
import { getColorByIndex } from '@/lib/color-utils';
import { createColorPalette } from '@/lib/color-contrast';

interface ColorDetailProps {
  colorIndex: number;
}

export const ColorDetail: FC<ColorDetailProps> = ({ colorIndex }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const date = new Date(currentYear, 0, colorIndex);
  const dateString = format(date, 'yyyy-MM-dd');
  const today = new Date();
  const isToday =
    date.toDateString() === today.toDateString() &&
    date.getFullYear() === today.getFullYear();
  const isFuture = date > today;

  const color = useMemo(() => getColorByIndex(colorIndex), [colorIndex]);
  const palette = useMemo(() => createColorPalette(color.hex), [color.hex]);

  const { diary, isLoading } = useDiary(dateString);
  const { deleteDiary, isDeleting } = useDeleteDiary();

  // 마우스 패럴랙스
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const rotateX = useTransform(smoothY, [0, 1], [3, -3]);
  const rotateY = useTransform(smoothX, [0, 1], [-3, 3]);

  useEffect(() => {
    setMounted(true);
    document.documentElement.style.backgroundColor = palette.darker;
    document.body.style.backgroundColor = palette.darker;
  }, [palette.darker]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleEdit = () => {
    router.push(`/diary/write?date=${dateString}&edit=true`);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (diary) {
      deleteDiary(diary.id);
    }
  };

  const prevIndex = colorIndex > 1 ? colorIndex - 1 : null;
  const nextIndex = colorIndex < 365 ? colorIndex + 1 : null;

  if (!mounted) {
    return (
      <div
        className="min-h-screen-dvh"
        style={{ backgroundColor: palette.darker }}
      />
    );
  }

  return (
    <div
      className="min-h-screen-dvh relative overflow-hidden"
      style={{ backgroundColor: palette.darker }}
      onMouseMove={handleMouseMove}
    >
      {/* 풀스크린 배경 */}
      <motion.div
        className="fixed inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          background: `linear-gradient(180deg, ${color.hex} 0%, ${palette.darker} 100%)`,
        }}
      />

      {/* 앰비언트 글로우 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[150vw] h-[150vh] -top-1/4 -left-1/4 rounded-full blur-[120px]"
          style={{
            backgroundColor: color.hex,
            opacity: 0.15,
            rotateX,
            rotateY,
          }}
        />
      </div>

      {/* 노이즈 텍스처 */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 콘텐츠 */}
      <div className="relative z-10 min-h-screen-dvh flex flex-col">
        {/* 상단 네비게이션 - 고정 */}
        <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-14 pb-4 backdrop-blur-md">
          <div className="max-w-[500px] mx-auto flex items-center justify-between">
            <Link href="/records">
              <motion.button
                className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md"
                style={{
                  backgroundColor: palette.cardBg,
                  border: `1px solid ${palette.cardBorder}`,
                  color: palette.contrast,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>

            {/* 색상 인덱스 네비게이션 */}
            <div className="flex items-center gap-2">
              {prevIndex && (
                <Link href={`/color/${prevIndex}`}>
                  <motion.button
                    className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md"
                    style={{
                      backgroundColor: palette.cardBg,
                      border: `1px solid ${palette.cardBorder}`,
                      color: palette.contrast,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.button>
                </Link>
              )}

              <div
                className="px-4 py-2 rounded-full text-sm font-mono"
                style={{
                  backgroundColor: palette.cardBg,
                  border: `1px solid ${palette.cardBorder}`,
                  color: palette.contrast,
                }}
              >
                {String(colorIndex).padStart(3, '0')} / 365
              </div>

              {nextIndex && (
                <Link href={`/color/${nextIndex}`}>
                  <motion.button
                    className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md"
                    style={{
                      backgroundColor: palette.cardBg,
                      border: `1px solid ${palette.cardBorder}`,
                      color: palette.contrast,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              )}
            </div>

            <div className="w-11" />
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 px-4 pb-32 pt-32">
          <div className="max-w-[500px] mx-auto">
            {/* 매거진 스타일 색상 헤더 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-10"
            >
              {/* 큰 색상 원 */}
              <motion.div
                className="w-32 h-32 rounded-full mx-auto mb-8 shadow-2xl"
                style={{
                  backgroundColor: color.hex,
                  boxShadow: `0 20px 60px ${color.hex}50`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              />

              {/* 색상 이름 - 대형 타이포그래피 */}
              <motion.div
                style={{ perspective: 1000, rotateX, rotateY }}
              >
                <h1
                  className="text-5xl sm:text-6xl font-serif font-medium mb-3"
                  style={{ color: palette.contrast }}
                >
                  {color.nameKo}
                </h1>
                <p
                  className="text-lg tracking-[0.2em] uppercase"
                  style={{ color: palette.contrast, opacity: 0.6 }}
                >
                  {color.nameEn}
                </p>
              </motion.div>
            </motion.div>

            {/* 색상 정보 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl backdrop-blur-md p-6 mb-6"
              style={{
                backgroundColor: palette.cardBg,
                border: `1px solid ${palette.cardBorder}`,
              }}
            >
              {/* 날짜 */}
              <div className="text-center mb-6">
                <p
                  className="text-xs tracking-widest uppercase mb-1"
                  style={{ color: palette.contrast, opacity: 0.5 }}
                >
                  {isToday ? '오늘' : isFuture ? '다가올 날' : '지난 날'}
                </p>
                <p
                  className="text-xl font-serif"
                  style={{ color: palette.contrast }}
                >
                  {format(date, 'M월 d일 EEEE', { locale: ko })}
                </p>
              </div>

              {/* 구분선 */}
              <div
                className="h-px w-16 mx-auto mb-6"
                style={{ backgroundColor: `${palette.contrast}20` }}
              />

              {/* 설명 */}
              <p
                className="text-center text-lg leading-relaxed mb-6"
                style={{ color: palette.contrast, opacity: 0.8 }}
              >
                {color.description}
              </p>

              {/* 태그 */}
              <div className="flex justify-center gap-3 mb-6">
                {[color.division, color.category].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full text-xs tracking-wider"
                    style={{
                      backgroundColor: `${palette.contrast}10`,
                      color: palette.contrast,
                      border: `1px solid ${palette.contrast}20`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 색상 스펙 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: palette.contrast, opacity: 0.5 }}
                  >
                    HEX
                  </p>
                  <p
                    className="font-mono text-sm"
                    style={{ color: palette.contrast }}
                  >
                    {color.hex.toUpperCase()}
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: palette.contrast, opacity: 0.5 }}
                  >
                    RGB
                  </p>
                  <p
                    className="font-mono text-sm"
                    style={{ color: palette.contrast }}
                  >
                    {color.rgb.r} {color.rgb.g} {color.rgb.b}
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: palette.contrast, opacity: 0.5 }}
                  >
                    NO.
                  </p>
                  <p
                    className="font-mono text-sm"
                    style={{ color: palette.contrast }}
                  >
                    {colorIndex}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 일기 섹션 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {isLoading ? (
                <div
                  className="rounded-3xl backdrop-blur-md p-6 animate-pulse"
                  style={{
                    backgroundColor: palette.cardBg,
                    border: `1px solid ${palette.cardBorder}`,
                  }}
                >
                  <div
                    className="h-4 w-1/3 rounded mb-4"
                    style={{ backgroundColor: `${palette.contrast}20` }}
                  />
                  <div
                    className="h-4 w-full rounded mb-2"
                    style={{ backgroundColor: `${palette.contrast}10` }}
                  />
                  <div
                    className="h-4 w-2/3 rounded"
                    style={{ backgroundColor: `${palette.contrast}10` }}
                  />
                </div>
              ) : diary ? (
                /* 일기 있음 */
                <div
                  className="rounded-3xl backdrop-blur-md p-6"
                  style={{
                    backgroundColor: palette.cardBg,
                    border: `1px solid ${palette.cardBorder}`,
                  }}
                >
                  {/* 일기 헤더 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{
                          backgroundColor: `${palette.contrast}15`,
                          color: palette.contrast,
                        }}
                      >
                        {diary.mood === 'happy' && '😊'}
                        {diary.mood === 'peaceful' && '😌'}
                        {diary.mood === 'grateful' && '🙏'}
                        {diary.mood === 'excited' && '🤩'}
                        {diary.mood === 'tired' && '😫'}
                        {diary.mood === 'anxious' && '😰'}
                        {diary.mood === 'sad' && '😢'}
                        {diary.mood === 'angry' && '😠'}
                        {!diary.mood && '📝'}
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: palette.contrast }}
                      >
                        오늘의 기록
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={handleEdit}
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `${palette.contrast}10`,
                          color: palette.contrast,
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={handleDelete}
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `${palette.contrast}10`,
                          color: palette.contrast,
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* 일기 내용 */}
                  <p
                    className="text-base leading-relaxed whitespace-pre-wrap"
                    style={{ color: palette.contrast }}
                  >
                    {diary.content}
                  </p>

                  {/* 작성 시간 */}
                  <p
                    className="text-xs mt-4"
                    style={{ color: palette.contrast, opacity: 0.5 }}
                  >
                    {format(new Date(diary.createdAt), 'M월 d일 HH:mm', {
                      locale: ko,
                    })}
                    에 기록됨
                  </p>
                </div>
              ) : isFuture ? (
                /* 미래 날짜 */
                <div
                  className="rounded-3xl backdrop-blur-md p-8 text-center"
                  style={{
                    backgroundColor: palette.cardBg,
                    border: `1px solid ${palette.cardBorder}`,
                  }}
                >
                  <p
                    className="text-lg mb-2"
                    style={{ color: palette.contrast, opacity: 0.7 }}
                  >
                    아직 오지 않은 날이에요
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: palette.contrast, opacity: 0.5 }}
                  >
                    {color.nameKo}의 날이 오면 기록해보세요
                  </p>
                </div>
              ) : (
                /* 일기 없음 */
                <div
                  className="rounded-3xl backdrop-blur-md p-8 text-center"
                  style={{
                    backgroundColor: palette.cardBg,
                    border: `1px solid ${palette.cardBorder}`,
                  }}
                >
                  <p
                    className="text-lg mb-4"
                    style={{ color: palette.contrast, opacity: 0.7 }}
                  >
                    이 날의 이야기가 비어있어요
                  </p>
                  <Link href={`/diary/write?date=${dateString}`}>
                    <Button
                      className="gap-2"
                      style={{
                        backgroundColor: palette.contrast,
                        color: color.hex,
                      }}
                    >
                      <PenLine className="w-4 h-4" />
                      {isToday ? '오늘의 이야기 기록하기' : '이 날의 이야기 기록하기'}
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>

      <DeleteDiaryDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
