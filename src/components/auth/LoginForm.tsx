'use client';

import { FC, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/providers/AuthProvider';
import { getColorByDate } from '@/lib/color-utils';
import { createColorPalette } from '@/lib/color-contrast';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: FC = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 오늘의 색상 팔레트
  const todayColor = useMemo(() => getColorByDate(new Date()), []);
  const palette = useMemo(
    () => createColorPalette(todayColor.hex),
    [todayColor.hex]
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn(values.email, values.password);
      router.push('/');
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 로고 및 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="text-center space-y-6"
      >
        {/* 브랜드 타이틀 */}
        <div className="pt-4">
          <motion.h1
            className="text-5xl font-serif tracking-tight"
            style={{ color: palette.contrast }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            채<span className="text-3xl font-light opacity-50">(彩)</span>움
          </motion.h1>

          {/* 장식선 */}
          <motion.div
            className="flex justify-center items-center gap-3 my-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-px w-12" style={{ backgroundColor: palette.contrast }} />
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: palette.contrast }} />
            <div className="h-px w-12" style={{ backgroundColor: palette.contrast }} />
          </motion.div>

          <motion.p
            className="text-base font-serif"
            style={{ color: palette.contrast, opacity: 0.6 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.4 }}
          >
            오늘의 색으로 로그인하세요
          </motion.p>
        </div>
      </motion.div>

      {/* 오늘의 색 표시 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex justify-center"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl shadow-sm"
            style={{ backgroundColor: todayColor.hex }}
          />
          <div className="text-left">
            <p
              className="text-xs tracking-widest"
              style={{ color: palette.contrast, opacity: 0.4 }}
            >
              오늘의 색
            </p>
            <p
              className="text-sm font-serif"
              style={{ color: palette.contrast, opacity: 0.8 }}
            >
              {todayColor.nameKo}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 폼 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="rounded-3xl backdrop-blur-md p-7"
        style={{
          backgroundColor: `${palette.contrast}06`,
          border: `1px solid ${palette.contrast}12`,
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="text-sm font-medium"
                    style={{ color: palette.contrast, opacity: 0.8 }}
                  >
                    이메일
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      autoComplete="email"
                      disabled={isLoading}
                      className="h-12 rounded-xl border-0 focus-visible:ring-1"
                      style={{
                        backgroundColor: `${palette.contrast}08`,
                        color: palette.contrast,
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="text-sm font-medium"
                    style={{ color: palette.contrast, opacity: 0.8 }}
                  >
                    비밀번호
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      autoComplete="current-password"
                      disabled={isLoading}
                      className="h-12 rounded-xl border-0 focus-visible:ring-1"
                      style={{
                        backgroundColor: `${palette.contrast}08`,
                        color: palette.contrast,
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-center py-3 px-4 rounded-xl"
                style={{
                  backgroundColor: `${palette.contrast}08`,
                  color: palette.contrast,
                  opacity: 0.9,
                }}
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full h-13 rounded-xl text-base font-medium mt-2"
              style={{
                backgroundColor: palette.contrast,
                color: palette.primary,
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </Button>
          </form>
        </Form>
      </motion.div>

      {/* 회원가입 링크 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center space-y-4"
      >
        <p
          className="text-sm"
          style={{ color: palette.contrast, opacity: 0.6 }}
        >
          아직 계정이 없으신가요?
        </p>
        <Link href="/signup">
          <Button
            variant="outline"
            className="h-12 px-8 rounded-xl text-base font-medium border-0"
            style={{
              backgroundColor: `${palette.contrast}08`,
              color: palette.contrast,
            }}
          >
            회원가입
          </Button>
        </Link>
      </motion.div>

      {/* 하단 장식 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center items-center gap-3 pt-4"
      >
        <div className="h-px w-8" style={{ backgroundColor: palette.contrast }} />
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: palette.contrast }} />
        <div className="h-px w-8" style={{ backgroundColor: palette.contrast }} />
      </motion.div>
    </div>
  );
};
