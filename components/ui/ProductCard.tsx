'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useIsDarkMode } from '@/lib/theme';
import { createGlassStyles } from '@/lib/theme/glass';
import { GlassCard } from './GlassCard';
import { GlassIconButton } from './GlassIconButton';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  isInWishlist?: boolean;
  onAddToCart?: (id: string) => void;
  onAddToWishlist?: (id: string) => void;
  onQuickView?: (id: string) => void;
  onClick?: () => void;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  images,
  rating = 0,
  reviewCount = 0,
  inStock = true,
  isNew = false,
  isFeatured = false,
  discount,
  isInWishlist = false,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onClick,
}: ProductCardProps) {
  const isDark = useIsDarkMode();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist?.(id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(id);
  };

  const discountPercentage = discount || (originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0);

  return (
    <GlassCard
      hoverEffect={false}
      sx={{
        cursor: 'pointer',
        overflow: 'hidden',
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image Container */}
      <Box
        sx={{
          position: 'relative',
          paddingTop: '100%',
          overflow: 'hidden',
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        }}
      >
        <motion.img
          src={images[currentImageIndex] || '/placeholder-product.jpg'}
          alt={name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Badges */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {discountPercentage > 0 && (
            <Chip
              label={`-${discountPercentage}%`}
              size="small"
              sx={{
                backgroundColor: 'error.main',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
          {isNew && (
            <Chip
              label="New"
              size="small"
              sx={{
                backgroundColor: 'success.main',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
          {isFeatured && (
            <Chip
              label="Featured"
              size="small"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
          {!inStock && (
            <Chip
              label="Out of Stock"
              size="small"
              sx={{
                backgroundColor: 'grey.500',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {/* Wishlist Button */}
        <IconButton
          onClick={handleWishlistClick}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            ...createGlassStyles('clear', isDark),
            borderRadius: '50%',
            width: 36,
            height: 36,
          }}
        >
          {isInWishlist ? (
            <FavoriteIcon sx={{ color: 'error.main' }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: 'text.secondary' }} />
          )}
        </IconButton>

        {/* Quick Actions on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                position: 'absolute',
                bottom: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 8,
              }}
            >
              <GlassIconButton
                onClick={handleQuickView}
                tooltip="Quick View"
                sx={{ backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)' }}
              >
                <VisibilityIcon />
              </GlassIconButton>
              <GlassIconButton
                onClick={handleAddToCart}
                tooltip="Add to Cart"
                disabled={!inStock}
                sx={{ backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)' }}
              >
                <AddShoppingCartIcon />
              </GlassIconButton>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Dots */}
        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: isHovered ? 56 : 12,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 0.5,
              transition: 'bottom 0.3s ease',
            }}
          >
            {images.slice(0, 5).map((_, index) => (
              <Box
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: currentImageIndex === index ? 'primary.main' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="body1"
          fontWeight={500}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1,
          }}
        >
          {name}
        </Typography>

        {/* Rating */}
        {rating > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Rating value={rating} precision={0.5} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">
              ({reviewCount})
            </Typography>
          </Box>
        )}

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 'auto' }}>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            ${price.toFixed(2)}
          </Typography>
          {originalPrice && originalPrice > price && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              ${originalPrice.toFixed(2)}
            </Typography>
          )}
        </Box>
      </Box>
    </GlassCard>
  );
}

export default ProductCard;
