# Chaeum 프로젝트 코드 컨벤션

## 타입 규칙

- `any`, `unknown`, `never` 타입 사용 금지
- 모든 타입은 명시적으로 정의할 것
- 타입 추론에 의존하지 않고 반환 타입 명시

## Export 규칙

- `export default` 사용 금지
- `named export`만 사용
- 예외: Next.js App Router의 page.tsx, layout.tsx, loading.tsx, error.tsx 등은 `export default` 필수

## Re-export 규칙

- `index.ts`를 통한 re-export 금지
- 각 파일에서 직접 import할 것

## 파일 구조 규칙

- 한 파일에 하나의 컴포넌트 또는 훅만 선언
- 컴포넌트 파일명: PascalCase (예: `DiaryCard.tsx`)
- 훅 파일명: `use` 접두사 + camelCase (예: `useDiary.ts`)

## Props 정의 규칙

- 모든 props는 `interface`로 정의
- interface는 파일 상단에 위치
- Props 네이밍: `{컴포넌트명}Props` (예: `DiaryCardProps`)

## 함수 선언 규칙

- `function` 키워드 대신 `const` + 화살표 함수 사용
- 컴포넌트는 `FC` 타입 사용 (예: `const MyComponent: FC<Props> = () => {}`)
- `React.useState` 대신 `import { useState } from 'react'` 처럼 직접 import
- `React.` 접두사 사용 금지

```tsx
import { FC, useState } from 'react';

interface DiaryCardProps {
  title: string;
  content: string;
  date: Date;
}

export const DiaryCard: FC<DiaryCardProps> = ({ title, content, date }) => {
  const [isOpen, setIsOpen] = useState(false);
  // ...
};
```

## 폴더 구조

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── ui/                 # shadcn 컴포넌트
│   ├── common/             # 공통 컴포넌트
│   ├── diary/              # 일기 관련 컴포넌트
│   ├── calendar/           # 캘린더 관련 컴포넌트
│   └── color/              # 색상 관련 컴포넌트
├── hooks/                  # 커스텀 훅
├── lib/                    # 유틸리티, supabase 클라이언트
├── types/                  # 타입 정의
├── constants/              # 상수 (365일 색상 데이터 등)
├── styles/                 # 전역 스타일, 폰트
└── providers/              # Context, React Query Provider
```

## 기술 스택

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui (new-york style)
- @tanstack/react-query
- react-hook-form + zod
- @supabase/supabase-js + @supabase/ssr
- framer-motion
- date-fns
- lucide-react

## 환경 변수

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
