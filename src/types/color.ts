/**
 * 색상 관련 타입 정의
 *
 * 실제 타입과 스키마는 src/data/colors/schema.ts에서 관리됩니다.
 * 이 파일은 하위 호환성을 위해 re-export합니다.
 */

export type {
  ColorDivision,
  ColorCategory,
  RGB,
  CMYK,
  DailyColor,
  DailyColors,
} from '@/data/colors/schema';
