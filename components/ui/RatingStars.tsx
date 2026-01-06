'use client';

import React from 'react';
import { Box, Rating, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface RatingStarsProps {
  value: number;
  max?: number;
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
  showCount?: boolean;
  count?: number;
  precision?: number;
  readOnly?: boolean;
  onChange?: (value: number | null) => void;
}

export function RatingStars({
  value,
  max = 5,
  size = 'medium',
  showValue = false,
  showCount = false,
  count = 0,
  precision = 0.5,
  readOnly = true,
  onChange,
}: RatingStarsProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Rating
        value={value}
        max={max}
        precision={precision}
        size={size}
        readOnly={readOnly}
        onChange={(_, newValue) => onChange?.(newValue)}
        emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
      />
      {showValue && (
        <Typography
          variant={size === 'small' ? 'caption' : 'body2'}
          fontWeight={600}
          sx={{ ml: 0.5 }}
        >
          {value.toFixed(1)}
        </Typography>
      )}
      {showCount && count > 0 && (
        <Typography
          variant={size === 'small' ? 'caption' : 'body2'}
          color="text.secondary"
        >
          ({count.toLocaleString()})
        </Typography>
      )}
    </Box>
  );
}

export default RatingStars;
