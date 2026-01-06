'use client';

import React from 'react';
import { ThemeProvider } from '@/lib/theme';
import { ApolloProvider } from '@/lib/apollo/provider';
import { ReduxProvider } from '@/lib/store/provider';
import { GlobalNotifications } from '@/components/ui';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ApolloProvider>
      <ReduxProvider>
        <ThemeProvider defaultMode="system">
          {children}
          <GlobalNotifications />
        </ThemeProvider>
      </ReduxProvider>
    </ApolloProvider>
  );
}
