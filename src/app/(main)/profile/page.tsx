'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/providers/AuthProvider';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UserStats } from '@/components/profile/UserStats';
import { SettingsList } from '@/components/profile/SettingsList';
import { LogoutButton } from '@/components/profile/LogoutButton';

const ProfileSkeleton: FC = () => {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-[430px] mx-auto space-y-6">
        <div className="text-center">
          <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
        <Skeleton className="w-full h-48 rounded-3xl" />
        <Skeleton className="w-full h-64 rounded-3xl" />
      </div>
    </div>
  );
};

const LoginPrompt: FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[430px] w-full text-center space-y-8"
      >
        {/* 아이콘 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative inline-block"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center mx-auto">
            <User className="w-12 h-12 text-muted-foreground" />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-6 h-6 text-primary/60" />
          </motion.div>
        </motion.div>

        {/* 텍스트 */}
        <div className="space-y-2">
          <h1 className="text-2xl font-serif">로그인이 필요합니다</h1>
          <p className="text-muted-foreground">
            일기를 저장하고 관리하려면 로그인해주세요.
          </p>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <Button
            className="w-full h-12 rounded-xl text-base"
            onClick={() => router.push('/login')}
          >
            로그인
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl text-base"
            onClick={() => router.push('/signup')}
          >
            회원가입
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

const ProfilePage: FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return <LoginPrompt />;
  }

  return (
    <div className="min-h-screen px-4 pt-6 pb-8">
      <div className="max-w-[430px] mx-auto space-y-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-2"
        >
          <p className="text-sm text-muted-foreground mb-1">나의 공간</p>
          <h1 className="text-2xl font-serif">마이페이지</h1>
        </motion.div>

        <ProfileHeader user={user} />
        <UserStats />
        <SettingsList />
        <LogoutButton />

        {/* 앱 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground pt-4 space-y-1"
        >
          <p className="font-serif text-sm">채움 v1.0.0</p>
          <p>365일 감정 기록 다이어리</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
