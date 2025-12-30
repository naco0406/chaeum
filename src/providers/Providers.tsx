'use client';

import { FC, ReactNode } from 'react';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeColorProvider } from '@/providers/ThemeColorProvider';
import { Toaster } from '@/components/ui/sonner';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeColorProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              className: 'shadow-soft',
            }}
          />
        </ThemeColorProvider>
      </AuthProvider>
    </QueryProvider>
  );
};
