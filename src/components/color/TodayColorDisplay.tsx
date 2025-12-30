'use client';

import { FC, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DailyColor } from '@/types/color';

interface TodayColorDisplayProps {
  color: DailyColor;
  date: Date;
}

const numberToKorean = (num: number): string => {
  const units = [
    '',
    '한',
    '두',
    '세',
    '네',
    '다섯',
    '여섯',
    '일곱',
    '여덟',
    '아홉',
    '열',
  ];
  const tens = [
    '',
    '열',
    '스물',
    '서른',
    '마흔',
    '쉰',
    '예순',
    '일흔',
    '여든',
    '아흔',
  ];
  const hundreds = ['', '백', '이백', '삼백'];

  if (num <= 10) return units[num];
  if (num < 20) return '열' + units[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return tens[ten] + (one > 0 ? units[one] : '');
  }
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  if (remainder === 0) return hundreds[hundred];
  return hundreds[hundred] + numberToKorean(remainder);
};

// 한국적인 명언/글귀
const koreanSayings = [
  '오늘 하루도 고요히 흘러갑니다',
  '마음을 다해 이 순간을 기록하세요',
  '당신의 하루는 어떤 빛깔인가요',
  '고요한 마음으로 하루를 시작하세요',
  '오늘의 감정을 색으로 담아보세요',
  '매일이 새로운 색으로 채워집니다',
  '당신의 이야기가 기다리고 있어요',
  '작은 기록이 큰 추억이 됩니다',
];

// 떠다니는 원 파티클
const FloatingOrbs: FC<{ color: string }> = ({ color }) => {
  const orbs = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      size: 60 + Math.random() * 100,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: orb.size,
            height: orb.size,
            backgroundColor: color,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export const TodayColorDisplay: FC<TodayColorDisplayProps> = ({
  color,
  date,
}) => {
  const formattedDate = format(date, 'M월 d일 EEEE', { locale: ko });
  const dayOfYearKorean = numberToKorean(color.index);

  // 날짜 기반 명언 선택
  const todaySaying = useMemo(() => {
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return koreanSayings[dayOfYear % koreanSayings.length];
  }, [date]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* 배경 효과 */}
      <FloatingOrbs color={color.hex} />

      {/* 상단 그라데이션 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${color.hex}15 0%, transparent 50%)`,
        }}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        <div className="w-full max-w-[430px] flex flex-col items-center">
          {/* 인사말 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm text-muted-foreground mb-2"
          >
            {todaySaying}
          </motion.p>

          {/* 날짜 표시 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-serif mb-1">{formattedDate}</h1>
            <p className="text-sm text-muted-foreground">
              올해의 {dayOfYearKorean} 번째 날
            </p>
          </motion.div>

          {/* 색상 오브 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              delay: 0.3,
            }}
            className="relative mb-10"
          >
            {/* 외부 글로우 */}
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-gentle-pulse"
              style={{ backgroundColor: color.hex, transform: 'scale(1.5)' }}
            />

            {/* 메인 색상 원 */}
            <motion.div
              className="relative w-40 h-40 rounded-full shadow-float cursor-pointer"
              style={{ backgroundColor: color.hex }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              animate={{ y: [0, -8, 0] }}
              transition={{
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            >
              {/* 내부 하이라이트 */}
              <div
                className="absolute inset-4 rounded-full opacity-30"
                style={{
                  background: `radial-gradient(circle at 30% 30%, white 0%, transparent 60%)`,
                }}
              />
            </motion.div>

            {/* 회전하는 장식 링 */}
            <motion.div
              className="absolute inset-0 rounded-full border border-dashed opacity-20 animate-slow-spin"
              style={{
                borderColor: color.hex,
                transform: 'scale(1.4)',
              }}
            />
          </motion.div>

          {/* 색상 이름 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-6"
          >
            <h2 className="text-4xl font-serif mb-2">{color.nameKo}</h2>
            <p className="text-lg text-muted-foreground font-light tracking-wide">
              {color.nameEn}
            </p>
          </motion.div>

          {/* 뱃지 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-2 mb-8"
          >
            <span
              className="px-4 py-1.5 rounded-full text-xs font-medium glass border border-border/50"
              style={{ color: color.hex }}
            >
              {color.division}
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-medium glass border border-border/50 text-muted-foreground">
              {color.category}
            </span>
          </motion.div>

          {/* 설명 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center text-muted-foreground leading-relaxed max-w-xs mb-12"
          >
            {color.description}
          </motion.p>

          {/* 일기 쓰기 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="w-full"
          >
            <Link href="/diary/write" className="block">
              <Button
                className="w-full h-14 text-base gap-3 rounded-2xl shadow-soft-md hover:shadow-soft-lg transition-all group"
                size="lg"
                style={{
                  background: `linear-gradient(135deg, ${color.hex} 0%, ${color.hex}dd 100%)`,
                }}
              >
                <Sparkles className="w-5 h-5" />
                오늘의 감정을 기록하세요
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 하단 색상 정보 바 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="px-6 pb-32"
      >
        <div className="w-full max-w-[430px] mx-auto">
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl glass border border-border/30">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg"
                style={{ backgroundColor: color.hex }}
              />
              <div>
                <p className="text-xs text-muted-foreground">오늘의 색</p>
                <p className="text-sm font-medium">{color.hex.toUpperCase()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">RGB</p>
              <p className="text-sm font-mono">
                {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const TodayColorDisplaySkeleton: FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[430px] flex flex-col items-center">
        <Skeleton className="h-4 w-48 mb-2" />
        <Skeleton className="h-10 w-40 mb-1" />
        <Skeleton className="h-4 w-32 mb-10" />
        <Skeleton className="w-40 h-40 rounded-full mb-10" />
        <Skeleton className="h-12 w-32 mb-2" />
        <Skeleton className="h-6 w-24 mb-6" />
        <div className="flex gap-2 mb-8">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-64 mb-2" />
        <Skeleton className="h-4 w-48 mb-12" />
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
};
