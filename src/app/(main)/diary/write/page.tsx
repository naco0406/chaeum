import { getTodayColor } from '@/lib/color-utils';
import { DiaryWriteClient } from '@/components/diary/DiaryWriteClient';

export default function DiaryWritePage() {
  const todayColor = getTodayColor();
  const today = new Date();

  return <DiaryWriteClient color={todayColor} date={today} />;
}
