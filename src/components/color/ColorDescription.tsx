'use client';

import { FC } from 'react';
import { FadeInView } from '@/components/common/FadeInView';

interface ColorDescriptionProps {
  description: string;
}

export const ColorDescription: FC<ColorDescriptionProps> = ({ description }) => {
  return (
    <FadeInView delay={0.6}>
      <p className="text-center text-muted-foreground leading-relaxed max-w-xs mx-auto">
        {description}
      </p>
    </FadeInView>
  );
};
