'use client';

import { FC, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PenLine } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ImmersiveBackground } from '@/components/common/ImmersiveBackground';
import { DiaryDetailHeader } from '@/components/diary/DiaryDetailHeader';
import { DiaryContent } from '@/components/diary/DiaryContent';
import { DiaryNavigation } from '@/components/diary/DiaryNavigation';
import { DeleteDiaryDialog } from '@/components/diary/DeleteDiaryDialog';
import { useDiary } from '@/hooks/useDiary';
import { useDeleteDiary } from '@/hooks/useDeleteDiary';
import { getColorByDate } from '@/lib/color-utils';
import { createColorPalette } from '@/lib/color-contrast';

interface DiaryDetailProps {
  dateString: string;
}

export const DiaryDetail: FC<DiaryDetailProps> = ({ dateString }) => {
  const router = useRouter();
  const date = new Date(dateString);
  const color = getColorByDate(date);
  const palette = useMemo(() => createColorPalette(color.hex), [color.hex]);

  const { diary, isLoading, error } = useDiary(dateString);
  const { deleteDiary, isDeleting } = useDeleteDiary();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    router.push(`/diary/write?date=${dateString}&edit=true`);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (diary) {
      deleteDiary(diary.id);
    }
  };

  if (isLoading) {
    return (
      <ImmersiveBackground color={color.hex}>
        <DiaryDetailSkeleton palette={palette} />
      </ImmersiveBackground>
    );
  }

  if (error) {
    return (
      <ImmersiveBackground color={color.hex}>
        <div className="flex items-center justify-center px-4 py-20">
          <div
            className="text-center space-y-4 p-8 rounded-3xl backdrop-blur-md"
            style={{
              backgroundColor: palette.cardBg,
              border: `1px solid ${palette.cardBorder}`,
            }}
          >
            <p style={{ color: palette.contrast, opacity: 0.7 }}>
              일기를 불러올 수 없습니다.
            </p>
            <Link href="/calendar">
              <Button
                variant="outline"
                style={{
                  borderColor: palette.cardBorder,
                  color: palette.contrast,
                }}
              >
                캘린더로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      </ImmersiveBackground>
    );
  }

  if (!diary) {
    return (
      <ImmersiveBackground color={color.hex}>
        <div className="flex flex-col px-4">
          <div className="w-full max-w-[430px] mx-auto flex flex-col flex-1">
            <DiaryDetailHeader
              date={date}
              onEdit={() => {}}
              onDelete={() => {}}
              contrastColor={palette.contrast}
            />

            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              {/* 색상 정보 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-24 h-24 rounded-full shadow-lg"
                style={{ backgroundColor: color.hex }}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h2
                  className="text-2xl font-serif mb-2"
                  style={{ color: palette.contrast }}
                >
                  {color.nameKo}
                </h2>
                <p
                  className="text-sm tracking-widest uppercase"
                  style={{ color: palette.contrast, opacity: 0.7 }}
                >
                  {color.nameEn}
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ color: palette.contrast, opacity: 0.6 }}
              >
                이 날의 일기가 없습니다.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href={`/diary/write?date=${dateString}`}>
                  <Button
                    className="gap-2"
                    style={{
                      backgroundColor: palette.contrast,
                      color: color.hex,
                    }}
                  >
                    <PenLine className="w-4 h-4" />
                    일기 쓰기
                  </Button>
                </Link>
              </motion.div>
            </div>

            <DiaryNavigation
              currentDate={date}
              contrastColor={palette.contrast}
            />
          </div>
        </div>
      </ImmersiveBackground>
    );
  }

  return (
    <ImmersiveBackground color={color.hex}>
      <div className="flex flex-col px-4 pb-4">
        <div className="w-full max-w-[430px] mx-auto flex flex-col flex-1">
          <DiaryDetailHeader
            date={date}
            onEdit={handleEdit}
            onDelete={handleDelete}
            contrastColor={palette.contrast}
          />

          <div className="flex-1 space-y-6">
            {/* 색상 정보 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4"
            >
              <div
                className="w-16 h-16 rounded-full shadow-soft"
                style={{ backgroundColor: color.hex }}
              />
              <div className="space-y-1">
                <h2
                  className="text-xl font-serif"
                  style={{ color: palette.contrast }}
                >
                  {color.nameKo}
                </h2>
                <p
                  className="text-sm font-serif"
                  style={{ color: palette.contrast, opacity: 0.7 }}
                >
                  {color.nameEn}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2"
            >
              {[color.division, color.category].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: `${palette.contrast}10`,
                    color: palette.contrast,
                    border: `1px solid ${palette.contrast}20`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* 일기 내용 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DiaryContent diary={diary} contrastColor={palette.contrast} />
            </motion.div>
          </div>

          <DiaryNavigation
            currentDate={date}
            contrastColor={palette.contrast}
          />
        </div>
      </div>

      <DeleteDiaryDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </ImmersiveBackground>
  );
};

const DiaryDetailSkeleton: FC<{
  palette: ReturnType<typeof createColorPalette>;
}> = ({ palette }) => {
  return (
    <div className="px-4 py-4">
      <div className="w-full max-w-[430px] mx-auto space-y-6">
        {/* 헤더 스켈레톤 */}
        <div className="flex items-center justify-between py-4">
          <Skeleton
            className="w-10 h-10 rounded-full"
            style={{ backgroundColor: palette.cardBg }}
          />
          <Skeleton
            className="w-32 h-6"
            style={{ backgroundColor: palette.cardBg }}
          />
          <Skeleton
            className="w-10 h-10 rounded-full"
            style={{ backgroundColor: palette.cardBg }}
          />
        </div>

        {/* 색상 정보 스켈레톤 */}
        <div className="flex items-center gap-4">
          <Skeleton
            className="w-16 h-16 rounded-full"
            style={{ backgroundColor: palette.cardBg }}
          />
          <div className="space-y-2">
            <Skeleton
              className="w-24 h-6"
              style={{ backgroundColor: palette.cardBg }}
            />
            <Skeleton
              className="w-32 h-4"
              style={{ backgroundColor: palette.cardBg }}
            />
          </div>
        </div>

        {/* 뱃지 스켈레톤 */}
        <div className="flex gap-2">
          <Skeleton
            className="w-16 h-6 rounded-full"
            style={{ backgroundColor: palette.cardBg }}
          />
          <Skeleton
            className="w-16 h-6 rounded-full"
            style={{ backgroundColor: palette.cardBg }}
          />
        </div>

        {/* 내용 스켈레톤 */}
        <div
          className="rounded-3xl p-5 space-y-4"
          style={{
            backgroundColor: palette.cardBg,
            border: `1px solid ${palette.cardBorder}`,
          }}
        >
          <div className="flex items-center gap-2">
            <Skeleton
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: palette.cardBg }}
            />
            <Skeleton
              className="w-16 h-4"
              style={{ backgroundColor: palette.cardBg }}
            />
          </div>
          <div className="space-y-2">
            <Skeleton
              className="w-full h-4"
              style={{ backgroundColor: palette.cardBg }}
            />
            <Skeleton
              className="w-full h-4"
              style={{ backgroundColor: palette.cardBg }}
            />
            <Skeleton
              className="w-3/4 h-4"
              style={{ backgroundColor: palette.cardBg }}
            />
          </div>
          <Skeleton
            className="w-32 h-3 mt-4"
            style={{ backgroundColor: palette.cardBg }}
          />
        </div>
      </div>
    </div>
  );
};
