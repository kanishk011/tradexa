'use client';

import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useIsDarkMode } from '@/lib/theme';
import { glassCardStyles, createGlassStyles, GlassVariant, GlassIntensity } from '@/lib/theme/glass';

interface GlassCardProps extends Omit<BoxProps, 'component'> {
  variant?: GlassVariant;
  intensity?: GlassIntensity;
  animate?: boolean;
  hoverEffect?: boolean;
  children: React.ReactNode;
}

const MotionBox = motion.create(Box);

export function GlassCard({
  variant = 'default',
  intensity,
  animate = true,
  hoverEffect = true,
  children,
  sx,
  ...props
}: GlassCardProps) {
  const isDark = useIsDarkMode();

  const baseStyles = glassCardStyles(isDark);
  const customStyles = intensity ? createGlassStyles(variant, isDark, intensity) : {};

  const motionProps: HTMLMotionProps<'div'> = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    whileHover: hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined,
  } : {};

  return (
    <MotionBox
      {...motionProps}
      sx={{
        ...baseStyles,
        ...customStyles,
        borderRadius: '16px',
        padding: 3,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MotionBox>
  );
}

export default GlassCard;
