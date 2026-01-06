'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import BlockIcon from '@mui/icons-material/Block';
import Link from 'next/link';
import { useIsDarkMode } from '@/lib/theme';
import { GlassButton, GlassCard } from '@/components/ui';

export default function UnauthorizedPage() {
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
          ? 'radial-gradient(circle at 25% 25%, rgba(239, 83, 80, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 25% 25%, rgba(211, 47, 47, 0.1) 0%, transparent 50%)',
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
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: 'error.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <BlockIcon sx={{ fontSize: 50, color: '#fff' }} />
            </Box>
          </motion.div>

          <Typography variant="h3" fontWeight={700} gutterBottom>
            Access Denied
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Link href="/">
              <GlassButton variant="contained">
                Go Home
              </GlassButton>
            </Link>
            <Link href="/login">
              <GlassButton>
                Sign In
              </GlassButton>
            </Link>
          </Box>
        </GlassCard>
      </Container>
    </Box>
  );
}
