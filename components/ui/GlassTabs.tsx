'use client';

import React from 'react';
import { Tabs, TabsProps, Tab, TabProps, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useIsDarkMode } from '@/lib/theme';

interface GlassTabItem {
  label: string;
  value: string | number;
  icon?: React.ReactElement;
  disabled?: boolean;
}

interface GlassTabsProps extends Omit<TabsProps, 'onChange'> {
  tabs: GlassTabItem[];
  value: string | number;
  onChange: (value: string | number) => void;
  glassEffect?: boolean;
}

export function GlassTabs({
  tabs,
  value,
  onChange,
  glassEffect = true,
  sx,
  ...props
}: GlassTabsProps) {
  const isDark = useIsDarkMode();

  const containerStyles = glassEffect
    ? {
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.03)',
        backdropFilter: 'blur(8px)',
        borderRadius: '12px',
        padding: '4px',
      }
    : {};

  const handleChange = (_event: React.SyntheticEvent, newValue: string | number) => {
    onChange(newValue);
  };

  return (
    <Box sx={containerStyles}>
      <Tabs
        value={value}
        onChange={handleChange}
        sx={{
          minHeight: 'auto',
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          '& .MuiTabs-flexContainer': {
            gap: 1,
          },
          ...sx,
        }}
        {...props}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            icon={tab.icon}
            iconPosition="start"
            disabled={tab.disabled}
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            sx={{
              minHeight: 40,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              color: 'text.secondary',
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                color: 'primary.main',
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 0.8)',
                boxShadow: isDark
                  ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                  : '0 2px 8px rgba(0, 0, 0, 0.08)',
              },
              '&:hover:not(.Mui-selected)': {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.03)',
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}

export default GlassTabs;
