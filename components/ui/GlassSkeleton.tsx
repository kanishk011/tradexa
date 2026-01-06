'use client';

import React from 'react';
import { Skeleton, SkeletonProps, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useIsDarkMode } from '@/lib/theme';

interface GlassSkeletonProps extends SkeletonProps {
  glassEffect?: boolean;
}

export function GlassSkeleton({
  glassEffect = true,
  sx,
  ...props
}: GlassSkeletonProps) {
  const isDark = useIsDarkMode();

  const glassStyles = glassEffect
    ? {
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.06)',
        '&::after': {
          background: isDark
            ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
        },
      }
    : {};

  return (
    <Skeleton
      animation="wave"
      sx={{
        ...glassStyles,
        borderRadius: '8px',
        ...sx,
      }}
      {...props}
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{ width: '100%' }}
    >
      <GlassSkeleton variant="rectangular" height={200} sx={{ borderRadius: '16px 16px 0 0' }} />
      <Box sx={{ p: 2 }}>
        <GlassSkeleton variant="text" width="80%" height={24} />
        <GlassSkeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <GlassSkeleton variant="text" width="30%" height={28} />
          <GlassSkeleton variant="circular" width={36} height={36} />
        </Box>
      </Box>
    </Box>
  );
}

// List Item Skeleton
export function ListItemSkeleton() {
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <GlassSkeleton variant="circular" width={48} height={48} />
      <Box sx={{ flex: 1 }}>
        <GlassSkeleton variant="text" width="60%" height={20} />
        <GlassSkeleton variant="text" width="40%" height={16} sx={{ mt: 0.5 }} />
      </Box>
      <GlassSkeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: '8px' }} />
    </Box>
  );
}

export default GlassSkeleton;
