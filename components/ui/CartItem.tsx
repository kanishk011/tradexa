'use client';

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useIsDarkMode } from '@/lib/theme';
import { createGlassStyles } from '@/lib/theme/glass';
import { QuantitySelector } from './QuantitySelector';

interface CartItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxQuantity?: number;
  variant?: string;
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  onMoveToWishlist?: (id: string) => void;
}

export function CartItem({
  id,
  name,
  image,
  price,
  originalPrice,
  quantity,
  maxQuantity = 99,
  variant,
  onQuantityChange,
  onRemove,
  onMoveToWishlist,
}: CartItemProps) {
  const isDark = useIsDarkMode();

  const handleQuantityChange = (newQuantity: number) => {
    onQuantityChange?.(id, newQuantity);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
      sx={{
        ...createGlassStyles('default', isDark),
        borderRadius: '16px',
        p: 2,
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
      }}
    >
      {/* Image */}
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: '12px',
          overflow: 'hidden',
          flexShrink: 0,
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        }}
      >
        <motion.img
          src={image}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          whileHover={{ scale: 1.05 }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </Typography>

        {variant && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {variant}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            ${(price * quantity).toFixed(2)}
          </Typography>
          {originalPrice && originalPrice > price && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              ${(originalPrice * quantity).toFixed(2)}
            </Typography>
          )}
        </Box>

        <Typography variant="caption" color="text.secondary">
          ${price.toFixed(2)} each
        </Typography>
      </Box>

      {/* Actions */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 1,
        }}
      >
        <QuantitySelector
          value={quantity}
          min={1}
          max={maxQuantity}
          onChange={handleQuantityChange}
          size="small"
        />

        <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
          {onMoveToWishlist && (
            <Tooltip title="Move to Wishlist">
              <IconButton
                size="small"
                onClick={() => onMoveToWishlist(id)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main' },
                }}
              >
                <FavoriteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onRemove && (
            <Tooltip title="Remove">
              <IconButton
                size="small"
                onClick={() => onRemove(id)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main' },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default CartItem;
