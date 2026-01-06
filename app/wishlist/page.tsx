'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Breadcrumbs,
  Container,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import {
  GlassCard,
  GlassButton,
  ProductCard,
  EmptyState,
} from '@/components/ui';

// Sample wishlist data
const initialWishlistItems = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    price: 199.99,
    originalPrice: 299.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    rating: 4.8,
    reviewCount: 324,
    isNew: true,
  },
  {
    id: '3',
    name: 'Designer Leather Bag',
    slug: 'designer-leather-bag',
    price: 129.99,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
    rating: 4.9,
    reviewCount: 412,
  },
  {
    id: '5',
    name: 'Vintage Camera',
    slug: 'vintage-camera',
    price: 499.99,
    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400'],
    rating: 4.5,
    reviewCount: 89,
  },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

  const handleRemoveFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = (id: string) => {
    console.log('Add to cart:', id);
    // In production, this would call the cart context
  };

  if (wishlistItems.length === 0) {
    return (
      <MainLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            <Typography color="text.primary">Wishlist</Typography>
          </Breadcrumbs>
          <EmptyState
            type="wishlist"
            action={{
              label: 'Browse Products',
              href: '/products',
            }}
          />
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
          <Typography color="text.primary">Wishlist</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FavoriteIcon sx={{ fontSize: 32, color: 'error.main' }} />
            <Typography variant="h4" fontWeight={700}>
              My Wishlist
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ({wishlistItems.length} items)
            </Typography>
          </Box>
          <GlassButton variant="contained" onClick={() => console.log('Add all to cart')}>
            Add All to Cart
          </GlassButton>
        </Box>

        {/* Wishlist Items */}
        <AnimatePresence mode="popLayout">
          <Grid container spacing={3}>
            {wishlistItems.map((item) => (
              <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3 }}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <ProductCard
                    {...item}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleRemoveFromWishlist}
                    onQuickView={(id) => console.log('Quick view:', id)}
                    onClick={() => console.log('View product:', item.slug)}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </AnimatePresence>

        {/* Continue Shopping */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Link href="/products">
            <GlassButton>Continue Shopping</GlassButton>
          </Link>
        </Box>
      </Container>
    </MainLayout>
  );
}
