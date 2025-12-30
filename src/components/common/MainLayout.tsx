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
    <div className="min-h-screen ink-gradient hanji-texture">
      <main className={shouldHideNav ? '' : 'pb-28'}>{children}</main>
      {!shouldHideNav && <BottomNavigation />}
    </div>
  );
};
