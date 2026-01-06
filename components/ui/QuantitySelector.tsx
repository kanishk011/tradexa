'use client';

import React from 'react';
import { Box, IconButton, Typography, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { motion } from 'framer-motion';
import { useIsDarkMode } from '@/lib/theme';
import { createGlassStyles } from '@/lib/theme/glass';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: 'small' | 'medium';
  disabled?: boolean;
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  size = 'medium',
  disabled = false,
}: QuantitySelectorProps) {
  const isDark = useIsDarkMode();

  const handleIncrement = () => {
    if (value < max) {
      onChange?.(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange?.(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange?.(newValue);
    }
  };

  const buttonSize = size === 'small' ? 28 : 36;
  const inputWidth = size === 'small' ? 40 : 50;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        ...createGlassStyles('clear', isDark),
        borderRadius: size === 'small' ? '8px' : '12px',
        overflow: 'hidden',
      }}
    >
      <IconButton
        component={motion.button}
        whileTap={{ scale: 0.9 }}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        sx={{
          width: buttonSize,
          height: buttonSize,
          borderRadius: 0,
          color: disabled || value <= min ? 'text.disabled' : 'text.primary',
        }}
      >
        <RemoveIcon fontSize={size === 'small' ? 'small' : 'medium'} />
      </IconButton>

      <TextField
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        inputProps={{
          min,
          max,
          style: {
            textAlign: 'center',
            padding: size === 'small' ? '4px 0' : '8px 0',
            width: inputWidth,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': { border: 'none' },
          },
          '& input': {
            textAlign: 'center',
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
          },
        }}
        type="number"
        variant="outlined"
      />

      <IconButton
        component={motion.button}
        whileTap={{ scale: 0.9 }}
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        sx={{
          width: buttonSize,
          height: buttonSize,
          borderRadius: 0,
          color: disabled || value >= max ? 'text.disabled' : 'text.primary',
        }}
      >
        <AddIcon fontSize={size === 'small' ? 'small' : 'medium'} />
      </IconButton>
    </Box>
  );
}

export default QuantitySelector;
