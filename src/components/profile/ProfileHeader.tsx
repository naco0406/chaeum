'use client';

import { FC } from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({ user }) => {
  const displayName =
    user.user_metadata?.nickname || user.email?.split('@')[0] || '사용자';
  const initials = displayName.slice(0, 2).toUpperCase();
  const avatarUrl = user.user_metadata?.avatar_url;
  const joinDate = user.created_at
    ? format(parseISO(user.created_at), 'yyyy년 M월 d일', { locale: ko })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl glass-strong border border-border/30 p-6 shadow-soft"
    >
      <div className="flex flex-col items-center text-center">
        {/* 아바타 */}
        <div className="relative mb-4">
          <Avatar className="w-20 h-20 border-4 border-background shadow-soft">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-xl font-serif">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* 장식 링 */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ transform: 'scale(1.3)' }}
          />
        </div>

        {/* 이름 */}
        <h2 className="text-xl font-serif mb-1">{displayName}</h2>
        <p className="text-sm text-muted-foreground mb-3">{user.email}</p>

        {/* 가입일 */}
        {joinDate && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 text-xs text-muted-foreground">
            <span>{joinDate} 가입</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
