'use client';

import { FC } from 'react';
import { FadeInView } from '@/components/common/FadeInView';

interface ColorNameProps {
  nameKo: string;
  nameEn: string;
}

export const ColorName: FC<ColorNameProps> = ({ nameKo, nameEn }) => {
  return (
    <div className="text-center space-y-2">
      <FadeInView delay={0.3}>
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight">
          {nameKo}
        </h1>
      </FadeInView>
      <FadeInView delay={0.4}>
        <p className="text-lg font-serif text-muted-foreground">{nameEn}</p>
      </FadeInView>
    </div>
  );
};
