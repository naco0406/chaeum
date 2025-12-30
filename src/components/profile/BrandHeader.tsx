'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BrandHeaderProps {
  contrastColor?: string;
}

export const BrandHeader: FC<BrandHeaderProps> = ({ contrastColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  const textColor = contrastColor || 'currentColor';

  // 은은한 색상 배열 (한국적인 전통색 느낌)
  const koreanColors = [
    '#C9A89A', // 연분홍
    '#B8A99A', // 밤색
    '#A5B8A0', // 청자색
    '#9DB4C0', // 청색
    '#B5A6C9', // 자주
    '#C9B8A0', // 황토
    '#A0B5B8', // 옥색
  ];

  return (
    <Link href="/about">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative py-8 cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* 메인 타이틀 */}
        <div className="relative text-center">
          {/* 채(彩)움 타이틀 */}
          <motion.div
            className="flex items-baseline justify-center"
            animate={{ scale: isHovered ? 1.02 : 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* 채 */}
            <motion.span
              className="text-5xl font-serif tracking-tight"
              style={{ color: textColor }}
              animate={{ y: isHovered ? -3 : 0 }}
              transition={{ duration: 0.4, delay: 0 }}
            >
              채
            </motion.span>

            {/* (彩) - 한자 강조 */}
            <motion.span
              className="text-2xl font-serif mx-1 relative"
              style={{ opacity: isHovered ? 0.9 : 0.5 }}
              animate={{ y: isHovered ? -5 : 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <span style={{ color: textColor }}>(</span>
              <motion.span
                className="font-serif"
                animate={isHovered ? { color: koreanColors } : { color: textColor }}
                transition={isHovered ? {
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                } : { duration: 0.4 }}
              >
                彩
              </motion.span>
              <span style={{ color: textColor }}>)</span>
            </motion.span>

            {/* 움 */}
            <motion.span
              className="text-5xl font-serif tracking-tight"
              style={{ color: textColor }}
              animate={{ y: isHovered ? -3 : 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              움
            </motion.span>
          </motion.div>

          {/* 부제 - 한국적인 문구 */}
          <motion.p
            className="text-sm font-serif mt-4 tracking-widest"
            style={{ color: textColor }}
            animate={{ opacity: isHovered ? 0.7 : 0.4 }}
            transition={{ duration: 0.3 }}
          >
            삼백육십오 빛깔의 하루
          </motion.p>

          {/* 하단 장식선 */}
          <motion.div
            className="flex justify-center items-center gap-3 mt-5"
            animate={{ opacity: isHovered ? 0.6 : 0.3 }}
          >
            <motion.div
              className="h-px w-12"
              style={{ backgroundColor: textColor }}
              animate={{ scaleX: isHovered ? 1.2 : 1 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: textColor }}
              animate={{ scale: isHovered ? 1.3 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="h-px w-12"
              style={{ backgroundColor: textColor }}
              animate={{ scaleX: isHovered ? 1.2 : 1 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>

          {/* 클릭 유도 */}
          <motion.p
            className="text-xs mt-4 tracking-wider"
            style={{ color: textColor }}
            animate={{ opacity: isHovered ? 0.6 : 0 }}
            transition={{ duration: 0.3 }}
          >
            이야기 보기
          </motion.p>
        </div>
      </motion.div>
    </Link>
  );
};
