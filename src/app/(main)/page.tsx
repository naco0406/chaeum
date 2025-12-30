import { getTodayColor } from '@/lib/color-utils';
import { TodayColorDisplay } from '@/components/color/TodayColorDisplay';

export default function HomePage() {
  const todayColor = getTodayColor();
  const today = new Date();

  return <TodayColorDisplay color={todayColor} date={today} />;
}
