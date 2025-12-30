/**
 * 365일 색상 데이터 템플릿 생성 스크립트
 *
 * 사용법:
 * npx ts-node scripts/generate-color-template.ts
 *
 * 또는 package.json에 추가:
 * "scripts": { "gen:colors": "ts-node scripts/generate-color-template.ts" }
 */

interface ColorTemplate {
  index: number;
  nameKo: string;
  nameEn: string;
  description: string;
  division: string;
  category: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  cmyk: { c: number; m: number; y: number; k: number };
  munsell: string;
}

// 월별 시작 인덱스
const MONTH_START = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
const MONTH_NAMES = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

// 계절별 대표 색상 팔레트
const SEASON_PALETTES = {
  winter: ['#F8F6F0', '#1B2838', '#C41E3A', '#B8C4C8', '#2D5A3D'], // 1-2월, 12월
  spring: ['#FFB7C5', '#98D982', '#87CEEB', '#FFD700', '#DDA0DD'], // 3-5월
  summer: ['#00CED1', '#228B22', '#FF6347', '#4169E1', '#32CD32'], // 6-8월
  autumn: ['#D2691E', '#CD853F', '#8B4513', '#DAA520', '#800000'], // 9-11월
};

const getSeasonForMonth = (month: number): keyof typeof SEASON_PALETTES => {
  if (month === 12 || month <= 2) return 'winter';
  if (month <= 5) return 'spring';
  if (month <= 8) return 'summer';
  return 'autumn';
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const generateTemplate = (): ColorTemplate[] => {
  const colors: ColorTemplate[] = [];

  for (let i = 1; i <= 365; i++) {
    // 월 계산
    let month = 1;
    for (let m = 0; m < 12; m++) {
      if (i >= MONTH_START[m]) {
        month = m + 1;
      }
    }

    const dayInMonth = i - MONTH_START[month - 1] + 1;
    const season = getSeasonForMonth(month);
    const palette = SEASON_PALETTES[season];
    const hex = palette[i % palette.length];
    const rgb = hexToRgb(hex);

    colors.push({
      index: i,
      nameKo: `색상_${i}`,
      nameEn: `Color_${i}`,
      description: `${MONTH_NAMES[month - 1]} ${dayInMonth}일의 색상입니다. (수정 필요)`,
      division: '흰색계',
      category: '자연현상',
      hex,
      rgb,
      cmyk: { c: 0, m: 0, y: 0, k: 0 },
      munsell: 'N 9/',
    });
  }

  return colors;
};

// 실행
const template = generateTemplate();
console.log(JSON.stringify(template, null, 2));

// 파일로 저장하려면:
// import { writeFileSync } from 'fs';
// writeFileSync('src/data/colors/colors-template.json', JSON.stringify(template, null, 2));
