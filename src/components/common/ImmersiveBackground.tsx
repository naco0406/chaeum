'use client';

import { FC, ReactNode, useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { createColorPalette } from '@/lib/color-contrast';

interface ImmersiveBackgroundProps {
  color: string;
  children: ReactNode;
  enableParallax?: boolean;
  enableAnimation?: boolean;
  className?: string;
}

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

export const ImmersiveBackground: FC<ImmersiveBackgroundProps> = ({
  color,
  children,
  enableParallax = true,
  enableAnimation = true,
  className = '',
}) => {
  const palette = useMemo(() => createColorPalette(color), [color]);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(0);

  // 마우스/터치 인터랙션
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const rotateX = useTransform(smoothY, [0, 1], [3, -3]);
  const rotateY = useTransform(smoothX, [0, 1], [-3, 3]);

  useEffect(() => {
    setMounted(true);

    // 배경 잘림 방지: body 배경색을 현재 색상으로 설정
    document.documentElement.style.backgroundColor = palette.darker;
    document.body.style.backgroundColor = palette.darker;

    if (!enableAnimation) return;

    const interval = setInterval(() => {
      setTime((t) => t + 0.02);
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [enableAnimation, palette.darker]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enableParallax) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  // 블롭 패스 생성
  const blobPaths = useMemo(() => {
    return [generateBlobPath(1), generateBlobPath(2.5), generateBlobPath(4)];
  }, []);

  if (!mounted) {
    return (
      <div
        className="min-h-screen-dvh"
        style={{ backgroundColor: palette.darker }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      style={
        {
          '--immersive-color': palette.primary,
          '--immersive-contrast': palette.contrast,
          '--immersive-darker': palette.darker,
          '--immersive-lighter': palette.lighter,
          '--immersive-card-bg': palette.cardBg,
          '--immersive-card-border': palette.cardBorder,
          minHeight: '100dvh',
          backgroundColor: palette.darker,
        } as React.CSSProperties
      }
    >
      {/* 풀스크린 색상 배경 - fixed로 항상 화면 전체 커버 */}
      <motion.div
        className="fixed inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          background: `linear-gradient(180deg, ${palette.primary} 0%, ${palette.darker} 100%)`,
        }}
      />

      {/* 유기적인 블롭 레이어들 - 블러 처리로 은은한 그라데이션 효과 */}
      {enableAnimation && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* 큰 배경 블롭 */}
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute w-[180vw] h-[180vh] -top-1/3 -left-1/3"
            style={{
              opacity: 0.25,
              filter: 'blur(80px)',
              rotateX: enableParallax ? rotateX : 0,
              rotateY: enableParallax ? rotateY : 0,
            }}
          >
            <motion.path
              d={blobPaths[0]}
              fill={palette.lighter}
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
              fill={palette.darker}
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
              fill={palette.lighter}
              animate={{
                d: generateBlobPath(time * 1.2 + 4),
              }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </motion.svg>

          {/* 추가 앰비언트 블롭 */}
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
              fill={palette.contrast}
              animate={{
                d: generateBlobPath(time * 0.5 + 6),
              }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </motion.svg>
        </div>
      )}

      {/* 노이즈 텍스처 오버레이 */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 콘텐츠 */}
      <div className="relative z-10 min-h-screen-dvh">{children}</div>
    </div>
  );
};

// Context로 현재 색상 팔레트 제공
export { createColorPalette };
