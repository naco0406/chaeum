'use client';

import { FC, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';
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

const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요')
      .email('올바른 이메일 형식이 아닙니다'),
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요')
      .min(8, '비밀번호는 8자 이상이어야 합니다'),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export const SignupForm: FC = () => {
  const router = useRouter();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 오늘의 색상 팔레트
  const todayColor = useMemo(() => getColorByDate(new Date()), []);
  const palette = useMemo(
    () => createColorPalette(todayColor.hex),
    [todayColor.hex]
  );

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await signUp(values.email, values.password);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('already registered')) {
          setError('이미 가입된 이메일입니다');
        } else {
          setError('회원가입에 실패했습니다. 다시 시도해주세요');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
          style={{
            backgroundColor: `${palette.contrast}15`,
          }}
        >
          <CheckCircle2
            className="w-12 h-12"
            style={{ color: palette.contrast }}
          />
        </motion.div>

        <div className="space-y-3">
          <h2
            className="text-3xl font-serif"
            style={{ color: palette.contrast }}
          >
            가입 완료
          </h2>

          {/* 장식선 */}
          <div
            className="flex justify-center items-center gap-3"
            style={{ opacity: 0.3 }}
          >
            <div className="h-px w-12" style={{ backgroundColor: palette.contrast }} />
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: palette.contrast }} />
            <div className="h-px w-12" style={{ backgroundColor: palette.contrast }} />
          </div>

          <p
            className="font-serif leading-relaxed"
            style={{ color: palette.contrast, opacity: 0.7 }}
          >
            이메일로 인증 링크를 보내드렸습니다.
            <br />
            이메일을 확인해주세요.
          </p>
        </div>

        <Button
          onClick={() => router.push('/login')}
          className="rounded-xl h-12 px-8"
          style={{
            backgroundColor: palette.contrast,
            color: palette.primary,
          }}
        >
          로그인하기
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="text-center space-y-6"
      >
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
            색으로 채워가는 나만의 하루
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
                      placeholder="8자 이상 입력하세요"
                      autoComplete="new-password"
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="text-sm font-medium"
                    style={{ color: palette.contrast, opacity: 0.8 }}
                  >
                    비밀번호 확인
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      autoComplete="new-password"
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
                  가입 중...
                </>
              ) : (
                '회원가입'
              )}
            </Button>
          </form>
        </Form>
      </motion.div>

      {/* 로그인 링크 */}
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
          이미 계정이 있으신가요?
        </p>
        <Link href="/login">
          <Button
            variant="outline"
            className="h-12 px-8 rounded-xl text-base font-medium border-0"
            style={{
              backgroundColor: `${palette.contrast}08`,
              color: palette.contrast,
            }}
          >
            로그인
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
