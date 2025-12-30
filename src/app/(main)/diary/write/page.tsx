'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { parse, isValid, isFuture } from 'date-fns';
import { getColorByDate } from '@/lib/color-utils';
import { DiaryWriteClient } from '@/components/diary/DiaryWriteClient';

export default function DiaryWritePage() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const isEdit = searchParams.get('edit') === 'true';

  // 날짜 파싱 (없으면 오늘)
  const targetDate = useMemo(() => {
    if (!dateParam) return new Date();

    const parsed = parse(dateParam, 'yyyy-MM-dd', new Date());
    if (!isValid(parsed)) return new Date();

    // 미래 날짜는 오늘로 리다이렉트
    if (isFuture(parsed)) return new Date();

    return parsed;
  }, [dateParam]);

  // 해당 날짜의 색상 가져오기
  const color = useMemo(() => getColorByDate(targetDate), [targetDate]);

  return <DiaryWriteClient color={color} date={targetDate} isEdit={isEdit} />;
}
