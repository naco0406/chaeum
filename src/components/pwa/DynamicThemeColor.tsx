'use client';

import { useEffect, useMemo } from 'react';
import { getColorByDate } from '@/lib/color-utils';

/**
 * 오늘의 색상에 따라 브라우저 테마 색상을 동적으로 변경합니다.
 * PWA 및 모바일 브라우저에서 상단바 색상을 오늘의 색상으로 표시합니다.
 */
export const DynamicThemeColor = () => {
  const todayColor = useMemo(() => getColorByDate(new Date()), []);

  useEffect(() => {
    // theme-color 메타 태그 업데이트
    const updateThemeColor = () => {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');

      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }

      metaThemeColor.setAttribute('content', todayColor.hex);
    };

    // msapplication-navbutton-color 업데이트 (Windows Phone)
    const updateMsNavColor = () => {
      let metaMsNav = document.querySelector('meta[name="msapplication-navbutton-color"]');

      if (!metaMsNav) {
        metaMsNav = document.createElement('meta');
        metaMsNav.setAttribute('name', 'msapplication-navbutton-color');
        document.head.appendChild(metaMsNav);
      }

      metaMsNav.setAttribute('content', todayColor.hex);
    };

    // apple-mobile-web-app-status-bar-style은 고정값 사용 (검은색 반투명)
    const updateAppleStatusBar = () => {
      let metaApple = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');

      if (!metaApple) {
        metaApple = document.createElement('meta');
        metaApple.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
        document.head.appendChild(metaApple);
      }

      metaApple.setAttribute('content', 'black-translucent');
    };

    updateThemeColor();
    updateMsNavColor();
    updateAppleStatusBar();

    // body 배경색도 오늘의 색상으로 설정 (배경 노출 방지)
    document.body.style.backgroundColor = todayColor.hex;
  }, [todayColor.hex]);

  return null;
};
