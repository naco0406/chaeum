import { notFound } from 'next/navigation';
import { isValid, parse } from 'date-fns';
import { DiaryDetail } from '@/components/diary/DiaryDetail';

interface DiaryPageProps {
  params: Promise<{
    date: string;
  }>;
}

const isValidDateString = (dateString: string): boolean => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateString)) {
    return false;
  }

  const parsed = parse(dateString, 'yyyy-MM-dd', new Date());
  return isValid(parsed);
};

export default async function DiaryPage({ params }: DiaryPageProps) {
  const { date } = await params;

  if (!isValidDateString(date)) {
    notFound();
  }

  return <DiaryDetail dateString={date} />;
}
