'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'small' | 'medium' | 'large';
  showDiscount?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export function PriceDisplay({
  price,
  originalPrice,
  currency = '$',
  size = 'medium',
  showDiscount = true,
  layout = 'horizontal',
}: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  const fontSizes = {
    small: { price: '1rem', original: '0.75rem', badge: '0.625rem' },
    medium: { price: '1.5rem', original: '0.875rem', badge: '0.75rem' },
    large: { price: '2rem', original: '1rem', badge: '0.875rem' },
  };

  const sizes = fontSizes[size];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: layout === 'vertical' ? 'column' : 'row',
        alignItems: layout === 'vertical' ? 'flex-start' : 'baseline',
        gap: layout === 'vertical' ? 0.5 : 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography
          component={motion.span}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          variant="h6"
          fontWeight={700}
          color="primary.main"
          sx={{ fontSize: sizes.price }}
        >
          {currency}
          {price.toFixed(2)}
        </Typography>

        {hasDiscount && showDiscount && (
          <Box
            component={motion.span}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{
              backgroundColor: 'error.main',
              color: '#fff',
              px: 0.75,
              py: 0.25,
              borderRadius: '4px',
              fontSize: sizes.badge,
              fontWeight: 600,
              ml: 0.5,
            }}
          >
            -{discountPercentage}%
          </Box>
        )}
      </Box>

      {hasDiscount && (
        <Typography
          component={motion.span}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          variant="body2"
          color="text.secondary"
          sx={{
            textDecoration: 'line-through',
            fontSize: sizes.original,
          }}
        >
          {currency}
          {originalPrice.toFixed(2)}
        </Typography>
      )}
    </Box>
  );
}

export default PriceDisplay;
