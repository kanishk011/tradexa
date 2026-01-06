'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Typography } from '@mui/material';
import { useIsDarkMode } from '@/lib/theme';
import { createGlassStyles } from '@/lib/theme/glass';
import { appConfig } from '@/config';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDark = useIsDarkMode();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        backgroundImage: isDark
          ? 'radial-gradient(circle at 25% 25%, rgba(100, 181, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(186, 104, 200, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 25% 25%, rgba(33, 150, 243, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)',
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              background: isDark
                ? 'linear-gradient(135deg, #64B5F6 0%, #BA68C8 100%)'
                : 'linear-gradient(135deg, #1976D2 0%, #9C27B0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {appConfig.name}
          </Typography>
        </Link>
      </Box>

      {/* Content */}
      <Container
        component={motion.main}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Box
          sx={{
            width: '100%',
            ...createGlassStyles('elevated', isDark),
            borderRadius: '24px',
            p: { xs: 3, sm: 4 },
          }}
        >
          {children}
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} {appConfig.name}. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
