'use client';

import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsDarkMode } from '@/lib/theme';
import { createGlassStyles } from '@/lib/theme/glass';

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
  fullScreen?: boolean;
  transparent?: boolean;
}

export function LoadingOverlay({
  open,
  message,
  fullScreen = false,
  transparent = false,
}: LoadingOverlayProps) {
  const isDark = useIsDarkMode();

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          ...(!transparent && {
            ...createGlassStyles('elevated', isDark),
            p: 4,
            borderRadius: '24px',
          }),
        }}
      >
        <CircularProgress
          size={48}
          thickness={4}
          sx={{
            color: 'primary.main',
          }}
        />
        {message && (
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        )}
      </Box>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <AnimatePresence>
        {open && (
          <Backdrop
            open={open}
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: isDark
                ? 'rgba(0, 0, 0, 0.7)'
                : 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {content}
          </Backdrop>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark
              ? 'rgba(0, 0, 0, 0.5)'
              : 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 10,
            borderRadius: 'inherit',
          }}
        >
          {content}
        </Box>
      )}
    </AnimatePresence>
  );
}

export default LoadingOverlay;
