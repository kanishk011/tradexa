'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  Chip,
  IconButton,
  Divider,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Link from 'next/link';
import { useIsDarkMode } from '@/lib/theme';
import { GlassModal } from './GlassModal';
import { GlassButton } from './GlassButton';
import { QuantitySelector } from './QuantitySelector';
import { Product } from '@/lib/hooks/useProducts';

interface QuickViewModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart?: (productId: string, quantity: number) => void;
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  addToCartLoading?: boolean;
}

export function QuickViewModal({
  open,
  onClose,
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false,
  addToCartLoading = false,
}: QuickViewModalProps) {
  const isDark = useIsDarkMode();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  if (!product) return null;

  const images = product.images?.map((img) => img.url) || [];
  const primaryImage = images[0] || '/images/placeholder-product.jpg';
  const discountPercentage = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id, quantity);
      setSnackbarMessage('Added to cart!');
      setShowSnackbar(true);
    }
  };

  const handleAddToWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist(product.id);
      setSnackbarMessage(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
      setShowSnackbar(true);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <GlassModal
        open={open}
        onClose={onClose}
        maxWidth="md"
        showCloseButton
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Image Gallery */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                position: 'relative',
                paddingTop: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex] || primaryImage}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </AnimatePresence>

              {/* Badges */}
              <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {discountPercentage > 0 && (
                  <Chip
                    label={`-${discountPercentage}%`}
                    size="small"
                    sx={{ bgcolor: 'error.main', color: 'white', fontWeight: 600 }}
                  />
                )}
                {product.isFeatured && (
                  <Chip
                    label="Featured"
                    size="small"
                    sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}
                  />
                )}
                {!product.inStock && (
                  <Chip
                    label="Out of Stock"
                    size="small"
                    sx={{ bgcolor: 'grey.500', color: 'white', fontWeight: 600 }}
                  />
                )}
              </Box>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <IconButton
                    onClick={prevImage}
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': { bgcolor: 'white' },
                    }}
                    size="small"
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                  <IconButton
                    onClick={nextImage}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': { bgcolor: 'white' },
                    }}
                    size="small"
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto', pb: 1 }}>
                {images.map((img, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: index === currentImageIndex ? 2 : 1,
                      borderColor: index === currentImageIndex ? 'primary.main' : 'divider',
                      opacity: index === currentImageIndex ? 1 : 0.7,
                      transition: 'all 0.2s',
                      '&:hover': { opacity: 1 },
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      component="img"
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Product Details */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              {product.name}
            </Typography>

            {/* Rating */}
            {product.averageRating > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating value={product.averageRating} precision={0.5} size="small" readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({product.reviewCount} reviews)
                </Typography>
              </Box>
            )}

            {/* Price */}
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 3 }}>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                ${product.price.toFixed(2)}
              </Typography>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  ${product.compareAtPrice.toFixed(2)}
                </Typography>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Stock Status */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color={product.inStock ? 'success.main' : 'error.main'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Typography>
            </Box>

            {/* Quantity Selector */}
            {product.inStock && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Quantity
                </Typography>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={10}
                />
              </Box>
            )}

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <GlassButton
                variant="contained"
                fullWidth
                startIcon={<AddShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={!product.inStock || addToCartLoading}
                loading={addToCartLoading}
              >
                Add to Cart
              </GlassButton>
              <IconButton
                onClick={handleAddToWishlist}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  color: isInWishlist ? 'error.main' : 'text.secondary',
                }}
              >
                {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <ShareIcon />
              </IconButton>
            </Box>

            {/* View Full Details Link */}
            <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
              <Button
                fullWidth
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                onClick={onClose}
              >
                View Full Details
              </Button>
            </Link>

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Categories:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  {product.categories.map((cat) => (
                    <Chip
                      key={cat.id}
                      label={cat.name}
                      size="small"
                      variant="outlined"
                      clickable
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </GlassModal>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default QuickViewModal;
