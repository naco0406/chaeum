import { MainLayout } from '@/components/common/MainLayout';

interface MainRouteLayoutProps {
  children: React.ReactNode;
}

export default function MainRouteLayout({ children }: MainRouteLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
