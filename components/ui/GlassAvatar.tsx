'use client';

import React from 'react';
import { Avatar, AvatarProps, Badge, BadgeProps, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useIsDarkMode } from '@/lib/theme';

interface GlassAvatarProps extends Omit<AvatarProps, 'component'> {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  online?: boolean;
  glassEffect?: boolean;
  badgeContent?: React.ReactNode;
  badgeProps?: Partial<BadgeProps>;
}

const sizeMap = {
  small: 32,
  medium: 40,
  large: 56,
  xlarge: 80,
};

export function GlassAvatar({
  size = 'medium',
  online,
  glassEffect = true,
  badgeContent,
  badgeProps,
  sx,
  ...props
}: GlassAvatarProps) {
  const isDark = useIsDarkMode();
  const dimension = sizeMap[size];

  const glassStyles = glassEffect
    ? {
        border: `2px solid ${
          isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.8)'
        }`,
        boxShadow: isDark
          ? '0 4px 12px rgba(0, 0, 0, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.1)',
      }
    : {};

  const avatar = (
    <motion.div whileHover={{ scale: 1.05 }} style={{ display: 'inline-block' }}>
      <Avatar
        sx={{
          width: dimension,
          height: dimension,
          fontSize: dimension * 0.4,
          ...glassStyles,
          ...sx,
        }}
        {...props}
      />
    </motion.div>
  );

  if (online !== undefined || badgeContent) {
    return (
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          badgeContent || (
            <span
              style={{
                width: size === 'small' ? 8 : 12,
                height: size === 'small' ? 8 : 12,
                borderRadius: '50%',
                backgroundColor: online ? '#4CAF50' : '#9E9E9E',
                border: `2px solid ${isDark ? '#141414' : '#fff'}`,
              }}
            />
          )
        }
        {...badgeProps}
      >
        {avatar}
      </Badge>
    );
  }

  return avatar;
}

export default GlassAvatar;
