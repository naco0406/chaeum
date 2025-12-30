'use client';

import { FC, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/providers/AuthProvider';
import { ImmersiveBackground } from '@/components/common/ImmersiveBackground';
import { BrandHeader } from '@/components/profile/BrandHeader';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UserStats } from '@/components/profile/UserStats';
import { SettingsList } from '@/components/profile/SettingsList';
import { LogoutButton } from '@/components/profile/LogoutButton';
import { getColorByDate } from '@/lib/color-utils';
import { createColorPalette } from '@/lib/color-contrast';

const ProfileSkeleton: FC<{ palette: ReturnType<typeof createColorPalette> }> = ({
  palette,
}) => {
  return (
    <div className="px-4 py-8">
      <div className="max-w-[430px] mx-auto space-y-6">
        <div className="text-center">
          <Skeleton
            className="w-20 h-20 rounded-full mx-auto mb-4"
            style={{ backgroundColor: palette.cardBg }}
          />
          <Skeleton
            className="h-6 w-32 mx-auto mb-2"
            style={{ backgroundColor: palette.cardBg }}
          />
          <Skeleton
            className="h-4 w-48 mx-auto"
            style={{ backgroundColor: palette.cardBg }}
          />
        </div>
        <Skeleton
          className="w-full h-48 rounded-3xl"
          style={{ backgroundColor: palette.cardBg }}
        />
        <Skeleton
          className="w-full h-64 rounded-3xl"
          style={{ backgroundColor: palette.cardBg }}
        />
      </div>
    </div>
  );
};

const ProfilePage: FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // 오늘의 색상
  const todayColor = useMemo(() => getColorByDate(new Date()), []);
  const palette = useMemo(
    () => createColorPalette(todayColor.hex),
    [todayColor.hex]
  );

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <ImmersiveBackground color={todayColor.hex}>
        <ProfileSkeleton palette={palette} />
      </ImmersiveBackground>
    );
  }

  return (
    <ImmersiveBackground color={todayColor.hex}>
      <div className="px-4 pt-4 pb-32">
        <div className="max-w-[430px] mx-auto space-y-4">
          <BrandHeader contrastColor={palette.contrast} />
          <ProfileHeader user={user} contrastColor={palette.contrast} />
          <UserStats contrastColor={palette.contrast} />
          <SettingsList contrastColor={palette.contrast} />
          <LogoutButton contrastColor={palette.contrast} />

          {/* 앱 정보 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs pt-4 space-y-1"
            style={{ color: palette.contrast, opacity: 0.5 }}
          >
            <p className="font-serif text-sm">채움 v1.0.0</p>
            <p>365일 감정 기록 다이어리</p>
          </motion.div>
        </div>
      </div>
    </ImmersiveBackground>
  );
};

export default ProfilePage;
