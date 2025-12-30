import { notFound } from 'next/navigation';
import { ColorDetail } from '@/components/color/ColorDetail';

interface ColorPageProps {
  params: Promise<{
    index: string;
  }>;
}

export default async function ColorPage({ params }: ColorPageProps) {
  const { index } = await params;
  const colorIndex = parseInt(index, 10);

  // 유효성 검증: 1-365 범위
  if (isNaN(colorIndex) || colorIndex < 1 || colorIndex > 365) {
    notFound();
  }

  return <ColorDetail colorIndex={colorIndex} />;
}
