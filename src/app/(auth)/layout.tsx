'use client';

import { ReactNode, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ImmersiveBackground } from '@/components/common/ImmersiveBackground';
import { getColorByDate } from '@/lib/color-utils';
import { createColorPalette } from '@/lib/color-contrast';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  // 오늘의 색상
  const todayColor = useMemo(() => getColorByDate(new Date()), []);
  const palette = useMemo(
    () => createColorPalette(todayColor.hex),
    [todayColor.hex]
  );

  return (
    <ImmersiveBackground color={todayColor.hex} enableAnimation={true}>
      <div className="flex flex-col items-center justify-center px-4 py-8">
        {/* 콘텐츠 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-[400px] relative z-10"
          style={
            {
              '--auth-contrast': palette.contrast,
              '--auth-primary': palette.primary,
              '--auth-card-bg': palette.cardBg,
              '--auth-card-border': palette.cardBorder,
            } as React.CSSProperties
          }
        >
          {children}
        </motion.div>
      </div>
    </ImmersiveBackground>
  );
};

export default AuthLayout;
