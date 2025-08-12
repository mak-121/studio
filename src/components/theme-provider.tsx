'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

import { useConfig } from '@/hooks/use-config';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [config] = useConfig();

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div
        className={`theme-${config.theme}`}
        style={{
          fontFamily: `var(--font-${config.font})`,
        }}
      >
        {children}
      </div>
    </NextThemesProvider>
  );
}
