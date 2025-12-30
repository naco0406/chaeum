'use client';

import { useLayout } from '@/contexts/LayoutContext';
import { MonthCalendar } from '@/components/calendar/MonthCalendar';
import { ColorPaletteView } from '@/components/palette/ColorPaletteView';

export default function RecordsPage() {
  const { layoutMode } = useLayout();

  if (layoutMode === 'palette') {
    return <ColorPaletteView />;
  }

  return <MonthCalendar />;
}
