'use client';

import { FC, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { PenLine } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DailyColor } from '@/types/color';
import { createColorPalette } from '@/lib/color-contrast';

interface TodayColorDisplayProps {
  color: DailyColor;
  date: Date;
}

// 숫자를 한글로
const numberToKorean = (num: number): string => {
  const units = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
  const tens = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];
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

// 유기적인 블롭 SVG 패스 생성
const generateBlobPath = (seed: number): string => {
  const points = 6;
  const angleStep = (Math.PI * 2) / points;
  const radius = 40;
  const variance = 15;

  let path = '';
  const controlPoints: { x: number; y: number }[] = [];

  for (let i = 0; i < points; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const r = radius + Math.sin(seed + i * 1.5) * variance;
    controlPoints.push({
      x: 50 + r * Math.cos(angle),
      y: 50 + r * Math.sin(angle),
    });
  }

  path = `M ${controlPoints[0].x} ${controlPoints[0].y}`;

  for (let i = 0; i < points; i++) {
    const current = controlPoints[i];
    const next = controlPoints[(i + 1) % points];
    const cpx = (current.x + next.x) / 2;
    const cpy = (current.y + next.y) / 2;
    path += ` Q ${current.x + (next.x - current.x) * 0.1} ${
      current.y + (next.y - current.y) * 0.1
    } ${cpx} ${cpy}`;
  }

  path += ' Z';
  return path;
};

