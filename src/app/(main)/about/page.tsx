'use client';

import { FC, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ImmersiveBackground } from '@/components/common/ImmersiveBackground';
import { getColorByDate } from '@/lib/color-utils';
import { createColorPalette } from '@/lib/color-contrast';

const AboutPage: FC = () => {
  const todayColor = useMemo(() => getColorByDate(new Date()), []);
  const palette = useMemo(
    () => createColorPalette(todayColor.hex),
    [todayColor.hex]
  );
  const textColor = palette.contrast;

  // 한국 전통색 (오방색 기반)
  const traditionalColors = [
    { color: '#C83C3C', name: '적색' },
    { color: '#1E4D8C', name: '청색' },
    { color: '#E8B54F', name: '황색' },
    { color: '#F5F5F5', name: '백색' },
    { color: '#1A1A1A', name: '흑색' },
  ];

  const features = [
    {
      title: '하루, 하나의 빛깔',
      description: '매일 다른 색이 당신의 하루를 물들입니다. 일 년 삼백육십오 일, 삼백육십오 가지의 색이 당신의 시간을 담아냅니다.',
    },
    {
      title: '기록이 모여 그림이 되다',
      description: '작성한 일기들이 모여 나만의 색 지도를 완성합니다. 지나온 날들을 색으로 돌아볼 수 있어요.',
    },
    {
      title: '마음을 담는 글',
      description: '그날의 감정을 선택하고, 자유롭게 하루를 적어보세요. 짧은 한 줄도, 긴 이야기도 모두 소중한 기록이 됩니다.',
    },
  ];

  return (
    <ImmersiveBackground color={todayColor.hex}>
      <div className="min-h-screen-dvh px-4 pt-4 pb-32">
        <div className="max-w-[430px] mx-auto">
          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-12"
          >
            <Link href="/profile">
              <motion.button
                className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm"
                style={{
                  backgroundColor: `${textColor}10`,
                  color: textColor,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          {/* 메인 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-16"
          >
            <h1
              className="text-6xl font-serif mb-2"
              style={{ color: textColor }}
            >
              채<span className="text-4xl font-light opacity-50">(彩)</span>움
            </h1>

            <motion.div
              className="flex justify-center items-center gap-3 my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.3 }}
            >
              <div className="h-px w-16" style={{ backgroundColor: textColor }} />
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: textColor }} />
              <div className="h-px w-16" style={{ backgroundColor: textColor }} />
            </motion.div>

            <p
              className="text-lg font-serif leading-relaxed"
              style={{ color: textColor, opacity: 0.7 }}
            >
              색으로 채워가는<br />나만의 하루
            </p>
          </motion.div>

          {/* 전통색 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-3 mb-16"
          >
            {traditionalColors.map((item, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center gap-2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 200 }}
              >
                <div
                  className="w-8 h-8 rounded-full border"
                  style={{
                    backgroundColor: item.color,
                    borderColor: `${textColor}20`,
                  }}
                />
                <span
                  className="text-[10px] font-serif"
                  style={{ color: textColor, opacity: 0.5 }}
                >
                  {item.name}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* 소개 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl backdrop-blur-md p-8 mb-8"
            style={{
              backgroundColor: `${textColor}06`,
              border: `1px solid ${textColor}10`,
            }}
          >
            <p
              className="text-base font-serif leading-loose text-center"
              style={{ color: textColor, opacity: 0.85 }}
            >
              채움은 '색을 채우다'라는 뜻을 품고 있습니다.
              <br /><br />
              일 년, 삼백육십오 일.
              <br />
              매일 다른 색이 주어지고
              <br />
              그 위에 당신의 하루가 쌓입니다.
              <br /><br />
              시간이 흐르면
              <br />
              삼백육십오 개의 색이 모여
              <br />
              세상에 하나뿐인
              <br />
              당신만의 그림이 됩니다.
            </p>
          </motion.div>

          {/* 기능 소개 */}
          <div className="space-y-4 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="rounded-2xl backdrop-blur-md p-6"
                style={{
                  backgroundColor: `${textColor}06`,
                  border: `1px solid ${textColor}10`,
                }}
              >
                <h3
                  className="text-lg font-serif mb-2"
                  style={{ color: textColor }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: textColor, opacity: 0.65 }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 오늘의 색 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center space-y-3"
          >
            <div
              className="flex justify-center items-center gap-3 mb-6"
              style={{ opacity: 0.3 }}
            >
              <div className="h-px w-12" style={{ backgroundColor: textColor }} />
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: textColor }} />
              <div className="h-px w-12" style={{ backgroundColor: textColor }} />
            </div>

            <p
              className="text-xs tracking-widest font-serif"
              style={{ color: textColor, opacity: 0.4 }}
            >
              오늘의 색
            </p>

            <div
              className="w-20 h-20 rounded-2xl mx-auto shadow-lg"
              style={{ backgroundColor: todayColor.hex }}
            />

            <p
              className="text-2xl font-serif pt-2"
              style={{ color: textColor }}
            >
              {todayColor.nameKo}
            </p>
            <p
              className="text-sm font-serif"
              style={{ color: textColor, opacity: 0.5 }}
            >
              {todayColor.description}
            </p>
          </motion.div>
        </div>
      </div>
    </ImmersiveBackground>
  );
};

export default AboutPage;
