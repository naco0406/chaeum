'use client';

import { FC, ReactNode } from 'react';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeColorProvider } from '@/providers/ThemeColorProvider';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { Toaster } from '@/components/ui/sonner';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeColorProvider>
          <LayoutProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                className: 'shadow-soft',
              }}
            />
          </LayoutProvider>
        </ThemeColorProvider>
      </AuthProvider>
    </QueryProvider>
  );
};
