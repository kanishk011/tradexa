'use client';

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  SelectProps,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useIsDarkMode } from '@/lib/theme';
import { glassInputStyles } from '@/lib/theme/glass';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface GlassSelectProps extends Omit<SelectProps, 'variant'> {
  options: SelectOption[];
  helperText?: string;
}

export function GlassSelect({
  label,
  options,
  helperText,
  error,
  fullWidth = true,
  sx,
  ...props
}: GlassSelectProps) {
  const isDark = useIsDarkMode();
  const inputStyles = glassInputStyles(isDark);

  return (
    <FormControl fullWidth={fullWidth} error={error} sx={sx}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        label={label}
        sx={{
          borderRadius: '12px',
          backgroundColor: isDark
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.02)',
          backdropFilter: 'blur(8px)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(0, 0, 0, 0.15)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark
              ? 'rgba(100, 181, 246, 0.5)'
              : 'rgba(33, 150, 243, 0.5)',
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 1,
              borderRadius: '12px',
              backgroundColor: isDark
                ? 'rgba(30, 30, 30, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: isDark
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.15)',
            },
          },
        }}
        {...props}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export default GlassSelect;
