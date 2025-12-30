/**
 * 365일 색상 데이터 관리
 *
 * 이 파일에서 모든 색상 관련 데이터와 유틸리티를 export합니다.
 * 색상 데이터는 한국 전통색을 기반으로 365일 각각에 고유한 색상을 부여합니다.
 */

// 스키마 & 타입 re-export
export {
  dailyColorSchema,
  dailyColorsSchema,
  colorDivisionSchema,
  colorCategorySchema,
  validateColors,
  validatePartialColors,
} from './schema';

export type {
  DailyColor,
  DailyColors,
  ColorDivision,
  ColorCategory,
  RGB,
  CMYK,
} from './schema';

// 기존 색상 데이터 (임시로 constants에서 가져옴)
// TODO: 365개 색상이 완성되면 이 파일로 이동
export { DAILY_COLORS, COLOR_DIVISIONS, COLOR_CATEGORIES } from '@/constants/colors';
