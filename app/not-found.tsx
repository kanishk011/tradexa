'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import Link from 'next/link';
import { useIsDarkMode } from '@/lib/theme';
import { GlassButton, GlassCard } from '@/components/ui';

export default function NotFoundPage() {
  const isDark = useIsDarkMode();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        backgroundImage: isDark
          ? 'radial-gradient(circle at 75% 75%, rgba(100, 181, 246, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 75% 75%, rgba(33, 150, 243, 0.1) 0%, transparent 50%)',
      }}
    >
      <Container maxWidth="sm">
        <GlassCard
          sx={{
            textAlign: 'center',
            py: 6,
            px: 4,
          }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h1"
              fontWeight={800}
              sx={{
                fontSize: { xs: '6rem', md: '10rem' },
                background: isDark
                  ? 'linear-gradient(135deg, #64B5F6 0%, #BA68C8 100%)'
                  : 'linear-gradient(135deg, #1976D2 0%, #9C27B0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
              }}
            >
              404
            </Typography>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <SearchOffIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
            </Box>
          </motion.div>

          <Typography variant="h4" fontWeight={700} gutterBottom>
            Page Not Found
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Oops! The page you're looking for doesn't exist or has been moved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Link href="/">
              <GlassButton variant="contained">
                Go Home
              </GlassButton>
            </Link>
            <Link href="/products">
              <GlassButton>
                Browse Products
              </GlassButton>
            </Link>
          </Box>
        </GlassCard>
      </Container>
    </Box>
  );
}
