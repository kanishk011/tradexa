// ===========================================
// LIQUID GLASS DESIGN SYSTEM
// iOS 26.2 Inspired Glass Effects
// ===========================================

import { SxProps, Theme } from '@mui/material';

/**
 * Glass effect intensity levels
 */
export type GlassIntensity = 'light' | 'medium' | 'strong' | 'ultra';

/**
 * Glass variant types
 */
export type GlassVariant = 'default' | 'elevated' | 'frosted' | 'clear';

/**
 * Get blur value based on intensity
 */
function getBlurValue(intensity: GlassIntensity): string {
  switch (intensity) {
    case 'light': return '8px';
    case 'medium': return '16px';
    case 'strong': return '24px';
    case 'ultra': return '40px';
    default: return '16px';
  }
}

/**
 * Glass effect configuration for light mode
 */
export const lightGlass = {
  default: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  },
  elevated: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(24px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  frosted: {
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(40px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  clear: {
    background: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(8px) saturate(120%)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
  },
};

/**
 * Glass effect configuration for dark mode
 */
export const darkGlass = {
  default: {
    background: 'rgba(30, 30, 30, 0.7)',
    backdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
  },
  elevated: {
    background: 'rgba(40, 40, 40, 0.85)',
    backdropFilter: 'blur(24px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  frosted: {
    background: 'rgba(20, 20, 20, 0.6)',
    backdropFilter: 'blur(40px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
  },
  clear: {
    background: 'rgba(30, 30, 30, 0.4)',
    backdropFilter: 'blur(8px) saturate(120%)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
  },
};

/**
 * Glass style object type (plain object to allow spreading)
 */
export interface GlassStyleObject {
  background: string;
  backdropFilter: string;
  WebkitBackdropFilter: string;
  border: string;
  boxShadow: string;
  transition: string;
}

/**
 * Create glass effect styles (returns plain object for spreading)
 */
export function createGlassStyles(
  variant: GlassVariant = 'default',
  isDark: boolean = false,
  intensity?: GlassIntensity
): GlassStyleObject {
  const glass = isDark ? darkGlass : lightGlass;
  const baseStyles = glass[variant];

  return {
    background: baseStyles.background,
    backdropFilter: intensity
      ? `blur(${getBlurValue(intensity)}) saturate(180%)`
      : baseStyles.backdropFilter,
    WebkitBackdropFilter: intensity
      ? `blur(${getBlurValue(intensity)}) saturate(180%)`
      : baseStyles.backdropFilter,
    border: baseStyles.border,
    boxShadow: baseStyles.boxShadow,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };
}

/**
 * Glass card styles
 */
export function glassCardStyles(isDark: boolean = false): SxProps<Theme> {
  return {
    ...createGlassStyles('default', isDark),
    borderRadius: '16px',
    overflow: 'hidden',
    '&:hover': {
      ...createGlassStyles('elevated', isDark),
      transform: 'translateY(-2px)',
    },
  };
}

/**
 * Glass button styles
 */
export function glassButtonStyles(isDark: boolean = false): SxProps<Theme> {
  const glass = isDark ? darkGlass : lightGlass;

  return {
    ...createGlassStyles('clear', isDark),
    borderRadius: '12px',
    padding: '10px 24px',
    fontWeight: 600,
    textTransform: 'none',
    '&:hover': {
      background: glass.default.background,
      backdropFilter: glass.default.backdropFilter,
      WebkitBackdropFilter: glass.default.backdropFilter,
      transform: 'translateY(-1px)',
      boxShadow: glass.elevated.boxShadow,
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  };
}

/**
 * Glass input styles
 */
export function glassInputStyles(isDark: boolean = false): SxProps<Theme> {
  const colors = isDark
    ? { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)', focus: 'rgba(255, 255, 255, 0.2)' }
    : { bg: 'rgba(0, 0, 0, 0.02)', border: 'rgba(0, 0, 0, 0.1)', focus: 'rgba(0, 0, 0, 0.15)' };

  return {
    '& .MuiOutlinedInput-root': {
      backgroundColor: colors.bg,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      '& fieldset': {
        borderColor: colors.border,
        transition: 'border-color 0.2s ease',
      },
      '&:hover fieldset': {
        borderColor: colors.focus,
      },
      '&.Mui-focused fieldset': {
        borderColor: isDark ? 'rgba(100, 181, 246, 0.5)' : 'rgba(33, 150, 243, 0.5)',
        borderWidth: '2px',
      },
    },
  };
}

/**
 * Glass modal/dialog styles
 */
export function glassModalStyles(isDark: boolean = false): SxProps<Theme> {
  return {
    ...createGlassStyles('frosted', isDark),
    borderRadius: '24px',
    padding: '24px',
  };
}

/**
 * Glass navbar styles
 */
export function glassNavbarStyles(isDark: boolean = false): SxProps<Theme> {
  return {
    ...createGlassStyles('elevated', isDark),
    borderRadius: 0,
    borderBottom: isDark
      ? '1px solid rgba(255, 255, 255, 0.08)'
      : '1px solid rgba(0, 0, 0, 0.05)',
  };
}

/**
 * Glass sidebar styles
 */
export function glassSidebarStyles(isDark: boolean = false): SxProps<Theme> {
  return {
    ...createGlassStyles('frosted', isDark),
    borderRadius: 0,
    borderRight: isDark
      ? '1px solid rgba(255, 255, 255, 0.08)'
      : '1px solid rgba(0, 0, 0, 0.05)',
  };
}

export default {
  lightGlass,
  darkGlass,
  createGlassStyles,
  glassCardStyles,
  glassButtonStyles,
  glassInputStyles,
  glassModalStyles,
  glassNavbarStyles,
  glassSidebarStyles,
};
