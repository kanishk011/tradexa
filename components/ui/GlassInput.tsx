'use client';

import React from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { useIsDarkMode } from '@/lib/theme';
import { glassInputStyles } from '@/lib/theme/glass';

interface GlassInputProps extends Omit<TextFieldProps, 'variant'> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function GlassInput({
  startIcon,
  endIcon,
  sx,
  InputProps,
  ...props
}: GlassInputProps) {
  const isDark = useIsDarkMode();
  const glassStyles = glassInputStyles(isDark);

  return (
    <TextField
      variant="outlined"
      fullWidth
      sx={{
        ...glassStyles,
        ...sx,
      }}
      InputProps={{
        ...InputProps,
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : InputProps?.startAdornment,
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : InputProps?.endAdornment,
      }}
      {...props}
    />
  );
}

export default GlassInput;
