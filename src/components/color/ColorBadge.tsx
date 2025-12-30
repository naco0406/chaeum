'use client';

import { FC } from 'react';
import { FadeInView } from '@/components/common/FadeInView';
import { ColorDivision, ColorCategory } from '@/types/color';

interface ColorBadgeProps {
  division: ColorDivision;
  category: ColorCategory;
}

export const ColorBadge: FC<ColorBadgeProps> = ({ division, category }) => {
  return (
    <FadeInView delay={0.5} className="flex items-center justify-center gap-2">
      <span className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
        {division}
      </span>
      <span className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
        {category}
      </span>
    </FadeInView>
  );
};
