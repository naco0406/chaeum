'use client';

import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  color: string;
  children: ReactNode;
}

export const AnimatedBackground: FC<AnimatedBackgroundProps> = ({
  color,
  children,
}) => {
  return (
    <div className="relative min-h-screen">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          background: `linear-gradient(
            180deg,
            ${color}15 0%,
            ${color}08 50%,
            transparent 100%
          )`,
        }}
      />
      {children}
    </div>
  );
};
