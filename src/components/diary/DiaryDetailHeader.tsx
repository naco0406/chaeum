'use client';

import { FC } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ArrowLeft, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DiaryDetailHeaderProps {
  date: Date;
  onEdit: () => void;
  onDelete: () => void;
  contrastColor?: string;
}

export const DiaryDetailHeader: FC<DiaryDetailHeaderProps> = ({
  date,
  onEdit,
  onDelete,
  contrastColor,
}) => {
  const formattedDate = format(date, 'yyyy년 M월 d일', { locale: ko });
  const textColor = contrastColor || 'currentColor';

  return (
    <header className="flex items-center justify-between py-4">
      <Link href="/records">
        <motion.button
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: contrastColor ? `${contrastColor}10` : undefined,
            color: textColor,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
      </Link>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-serif"
        style={{ color: textColor }}
      >
        {formattedDate}
      </motion.h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: contrastColor ? `${contrastColor}10` : undefined,
              color: textColor,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreVertical className="w-5 h-5" />
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            수정하기
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            삭제하기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
