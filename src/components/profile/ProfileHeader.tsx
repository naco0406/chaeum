'use client';

import { FC } from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileHeaderProps {
  user: User;
  contrastColor?: string;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({
  user,
  contrastColor,
}) => {
  const displayName =
    user.user_metadata?.nickname || user.email?.split('@')[0] || '사용자';
  const initials = displayName.slice(0, 2).toUpperCase();
  const avatarUrl = user.user_metadata?.avatar_url;
  const joinDate = user.created_at
    ? format(parseISO(user.created_at), 'yyyy년 M월 d일', { locale: ko })
    : null;

  const textColor = contrastColor || 'currentColor';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl backdrop-blur-md p-6"
      style={{
        backgroundColor: contrastColor ? `${contrastColor}08` : 'var(--glass-strong)',
        border: contrastColor
          ? `1px solid ${contrastColor}15`
          : '1px solid var(--border-30)',
      }}
    >
      <div className="flex flex-col items-center text-center">
        {/* 아바타 */}
        <div className="relative mb-4">
          <Avatar
            className="w-20 h-20 border-4 shadow-soft"
            style={{
              borderColor: contrastColor ? `${contrastColor}20` : 'var(--background)',
            }}
          >
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
            <AvatarFallback
              className="text-xl font-serif"
              style={{
                backgroundColor: contrastColor ? `${contrastColor}15` : undefined,
                color: textColor,
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* 장식 링 */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-dashed"
            style={{ borderColor: contrastColor ? `${contrastColor}25` : 'var(--theme-color-20)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            initial={{ transform: 'scale(1.3)' }}
          />
        </div>

        {/* 이름 */}
        <h2 className="text-xl font-serif mb-1" style={{ color: textColor }}>
          {displayName}
        </h2>
        <p
          className="text-sm mb-3"
          style={{ color: textColor, opacity: 0.7 }}
        >
          {user.email}
        </p>

        {/* 가입일 */}
        {joinDate && (
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs"
            style={{
              backgroundColor: contrastColor ? `${contrastColor}10` : 'var(--secondary-50)',
              color: textColor,
              opacity: 0.8,
            }}
          >
            <span>{joinDate} 가입</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
