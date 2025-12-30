'use client';

import { FC } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Calendar, User, LucideIcon, PenLine } from 'lucide-react';

interface NavItemData {
  href: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItemData[] = [
  { href: '/', icon: Home, label: '오늘' },
  { href: '/calendar', icon: Calendar, label: '캘린더' },
  { href: '/profile', icon: User, label: '마이' },
];

export const BottomNavigation: FC = () => {
  const pathname = usePathname();

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
        <div className="flex items-center gap-1 px-2 py-2 rounded-full glass-strong border border-border/50 shadow-float">
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
                  className={`relative flex items-center justify-center w-12 h-11 rounded-full transition-colors ${
                    active
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {/* 활성 상태 배경 */}
                  {active && (
                    <motion.div
                      layoutId="nav-active-bg"
                      className="absolute inset-0 bg-primary rounded-full"
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
          <div className="w-px h-6 bg-border/50 mx-1" />

          {/* 일기 쓰기 버튼 */}
          <Link href="/diary/write">
            <motion.div
              className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <PenLine className="w-5 h-5" strokeWidth={2.5} />
              {/* 글로우 효과 */}
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg -z-10" />
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </nav>
  );
};
