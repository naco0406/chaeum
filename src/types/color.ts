export type ColorDivision =
  | '빨강계'
  | '주황계'
  | '노랑계'
  | '연두계'
  | '초록계'
  | '청록계'
  | '파랑계'
  | '남색계'
  | '보라계'
  | '자주계'
  | '분홍계'
  | '갈색계'
  | '흰색계'
  | '회색계'
  | '검정계';

export type ColorCategory =
  | '동물'
  | '식물'
  | '자연현상'
  | '광물'
  | '음식'
  | '생활'
  | '감정'
  | '계절'
  | '시간';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface DailyColor {
  index: number;
  nameKo: string;
  nameEn: string;
  description: string;
  division: ColorDivision;
  category: ColorCategory;
  hex: string;
  rgb: RGB;
  cmyk: CMYK;
  munsell: string;
}
