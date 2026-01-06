'use client';

import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { motion } from 'framer-motion';
import { useIsDarkMode } from '@/lib/theme';

interface GlassChipProps extends Omit<ChipProps, 'component'> {
  glassEffect?: boolean;
}

const MotionChip = motion.create(Chip);

export function GlassChip({
  glassEffect = true,
  sx,
  ...props
}: GlassChipProps) {
  const isDark = useIsDarkMode();

  const glassStyles = glassEffect
    ? {
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.06)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${
          isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
        }`,
        '&:hover': {
          backgroundColor: isDark
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(0, 0, 0, 0.1)',
        },
      }
    : {};

  return (
    <MotionChip
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      sx={{
        ...glassStyles,
        fontWeight: 500,
        ...sx,
      }}
      {...props}
    />
  );
}

export default GlassChip;
