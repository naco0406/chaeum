'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Sparkles } from 'lucide-react';
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
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, rgba(var(--theme-color-rgb), 0.3) 0%, rgba(var(--theme-color-rgb), 0.1) 100%)`,
          }}
        >
          <CheckCircle2
            className="w-12 h-12"
            style={{ color: 'var(--theme-color)' }}
          />
        </motion.div>

        <div>
          <h2 className="text-2xl font-serif mb-2">가입 완료</h2>
          <p className="text-muted-foreground">
            이메일로 인증 링크를 보내드렸습니다.
            <br />
            이메일을 확인해주세요.
          </p>
        </div>

        <Button
          onClick={() => router.push('/login')}
          className="rounded-xl h-12 px-8"
          style={{
            background: `linear-gradient(135deg, var(--theme-color) 0%, var(--theme-color-dark) 100%)`,
            color: 'var(--theme-color-contrast)',
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
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="relative inline-block">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, rgba(var(--theme-color-rgb), 0.2) 0%, rgba(var(--theme-color-rgb), 0.05) 100%)`,
            }}
          >
            <span
              className="text-4xl font-serif"
              style={{ color: 'var(--theme-color)' }}
            >
              채
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles
              className="w-5 h-5"
              style={{ color: 'var(--theme-color)', opacity: 0.6 }}
            />
          </motion.div>
        </div>

        <div>
          <h1 className="text-3xl font-serif">회원가입</h1>
          <p className="text-muted-foreground mt-2">
            채움과 함께 감정을 기록해보세요
          </p>
        </div>
      </motion.div>

      {/* 폼 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="rounded-3xl glass-strong border border-border/30 p-6 shadow-soft"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">이메일</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      autoComplete="email"
                      disabled={isLoading}
                      className="h-12 rounded-xl bg-background/50 border-border/50 focus:border-primary/50"
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
                  <FormLabel className="text-sm font-medium">
                    비밀번호
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="8자 이상 입력하세요"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="h-12 rounded-xl bg-background/50 border-border/50 focus:border-primary/50"
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
                  <FormLabel className="text-sm font-medium">
                    비밀번호 확인
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="h-12 rounded-xl bg-background/50 border-border/50 focus:border-primary/50"
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
                className="text-sm text-destructive text-center py-2 px-4 rounded-lg bg-destructive/10"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-medium shadow-soft"
              style={{
                background: `linear-gradient(135deg, var(--theme-color) 0%, var(--theme-color-dark) 100%)`,
                color: 'var(--theme-color-contrast)',
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
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center text-sm text-muted-foreground"
      >
        이미 계정이 있으신가요?{' '}
        <Link
          href="/login"
          className="hover:underline font-medium transition-colors"
          style={{ color: 'var(--theme-color)' }}
        >
          로그인
        </Link>
      </motion.p>
    </div>
  );
};
