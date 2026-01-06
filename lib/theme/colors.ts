// ===========================================
// COLOR PALETTE
// Liquid Glass Design System
// ===========================================

export const colors = {
  // Primary colors
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },

  // Secondary colors
  secondary: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#9C27B0',
    600: '#8E24AA',
    700: '#7B1FA2',
    800: '#6A1B9A',
    900: '#4A148C',
  },

  // Accent colors
  accent: {
    cyan: '#00BCD4',
    teal: '#009688',
    pink: '#E91E63',
    orange: '#FF9800',
    green: '#4CAF50',
  },

  // Neutral colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Glass effect colors
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.7)',
      backgroundHover: 'rgba(255, 255, 255, 0.85)',
      border: 'rgba(255, 255, 255, 0.3)',
      shadow: 'rgba(0, 0, 0, 0.1)',
      text: 'rgba(0, 0, 0, 0.87)',
      textSecondary: 'rgba(0, 0, 0, 0.6)',
    },
    dark: {
      background: 'rgba(30, 30, 30, 0.7)',
      backgroundHover: 'rgba(40, 40, 40, 0.85)',
      border: 'rgba(255, 255, 255, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.3)',
      text: 'rgba(255, 255, 255, 0.95)',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
    },
  },

  // Semantic colors
  success: {
    light: '#4CAF50',
    main: '#2E7D32',
    dark: '#1B5E20',
    contrastText: '#FFFFFF',
  },
  warning: {
    light: '#FF9800',
    main: '#ED6C02',
    dark: '#E65100',
    contrastText: '#FFFFFF',
  },
  error: {
    light: '#EF5350',
    main: '#D32F2F',
    dark: '#C62828',
    contrastText: '#FFFFFF',
  },
  info: {
    light: '#03A9F4',
    main: '#0288D1',
    dark: '#01579B',
    contrastText: '#FFFFFF',
  },
} as const;

export type ColorPalette = typeof colors;
export default colors;
