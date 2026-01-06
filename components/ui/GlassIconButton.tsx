'use client';

import React from 'react';
import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { useIsDarkMode } from '@/lib/theme';

interface GlassIconButtonProps extends Omit<IconButtonProps, 'component'> {
  tooltip?: string;
  glassEffect?: boolean;
}

const MotionIconButton = motion.create(IconButton);

export function GlassIconButton({
  tooltip,
  glassEffect = true,
  children,
  sx,
  ...props
}: GlassIconButtonProps) {
  const isDark = useIsDarkMode();

  const glassStyles = glassEffect
    ? {
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.02)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${
          isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'
        }`,
        '&:hover': {
          backgroundColor: isDark
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.06)',
        },
      }
    : {};

  const button = (
    <MotionIconButton
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      sx={{
        ...glassStyles,
        transition: 'all 0.2s ease',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MotionIconButton>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} arrow>
        {button}
      </Tooltip>
    );
  }

  return button;
}

export default GlassIconButton;
