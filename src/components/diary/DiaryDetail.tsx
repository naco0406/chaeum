'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { FadeInView } from '@/components/common/FadeInView';
import { ColorName } from '@/components/color/ColorName';
import { ColorBadge } from '@/components/color/ColorBadge';
import { DiaryDetailHeader } from '@/components/diary/DiaryDetailHeader';
import { DiaryContent } from '@/components/diary/DiaryContent';
import { DiaryNavigation } from '@/components/diary/DiaryNavigation';
import { DeleteDiaryDialog } from '@/components/diary/DeleteDiaryDialog';
import { useDiary } from '@/hooks/useDiary';
import { useDeleteDiary } from '@/hooks/useDeleteDiary';
import { getColorByDate } from '@/lib/color-utils';
import { PenLine } from 'lucide-react';
import Link from 'next/link';

interface DiaryDetailProps {
  dateString: string;
}

export const DiaryDetail: FC<DiaryDetailProps> = ({ dateString }) => {
  const router = useRouter();
  const date = new Date(dateString);
  const color = getColorByDate(date);

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
    return <DiaryDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">일기를 불러올 수 없습니다.</p>
          <Link href="/calendar">
            <Button variant="outline">캘린더로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!diary) {
    return (
      <AnimatedBackground color={color.hex}>
        <div className="min-h-screen flex flex-col px-4">
          <div className="w-full max-w-[430px] mx-auto flex flex-col flex-1">
            <DiaryDetailHeader
              date={date}
              onEdit={() => {}}
              onDelete={() => {}}
            />

            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              {/* 색상 정보 */}
              <FadeInView delay={0.1}>
                <div
                  className="w-24 h-24 rounded-full shadow-soft-lg"
                  style={{ backgroundColor: color.hex }}
                />
              </FadeInView>

              <ColorName nameKo={color.nameKo} nameEn={color.nameEn} />

              <FadeInView delay={0.4}>
                <p className="text-muted-foreground text-center">
                  이 날의 일기가 없습니다.
                </p>
              </FadeInView>

              <FadeInView delay={0.5}>
                <Link href={`/diary/write?date=${dateString}`}>
                  <Button className="gap-2">
                    <PenLine className="w-4 h-4" />
                    일기 쓰기
                  </Button>
                </Link>
              </FadeInView>
            </div>

            <DiaryNavigation currentDate={date} />
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground color={color.hex}>
      <div className="min-h-screen flex flex-col px-4 pb-4">
        <div className="w-full max-w-[430px] mx-auto flex flex-col flex-1">
          <DiaryDetailHeader
            date={date}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="flex-1 space-y-6">
            {/* 색상 정보 */}
            <FadeInView delay={0.1}>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full shadow-soft"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="space-y-1">
                  <h2 className="text-xl font-serif">{color.nameKo}</h2>
                  <p className="text-sm text-muted-foreground font-serif">
                    {color.nameEn}
                  </p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.2}>
              <ColorBadge division={color.division} category={color.category} />
            </FadeInView>

            {/* 일기 내용 */}
            <FadeInView delay={0.3}>
              <DiaryContent diary={diary} />
            </FadeInView>
          </div>

          <DiaryNavigation currentDate={date} />
        </div>
      </div>

      <DeleteDiaryDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </AnimatedBackground>
  );
};

const DiaryDetailSkeleton: FC = () => {
  return (
    <div className="min-h-screen px-4 py-4">
      <div className="w-full max-w-[430px] mx-auto space-y-6">
        {/* 헤더 스켈레톤 */}
        <div className="flex items-center justify-between py-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>

        {/* 색상 정보 스켈레톤 */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>

        {/* 뱃지 스켈레톤 */}
        <div className="flex gap-2">
          <Skeleton className="w-16 h-6 rounded-full" />
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>

        {/* 내용 스켈레톤 */}
        <Card className="shadow-soft">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-16 h-4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
            </div>
            <Skeleton className="w-32 h-3 mt-4" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
