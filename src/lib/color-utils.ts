import { DailyColor, ColorDivision, ColorCategory } from '@/types/color';
import { DAILY_COLORS } from '@/constants/colors';

export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const getColorByIndex = (index: number): DailyColor => {
  const normalizedIndex = ((index - 1) % 365) + 1;
  const color = DAILY_COLORS.find((c) => c.index === normalizedIndex);

  if (!color) {
    return DAILY_COLORS[0];
  }

  return color;
};

export const getColorByDate = (date: Date): DailyColor => {
  const dayOfYear = getDayOfYear(date);
  return getColorByIndex(dayOfYear);
};

export const getTodayColor = (): DailyColor => {
  return getColorByDate(new Date());
};

export const getColorsByDivision = (division: ColorDivision): DailyColor[] => {
  return DAILY_COLORS.filter((color) => color.division === division);
};

export const getColorsByCategory = (category: ColorCategory): DailyColor[] => {
  return DAILY_COLORS.filter((color) => color.category === category);
};

export const hexToRgbString = (hex: string): string => {
  const color = DAILY_COLORS.find((c) => c.hex === hex);
  if (color) {
    return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
  }
  return hex;
};

export const getContrastTextColor = (hex: string): 'light' | 'dark' => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? 'dark' : 'light';
};
