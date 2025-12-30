import { FC } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { DAILY_COLORS, COLOR_DIVISIONS, COLOR_CATEGORIES } from '@/constants/colors';

interface ColorSwatchProps {
  name: string;
  hex: string;
  className?: string;
}

const ColorSwatch: FC<ColorSwatchProps> = ({ name, hex, className = '' }) => {
  return (
    <div className="space-y-2">
      <div
        className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium shadow-soft ${className}`}
        style={{ backgroundColor: hex }}
      />
      <p className="text-xs text-center text-muted-foreground">{name}</p>
    </div>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: FC<SectionProps> = ({ title, children }) => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-serif">{title}</h2>
      {children}
    </section>
  );
};

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen py-8 md:py-16">
      <div className="container-wide space-y-16">
        {/* 헤더 */}
        <header className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">메인으로</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-serif">채움 디자인 시스템</h1>
            <p className="text-muted-foreground text-lg">
              한국적인 아름다움을 담은 컴포넌트와 스타일 가이드
            </p>
          </div>
        </header>

        {/* 타이포그래피 */}
        <Section title="타이포그래피">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">제목 (Noto Serif KR)</p>
              <h1 className="font-serif">제목 1 - 채움</h1>
              <h2 className="font-serif">제목 2 - 오늘의 색상</h2>
              <h3 className="font-serif">제목 3 - 일기 작성하기</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">본문 (Pretendard)</p>
              <p className="text-lg">
                따뜻한 햇살이 내리쬐는 오후, 창가에 앉아 차를 마시며 고요한 시간을 보냈습니다.
              </p>
              <p className="text-base text-muted-foreground">
                365일, 매일 다른 색상으로 당신의 감정을 기록해보세요.
              </p>
            </div>
          </div>
        </Section>

        {/* 한국 전통색 팔레트 */}
        <Section title="한국 전통색 팔레트">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            <ColorSwatch name="한지" hex="var(--hanji)" className="bg-hanji border border-border" />
            <ColorSwatch name="먹색" hex="var(--meok)" className="bg-meok text-primary-foreground" />
            <ColorSwatch name="담청" hex="var(--damcheong)" className="bg-damcheong" />
            <ColorSwatch name="적색" hex="var(--jeok)" className="bg-jeok text-primary-foreground" />
            <ColorSwatch name="송화" hex="var(--songhwa)" className="bg-songhwa" />
            <ColorSwatch name="옥연" hex="var(--okyeon)" className="bg-okyeon" />
            <ColorSwatch name="자심" hex="var(--jasim)" className="bg-jasim text-primary-foreground" />
            <ColorSwatch name="비취" hex="var(--bichwi)" className="bg-bichwi" />
          </div>
        </Section>

        {/* 365일 색상 샘플 */}
        <Section title="365일 색상 (1월 샘플)">
          <div className="grid grid-cols-7 md:grid-cols-14 gap-2">
            {DAILY_COLORS.map((color) => (
              <div
                key={color.index}
                className="aspect-square rounded-lg shadow-soft cursor-pointer hover-lift"
                style={{ backgroundColor: color.hex }}
                title={`${color.index}. ${color.nameKo}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-4">
            <p className="text-sm text-muted-foreground">Division:</p>
            {COLOR_DIVISIONS.slice(0, 8).map((division) => (
              <span
                key={division}
                className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
              >
                {division}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">Category:</p>
            {COLOR_CATEGORIES.map((category) => (
              <span
                key={category}
                className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
              >
                {category}
              </span>
            ))}
          </div>
        </Section>

        {/* 카드 */}
        <Section title="카드">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="shadow-soft hover-lift">
              <CardHeader>
                <CardTitle className="text-xl font-serif">기본 카드</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  shadow-soft와 hover-lift 효과가 적용된 카드입니다.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft-md">
              <CardHeader>
                <CardTitle className="text-xl font-serif">오늘의 기록</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  따뜻한 햇살이 내리쬐는 오후, 창가에 앉아 차를 마시며 고요한 시간을 보냈습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl font-serif">감정 색상</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {DAILY_COLORS.slice(0, 5).map((color) => (
                    <span
                      key={color.index}
                      className="w-8 h-8 rounded-full shadow-soft"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* 입력 */}
        <Section title="입력">
          <div className="grid gap-6 md:grid-cols-2 max-w-2xl">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">기본 입력</label>
              <Input placeholder="오늘의 한 줄" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">내부 그림자</label>
              <Input placeholder="오늘의 한 줄" className="shadow-inner-soft" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-muted-foreground">텍스트 영역</label>
              <Textarea
                placeholder="오늘 하루는 어땠나요? 당신의 이야기를 들려주세요."
                className="shadow-inner-soft min-h-[120px]"
              />
            </div>
          </div>
        </Section>

        {/* 버튼 */}
        <Section title="버튼">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button disabled>Disabled</Button>
              <Button className="w-full max-w-xs">Full Width</Button>
            </div>
          </div>
        </Section>

        {/* 그림자 */}
        <Section title="그림자">
          <div className="flex flex-wrap gap-6">
            <div className="w-28 h-28 rounded-xl bg-card shadow-soft flex items-center justify-center text-sm text-muted-foreground">
              soft
            </div>
            <div className="w-28 h-28 rounded-xl bg-card shadow-soft-md flex items-center justify-center text-sm text-muted-foreground">
              soft-md
            </div>
            <div className="w-28 h-28 rounded-xl bg-card shadow-soft-lg flex items-center justify-center text-sm text-muted-foreground">
              soft-lg
            </div>
            <div className="w-28 h-28 rounded-xl bg-card shadow-inner-soft flex items-center justify-center text-sm text-muted-foreground">
              inner-soft
            </div>
          </div>
        </Section>

        {/* Border Radius */}
        <Section title="Border Radius">
          <div className="flex flex-wrap gap-6">
            <div className="w-20 h-20 bg-damcheong rounded-sm flex items-center justify-center text-xs text-white">
              sm
            </div>
            <div className="w-20 h-20 bg-damcheong rounded-md flex items-center justify-center text-xs text-white">
              md
            </div>
            <div className="w-20 h-20 bg-damcheong rounded-lg flex items-center justify-center text-xs text-white">
              lg
            </div>
            <div className="w-20 h-20 bg-damcheong rounded-xl flex items-center justify-center text-xs text-white">
              xl
            </div>
            <div className="w-20 h-20 bg-damcheong rounded-2xl flex items-center justify-center text-xs text-white">
              2xl
            </div>
            <div className="w-20 h-20 bg-damcheong rounded-full flex items-center justify-center text-xs text-white">
              full
            </div>
          </div>
        </Section>

        {/* 스켈레톤 */}
        <Section title="스켈레톤 (로딩)">
          <div className="space-y-4 max-w-md">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <Skeleton className="h-[120px] w-full rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </Section>

        {/* 푸터 */}
        <footer className="text-center text-muted-foreground text-sm pt-8 border-t border-border">
          <p>채움 디자인 시스템 v1.0</p>
        </footer>
      </div>
    </main>
  );
}
