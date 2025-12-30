'use client';

import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { getColorByDate } from '@/lib/color-utils';
import { DailyColor } from '@/types/color';

interface ThemeColorContextValue {
  todayColor: DailyColor;
  setThemeColor: (color: DailyColor) => void;
}

interface ThemeColorProviderProps {
  children: ReactNode;
}

const ThemeColorContext = createContext<ThemeColorContextValue | null>(null);

// 색상의 밝기 계산 (0-1)
const getLuminance = (hex: string): number => {
  const rgb = hex.replace('#', '');
  const r = parseInt(rgb.slice(0, 2), 16) / 255;
  const g = parseInt(rgb.slice(2, 4), 16) / 255;
  const b = parseInt(rgb.slice(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

// 색상을 더 어둡거나 밝게 조정
const adjustColor = (hex: string, factor: number): string => {
  const rgb = hex.replace('#', '');
  const r = Math.min(255, Math.max(0, Math.round(parseInt(rgb.slice(0, 2), 16) * factor)));
  const g = Math.min(255, Math.max(0, Math.round(parseInt(rgb.slice(2, 4), 16) * factor)));
  const b = Math.min(255, Math.max(0, Math.round(parseInt(rgb.slice(4, 6), 16) * factor)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// CSS 변수로 테마 색상 적용
const applyThemeColor = (color: DailyColor): void => {
  const root = document.documentElement;
  const luminance = getLuminance(color.hex);

  // 메인 테마 색상
  root.style.setProperty('--theme-color', color.hex);
  root.style.setProperty('--theme-color-rgb', `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`);

  // 밝기에 따른 변형 색상
  const isDark = luminance < 0.5;
  root.style.setProperty('--theme-color-light', isDark ? adjustColor(color.hex, 1.4) : adjustColor(color.hex, 1.2));
  root.style.setProperty('--theme-color-dark', isDark ? adjustColor(color.hex, 0.8) : adjustColor(color.hex, 0.7));
  root.style.setProperty('--theme-color-muted', `${color.hex}30`);
  root.style.setProperty('--theme-color-subtle', `${color.hex}15`);
  root.style.setProperty('--theme-color-vibrant', `${color.hex}90`);

  // 대비색 (텍스트용)
  root.style.setProperty('--theme-color-contrast', luminance > 0.6 ? '#1a1a1a' : '#ffffff');

  // 그라데이션용 보조 색상
  root.style.setProperty('--theme-gradient-start', `${color.hex}20`);
  root.style.setProperty('--theme-gradient-end', `${color.hex}05`);
};

export const ThemeColorProvider: FC<ThemeColorProviderProps> = ({ children }) => {
  const todayColor = useMemo(() => {
    return getColorByDate(new Date());
  }, []);

  const setThemeColor = (color: DailyColor) => {
    applyThemeColor(color);
  };

  useEffect(() => {
    applyThemeColor(todayColor);
  }, [todayColor]);

  return (
    <ThemeColorContext.Provider
      value={{
        todayColor,
        setThemeColor,
      }}
    >
      {children}
    </ThemeColorContext.Provider>
  );
};

export const useThemeColor = (): ThemeColorContextValue => {
  const context = useContext(ThemeColorContext);

  if (!context) {
    throw new Error('useThemeColor must be used within a ThemeColorProvider');
  }

  return context;
};
