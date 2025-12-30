/**
 * 색상 대비 유틸리티
 *
 * HSL 기반으로 배경색에 따른 텍스트 색상을 결정합니다.
 * L(밝기) 값이 임계값 이하면 흰색, 초과면 검은색을 반환합니다.
 */

/**
 * HSL Lightness 임계값
 * 이 값 이하면 흰색 텍스트, 초과면 검은색 텍스트
 * 조정 범위: 30~40 권장
 */
export const HSL_LIGHTNESS_THRESHOLD = 35;

// HEX를 RGB로 변환
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// RGB를 HSL로 변환
export const rgbToHsl = (
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

// HEX를 HSL로 변환
export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
};

/**
 * HSL 기반 대비색 계산
 * L(밝기)이 임계값 이하면 흰색, 초과면 검은색 반환
 * hex 형태로 반환하여 opacity suffix (예: #ffffff20)가 작동하도록 함
 */
export const getContrastColor = (hex: string): string => {
  const { l } = hexToHsl(hex);
  return l <= HSL_LIGHTNESS_THRESHOLD ? '#ffffff' : '#000000';
};

/**
 * 대비색이 흰색인지 여부
 */
export const isLightText = (hex: string): boolean => {
  const { l } = hexToHsl(hex);
  return l <= HSL_LIGHTNESS_THRESHOLD;
};

/**
 * 밝기 조정
 */
export const adjustBrightness = (hex: string, factor: number): string => {
  const { r, g, b } = hexToRgb(hex);
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
  return `rgb(${newR}, ${newG}, ${newB})`;
};

/**
 * 반투명 색상 생성
 */
export const withOpacity = (hex: string, opacity: number): string => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * 색상 팔레트 생성 (배경, 어두운 배경, 밝은 배경, 대비색)
 */
export const createColorPalette = (hex: string) => {
  const contrastColor = getContrastColor(hex);
  const isLight = isLightText(hex);
  const darkerColor = adjustBrightness(hex, 0.7);
  const lighterColor = adjustBrightness(hex, 1.3);

  return {
    primary: hex,
    darker: darkerColor,
    lighter: lighterColor,
    contrast: contrastColor,
    isLightText: isLight,
    // 기본 투명도 변형 (hex + opacity suffix로 사용 가능)
    muted: `${contrastColor}1a`, // 10%
    subtle: `${contrastColor}0d`, // 5%
    // 카드/표면용 반투명 배경 (직접 사용)
    cardBg: isLight ? '#ffffff1f' : '#00000010', // 12% / 6%
    cardBorder: isLight ? '#ffffff33' : '#0000001a', // 20% / 10%
    // GNB용 배경 (직접 사용)
    navBg: isLight ? '#0000004d' : '#ffffffd9', // 30% / 85%
    navText: isLight ? '#ffffffe6' : '#000000cc', // 90% / 80%
    navTextMuted: isLight ? '#ffffff80' : '#00000066', // 50% / 40%
  };
};
