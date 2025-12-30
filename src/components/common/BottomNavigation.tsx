'use client';

import { FC, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Calendar, User, LucideIcon, PenLine, BookOpen } from 'lucide-react';
import { getColorByDate, getDayOfYear } from '@/lib/color-utils';
import { createColorPalette } from '@/lib/color-contrast';
import { useTodayDiary } from '@/hooks/useTodayDiary';
import { useLayout } from '@/contexts/LayoutContext';

interface NavItemData {
  href: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItemData[] = [
  { href: '/', icon: Home, label: '오늘' },
  { href: '/records', icon: Calendar, label: '기록' },
  { href: '/profile', icon: User, label: '마이' },
];

export const BottomNavigation: FC = () => {
  const pathname = usePathname();

  const todayColor = useMemo(() => getColorByDate(new Date()), []);
  const palette = useMemo(
    () => createColorPalette(todayColor.hex),
    [todayColor.hex]
  );

  // 오늘 일기 존재 여부 확인
  const { hasTodayDiary, todayString } = useTodayDiary();
  const { layoutMode } = useLayout();

  // 레이아웃 모드에 따른 일기 상세 링크
  const todayIndex = getDayOfYear(new Date());
  const diaryViewHref = layoutMode === 'palette'
    ? `/color/${todayIndex}`
    : `/diary/${todayString}`;

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
      }}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.2,
        }}
        className="pointer-events-auto"
      >
        <div
          className="flex items-center gap-1 px-2 py-2 rounded-full backdrop-blur-xl shadow-lg"
          style={{
            backgroundColor: palette.navBg,
            border: `1px solid ${palette.cardBorder}`,
          }}
        >
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center justify-center"
              >
                <motion.div
                  className="relative flex items-center justify-center w-12 h-11 rounded-full transition-colors"
                  style={{
                    color: active ? '#ffffff' : palette.navText,
                  }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {/* 활성 상태 배경 */}
                  {active && (
                    <motion.div
                      layoutId="nav-active-bg"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: palette.cardBg }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* 아이콘 */}
                  <motion.div
                    className="relative z-10"
                    style={{
                      opacity: active ? 1 : 0.7,
                    }}
                    animate={active ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                  </motion.div>
                </motion.div>
              </Link>
            );
          })}

          {/* 구분선 */}
          <div
            className="w-px h-6 mx-1"
            style={{ backgroundColor: palette.navTextMuted }}
          />

          {/* 일기 쓰기/보기 버튼 */}
          <Link href={hasTodayDiary ? diaryViewHref : '/diary/write'}>
            <motion.div
              className="relative flex items-center justify-center w-11 h-11 rounded-full shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${todayColor.hex} 0%, ${palette.darker} 100%)`,
                color: palette.contrast,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {hasTodayDiary ? (
                <BookOpen className="w-5 h-5" strokeWidth={2.5} />
              ) : (
                <PenLine className="w-5 h-5" strokeWidth={2.5} />
              )}
              {/* 글로우 효과 */}
              <div
                className="absolute inset-0 rounded-full blur-lg -z-10 opacity-40"
                style={{ backgroundColor: todayColor.hex }}
              />
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </nav>
  );
};
