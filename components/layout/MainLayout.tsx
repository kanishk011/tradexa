'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { useIsDarkMode } from '@/lib/theme';

interface MainLayoutProps {
  children: React.ReactNode;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    roles: string[];
  } | null;
  cartItemCount?: number;
  wishlistCount?: number;
  onLogout?: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableContainer?: boolean;
  disableFooter?: boolean;
}

export function MainLayout({
  children,
  user,
  cartItemCount = 0,
  wishlistCount = 0,
  onLogout,
  maxWidth = 'xl',
  disableContainer = false,
  disableFooter = false,
}: MainLayoutProps) {
  const isDark = useIsDarkMode();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Header
        user={user}
        cartItemCount={cartItemCount}
        wishlistCount={wishlistCount}
        onLogout={onLogout}
      />

      <Box
        component={motion.main}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        sx={{
          flex: 1,
          py: 3,
        }}
      >
        {disableContainer ? (
          children
        ) : (
          <Container maxWidth={maxWidth}>{children}</Container>
        )}
      </Box>

      {!disableFooter && <Footer />}
    </Box>
  );
}

export default MainLayout;
