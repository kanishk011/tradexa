'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useIsDarkMode } from '@/lib/theme';
import { GlassButton } from './GlassButton';

type EmptyStateType = 'cart' | 'wishlist' | 'search' | 'products' | 'orders' | 'custom';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

const defaultStates: Record<EmptyStateType, { title: string; description: string; icon: React.ReactNode }> = {
  cart: {
    title: 'Your cart is empty',
    description: 'Looks like you haven\'t added any items to your cart yet.',
    icon: <ShoppingCartIcon sx={{ fontSize: 80 }} />,
  },
  wishlist: {
    title: 'Your wishlist is empty',
    description: 'Start adding items you love to your wishlist.',
    icon: <FavoriteIcon sx={{ fontSize: 80 }} />,
  },
  search: {
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
    icon: <SearchIcon sx={{ fontSize: 80 }} />,
  },
  products: {
    title: 'No products available',
    description: 'Check back later for new products.',
    icon: <InventoryIcon sx={{ fontSize: 80 }} />,
  },
  orders: {
    title: 'No orders yet',
    description: 'When you make your first order, it will appear here.',
    icon: <LocalShippingIcon sx={{ fontSize: 80 }} />,
  },
  custom: {
    title: 'Nothing here',
    description: 'There\'s nothing to display at the moment.',
    icon: <InventoryIcon sx={{ fontSize: 80 }} />,
  },
};

export function EmptyState({
  type = 'custom',
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  const isDark = useIsDarkMode();
  const defaultState = defaultStates[type];

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 3,
      }}
    >
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        sx={{
          color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
          mb: 3,
        }}
      >
        {icon || defaultState.icon}
      </Box>

      <Typography variant="h5" fontWeight={600} gutterBottom>
        {title || defaultState.title}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 400, mb: action ? 4 : 0 }}
      >
        {description || defaultState.description}
      </Typography>

      {action && (
        <GlassButton
          variant="contained"
          size="large"
          onClick={action.onClick}
          href={action.href}
        >
          {action.label}
        </GlassButton>
      )}
    </Box>
  );
}

export default EmptyState;
