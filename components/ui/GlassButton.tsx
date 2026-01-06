'use client';

import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useIsDarkMode } from '@/lib/theme';
import { glassButtonStyles } from '@/lib/theme/glass';

interface GlassButtonProps extends Omit<ButtonProps, 'component'> {
  loading?: boolean;
  glassEffect?: boolean;
  target?: string;
  rel?: string;
}

const MotionButton = motion.create(Button);

export function GlassButton({
  children,
  loading = false,
  glassEffect = true,
  disabled,
  sx,
  ...props
}: GlassButtonProps) {
  const isDark = useIsDarkMode();
  const glassStyles = glassEffect ? glassButtonStyles(isDark) : {};

  return (
    <MotionButton
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      sx={{
        ...glassStyles,
        position: 'relative',
        minWidth: 120,
        ...sx,
      }}
      {...props}
    >
      {loading && (
        <CircularProgress
          size={20}
          sx={{
            position: 'absolute',
            left: '50%',
            marginLeft: '-10px',
            color: 'inherit',
          }}
        />
      )}
      <span style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </span>
    </MotionButton>
  );
}

export default GlassButton;