export const TodayColorDisplay: FC<TodayColorDisplayProps> = ({
  color,
  date,
}) => {
  const formattedDate = format(date, 'M월 d일', { locale: ko });
  const dayOfWeek = format(date, 'EEEE', { locale: ko });
  const dayOfYearKorean = numberToKorean(color.index);

  // HSL 기반 대비색 팔레트 생성 (L <= 20 → 흰색, L > 20 → 검은색)
  const palette = useMemo(() => createColorPalette(color.hex), [color.hex]);
  const contrastColor = palette.contrast;
  const lighterColor = palette.lighter;
  const darkerColor = palette.darker;

  // 마우스/터치 인터랙션
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(smoothY, [0, 1], [5, -5]);
  const rotateY = useTransform(smoothX, [0, 1], [-5, 5]);

  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    setMounted(true);

    // 배경 잘림 방지: body 배경색을 현재 색상으로 설정
    document.documentElement.style.backgroundColor = darkerColor;
    document.body.style.backgroundColor = darkerColor;

    const interval = setInterval(() => {
      setTime((t) => t + 0.02);
    }, 50);
    return () => clearInterval(interval);
  }, [darkerColor]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  // 블롭 패스 생성
  const blobPaths = useMemo(() => {
    return [
      generateBlobPath(1),
      generateBlobPath(2.5),
      generateBlobPath(4),
    ];
  }, []);

  if (!mounted) {
    return <TodayColorDisplaySkeleton />;
  }

  return (
    <div
      className="relative min-h-screen-dvh"
      style={{ backgroundColor: darkerColor }}
      onMouseMove={handleMouseMove}
    >
      {/* 풀스크린 색상 배경 - fixed로 항상 화면 전체 커버 */}
      <motion.div
        className="fixed inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          background: `linear-gradient(180deg, ${color.hex} 0%, ${darkerColor} 100%)`,
        }}
      />

      {/* 유기적인 블롭 레이어들 - 블러 처리로 은은한 그라데이션 효과 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* 큰 배경 블롭 */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute w-[180vw] h-[180vh] -top-1/3 -left-1/3"
          style={{
            opacity: 0.25,
            filter: 'blur(80px)',
            rotateX,
            rotateY,
          }}
        >
          <motion.path
            d={blobPaths[0]}
            fill={lighterColor}
            animate={{
              d: generateBlobPath(time),
            }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </motion.svg>

        {/* 중간 블롭 */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute w-[120vw] h-[120vh] top-1/4 -right-1/3"
          style={{
            opacity: 0.2,
            filter: 'blur(60px)',
          }}
        >
          <motion.path
            d={blobPaths[1]}
            fill={darkerColor}
            animate={{
              d: generateBlobPath(time * 0.8 + 2),
            }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </motion.svg>

        {/* 작은 악센트 블롭 */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute w-[80vw] h-[80vh] bottom-1/4 left-1/4"
          style={{
            opacity: 0.15,
            filter: 'blur(50px)',
          }}
        >
          <motion.path
            d={blobPaths[2]}
            fill={lighterColor}
            animate={{
              d: generateBlobPath(time * 1.2 + 4),
            }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </motion.svg>

        {/* 추가 앰비언트 블롭 - 더 크고 은은하게 */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute w-[100vw] h-[100vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            opacity: 0.12,
            filter: 'blur(100px)',
          }}
        >
          <motion.path
            d={blobPaths[0]}
            fill={contrastColor}
            animate={{
              d: generateBlobPath(time * 0.5 + 6),
            }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </motion.svg>
      </div>

      {/* 노이즈 텍스처 오버레이 */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 min-h-screen-dvh flex flex-col">
        {/* 상단 날짜 */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="px-6 pt-14"
        >
          <div className="max-w-[430px] mx-auto">
            <p
              className="text-sm font-light tracking-widest uppercase"
              style={{ color: contrastColor, opacity: 0.6 }}
            >
              {dayOfWeek}
            </p>
            <h1
              className="text-2xl font-serif mt-1"
              style={{ color: contrastColor }}
            >
              {formattedDate}
            </h1>
          </div>
        </motion.header>

        {/* 중앙 색상 정보 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-[430px] w-full text-center">
            {/* 색상 인덱스 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <p
                className="text-xs tracking-[0.3em] uppercase mb-8"
                style={{ color: contrastColor, opacity: 0.5 }}
              >
                No. {String(color.index).padStart(3, '0')} / 365
              </p>
            </motion.div>

            {/* 색상 이름 - 메인 타이포그래피 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              style={{
                perspective: 1000,
                rotateX,
                rotateY,
              }}
            >
              <h2
                className="text-6xl sm:text-7xl font-serif font-medium leading-tight mb-4"
                style={{ color: contrastColor }}
              >
                {color.nameKo}
              </h2>
              <p
                className="text-lg tracking-[0.2em] uppercase font-light"
                style={{ color: contrastColor, opacity: 0.7 }}
              >
                {color.nameEn}
              </p>
            </motion.div>

            {/* 구분선 */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="w-16 h-px mx-auto my-10"
              style={{ backgroundColor: contrastColor, opacity: 0.3 }}
            />

            {/* 설명 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-lg font-light leading-relaxed max-w-xs mx-auto"
              style={{ color: contrastColor, opacity: 0.8 }}
            >
              {color.description}
            </motion.p>

            {/* 카테고리 태그 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex justify-center gap-3 mt-8"
            >
              <span
                className="px-4 py-2 rounded-full text-xs tracking-wider border"
                style={{
                  color: contrastColor,
                  borderColor: `${contrastColor}30`,
                  backgroundColor: `${contrastColor}10`,
                }}
              >
                {color.division}
              </span>
              <span
                className="px-4 py-2 rounded-full text-xs tracking-wider border"
                style={{
                  color: contrastColor,
                  borderColor: `${contrastColor}30`,
                  backgroundColor: `${contrastColor}10`,
                }}
              >
                {color.category}
              </span>
            </motion.div>
          </div>
        </div>

        {/* 하단 정보 & CTA */}
        <motion.footer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="px-6 pb-32"
        >
          <div className="max-w-[430px] mx-auto">
            {/* 색상 스펙 - 카드 */}
            <div
              className="flex items-center justify-between p-4 rounded-2xl backdrop-blur-md mb-6"
              style={{
                backgroundColor: palette.cardBg,
                border: `1px solid ${palette.cardBorder}`,
              }}
            >
              <div>
                <p
                  className="text-xs uppercase tracking-wider mb-1"
                  style={{ color: contrastColor, opacity: 0.5 }}
                >
                  HEX
                </p>
                <p
                  className="font-mono text-sm"
                  style={{ color: contrastColor }}
                >
                  {color.hex.toUpperCase()}
                </p>
              </div>
              <div className="text-center">
                <p
                  className="text-xs uppercase tracking-wider mb-1"
                  style={{ color: contrastColor, opacity: 0.5 }}
                >
                  RGB
                </p>
                <p
                  className="font-mono text-sm"
                  style={{ color: contrastColor }}
                >
                  {color.rgb.r} {color.rgb.g} {color.rgb.b}
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-xs uppercase tracking-wider mb-1"
                  style={{ color: contrastColor, opacity: 0.5 }}
                >
                  일수
                </p>
                <p
                  className="text-sm"
                  style={{ color: contrastColor }}
                >
                  {dayOfYearKorean}번째
                </p>
              </div>
            </div>

            {/* 일기 쓰기 버튼 */}
            <Link href="/diary/write" className="block">
              <motion.button
                className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-base font-medium transition-all"
                style={{
                  backgroundColor: contrastColor,
                  color: color.hex,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <PenLine className="w-5 h-5" />
                오늘의 이야기를 기록하세요
              </motion.button>
            </Link>

            {/* 스크롤 힌트 */}
            <p
              className="text-center text-xs mt-6"
              style={{ color: contrastColor, opacity: 0.4 }}
            >
              {color.nameKo}의 하루를 시작하세요
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export const TodayColorDisplaySkeleton: FC = () => {
  return (
    <div className="min-h-screen-dvh bg-secondary flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-[430px] flex flex-col items-center">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-4 w-20 mb-8" />
        <Skeleton className="h-20 w-64 mb-4" />
        <Skeleton className="h-6 w-40 mb-10" />
        <Skeleton className="h-px w-16 mb-10" />
        <Skeleton className="h-6 w-full max-w-xs mb-8" />
        <div className="flex gap-3 mb-12">
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
};
