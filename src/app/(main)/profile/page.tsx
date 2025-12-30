'use client';

import { FC, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const LoginPrompt: FC<{ palette: ReturnType<typeof createColorPalette> }> = ({
  palette,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[430px] w-full text-center space-y-8"
      >
        {/* 카드 */}
        <div
          className="p-8 rounded-3xl backdrop-blur-md"
          style={{
            backgroundColor: palette.cardBg,
            border: `1px solid ${palette.cardBorder}`,
          }}
        >
          {/* 아이콘 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative inline-block mb-6"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
              style={{
                backgroundColor: palette.cardBg,
                border: `1px solid ${palette.cardBorder}`,
              }}
            >
              <User className="w-12 h-12" style={{ color: palette.contrast }} />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles
                className="w-6 h-6"
                style={{ color: palette.contrast, opacity: 0.6 }}
              />
            </motion.div>
          </motion.div>

          {/* 텍스트 */}
          <div className="space-y-2 mb-8">
            <h1
              className="text-2xl font-serif"
              style={{ color: palette.contrast }}
            >
              로그인이 필요합니다
            </h1>
            <p style={{ color: palette.contrast, opacity: 0.7 }}>
              일기를 저장하고 관리하려면 로그인해주세요.
            </p>
          </div>

          {/* 버튼 */}
          <div className="space-y-3">
            <Button
              className="w-full h-12 rounded-xl text-base"
              style={{
                backgroundColor: palette.contrast,
                color: palette.primary,
              }}
              onClick={() => router.push('/login')}
            >
              로그인
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl text-base"
              style={{
                borderColor: palette.cardBorder,
                color: palette.contrast,
                backgroundColor: 'transparent',
              }}
              onClick={() => router.push('/signup')}
            >
              회원가입
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProfilePage: FC = () => {
  const { user, isLoading } = useAuth();

  // 오늘의 색상
  const todayColor = useMemo(() => getColorByDate(new Date()), []);
  const palette = useMemo(
    () => createColorPalette(todayColor.hex),
    [todayColor.hex]
  );

  if (isLoading) {
    return (
      <ImmersiveBackground color={todayColor.hex}>
        <ProfileSkeleton palette={palette} />
      </ImmersiveBackground>
    );
  }

  if (!user) {
    return (
      <ImmersiveBackground color={todayColor.hex}>
        <LoginPrompt palette={palette} />
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
