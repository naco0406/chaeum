'use client';

import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { BottomNavigation } from '@/components/common/BottomNavigation';

interface MainLayoutProps {
  children: ReactNode;
}

const HIDE_NAV_PATHS = ['/diary/write', '/login', '/signup'];

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const shouldHideNav = HIDE_NAV_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen ink-gradient hanji-texture relative overflow-hidden">
      {/* 테마 색상 배경 그라데이션 */}
      <div
        className="fixed inset-0 pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -10%, var(--theme-color-muted) 0%, transparent 50%)`,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 100% 100%, var(--theme-color-subtle) 0%, transparent 40%)`,
        }}
      />
      <main className={`relative z-10 ${shouldHideNav ? '' : 'pb-28'}`}>
        {children}
      </main>
      {!shouldHideNav && <BottomNavigation />}
    </div>
  );
};
