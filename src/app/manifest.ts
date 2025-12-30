import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '채움 - 365일 감정 기록 다이어리',
    short_name: '채움',
    description: '매일 다른 색으로 물드는 나만의 감정 일기',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9f7f4',
    theme_color: '#f9f7f4',
    orientation: 'portrait',
    scope: '/',
    lang: 'ko',
    categories: ['lifestyle', 'productivity'],
    icons: [
      {
        src: '/icons/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
