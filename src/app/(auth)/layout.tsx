'use client';

import { ReactNode, useMemo } from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
}

// 떠다니는 색상 원들
const FloatingCircles = () => {
  const circles = useMemo(() => {
    const colors = [
      'oklch(0.70 0.08 230)', // 담청
      'oklch(0.55 0.18 25)', // 적색
      'oklch(0.75 0.12 145)', // 비취
      'oklch(0.90 0.08 95)', // 송화
      'oklch(0.50 0.12 280)', // 자심
    ];
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      color: colors[i % colors.length],
      size: 100 + Math.random() * 200,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 20 + Math.random() * 15,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: circle.size,
            height: circle.size,
            backgroundColor: circle.color,
            left: `${circle.x}%`,
            top: `${circle.y}%`,
            opacity: 0.15,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{
            duration: circle.duration,
            delay: circle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative ink-gradient hanji-texture">
      <FloatingCircles />

      {/* 테마 색상 그라데이션 */}
      <div
        className="fixed inset-0 pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(ellipse 100% 60% at 50% 0%, var(--theme-color-muted) 0%, transparent 50%)`,
        }}
      />

      {/* 상단 장식 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(var(--theme-color-rgb), 0.08) 0%, transparent 100%)`,
        }}
      />

      {/* 콘텐츠 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-[400px] relative z-10"
      >
        {children}
      </motion.div>

      {/* 하단 장식 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to top, rgba(var(--theme-color-rgb), 0.05) 0%, transparent 100%)`,
        }}
      />
    </div>
  );
};

export default AuthLayout;
