'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useIsDarkMode } from '@/lib/theme';
import { createGlassStyles } from '@/lib/theme/glass';

interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: React.ReactNode;
  productCount?: number;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'featured';
}

export function CategoryCard({
  id,
  name,
  slug,
  image,
  icon,
  productCount,
  onClick,
  variant = 'default',
}: CategoryCardProps) {
  const isDark = useIsDarkMode();

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            padding: 2,
            borderRadius: '16px',
            ...createGlassStyles('clear', isDark),
            '&:hover': {
              ...createGlassStyles('default', isDark),
            },
          }}
        >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : icon ? (
            icon
          ) : (
            <Typography variant="h5">{name.charAt(0)}</Typography>
          )}
        </Box>
        <Typography variant="body2" fontWeight={500} textAlign="center">
          {name}
        </Typography>
        {productCount !== undefined && (
          <Typography variant="caption" color="text.secondary">
            {productCount} products
          </Typography>
        )}
        </Box>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      >
        <Box
          sx={{
            position: 'relative',
            height: 300,
            borderRadius: '24px',
            overflow: 'hidden',
          }}
        >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: image ? `url(${image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: isDark ? 'grey.800' : 'grey.200',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
          }}
        >
          <Typography variant="h5" fontWeight={700} color="#fff" gutterBottom>
            {name}
          </Typography>
          {productCount !== undefined && (
            <Typography variant="body2" color="rgba(255,255,255,0.8)">
              {productCount} products
            </Typography>
          )}
        </Box>
        </Box>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Box
        sx={{
          ...createGlassStyles('default', isDark),
          borderRadius: '16px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            ...createGlassStyles('elevated', isDark),
          },
        }}
      >
      <Box
        sx={{
          height: 160,
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {image ? (
          <motion.img
            src={image}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
        ) : icon ? (
          <Box sx={{ fontSize: 48, color: 'primary.main' }}>{icon}</Box>
        ) : (
          <Typography variant="h2" color="text.secondary" sx={{ opacity: 0.3 }}>
            {name.charAt(0)}
          </Typography>
        )}
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {name}
        </Typography>
        {productCount !== undefined && (
          <Typography variant="body2" color="text.secondary">
            {productCount} products
          </Typography>
        )}
      </Box>
      </Box>
    </motion.div>
  );
}

export default CategoryCard;
