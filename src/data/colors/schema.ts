import { z } from 'zod';

// 색상 분류 (Color Division)
export const colorDivisionSchema = z.enum([
  '빨강계',
  '주황계',
  '노랑계',
  '연두계',
  '초록계',
  '청록계',
  '파랑계',
  '남색계',
  '보라계',
  '자주계',
  '분홍계',
  '갈색계',
  '흰색계',
  '회색계',
  '검정계',
]);

// 색상 카테고리 (Color Category)
export const colorCategorySchema = z.enum([
  '동물',
  '식물',
  '자연현상',
  '광물',
  '음식',
  '생활',
  '감정',
  '계절',
  '시간',
]);

// RGB 스키마
export const rgbSchema = z.object({
  r: z.number().min(0).max(255),
  g: z.number().min(0).max(255),
  b: z.number().min(0).max(255),
});

// CMYK 스키마
export const cmykSchema = z.object({
  c: z.number().min(0).max(100),
  m: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  k: z.number().min(0).max(100),
});

// 개별 색상 스키마
export const dailyColorSchema = z.object({
  index: z.number().min(1).max(365),
  nameKo: z.string().min(1),
  nameEn: z.string().min(1),
  description: z.string().min(1),
  division: colorDivisionSchema,
  category: colorCategorySchema,
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  rgb: rgbSchema,
  cmyk: cmykSchema,
  munsell: z.string(),
});

// 전체 색상 배열 스키마
export const dailyColorsSchema = z
  .array(dailyColorSchema)
  .length(365)
  .refine(
    (colors) => {
      const indices = colors.map((c) => c.index);
      const uniqueIndices = new Set(indices);
      return uniqueIndices.size === 365;
    },
    { message: '모든 색상은 고유한 index (1-365)를 가져야 합니다.' }
  );

// 타입 추출
export type ColorDivision = z.infer<typeof colorDivisionSchema>;
export type ColorCategory = z.infer<typeof colorCategorySchema>;
export type RGB = z.infer<typeof rgbSchema>;
export type CMYK = z.infer<typeof cmykSchema>;
export type DailyColor = z.infer<typeof dailyColorSchema>;
export type DailyColors = z.infer<typeof dailyColorsSchema>;

// 색상 데이터 검증 함수
export const validateColors = (data: unknown): DailyColors => {
  return dailyColorsSchema.parse(data);
};

// 부분 데이터 검증 (개발 중 사용)
export const validatePartialColors = (data: unknown): DailyColor[] => {
  return z.array(dailyColorSchema).parse(data);
};
