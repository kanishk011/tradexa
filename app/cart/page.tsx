'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Divider,
  Breadcrumbs,
  Container,
} from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  CartItem,
  EmptyState,
  PriceDisplay,
} from '@/components/ui';

// Sample cart data
const initialCartItems = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    price: 199.99,
    originalPrice: 299.99,
    quantity: 1,
    variant: 'Black',
    maxQuantity: 10,
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    price: 349.99,
    quantity: 2,
    variant: 'Silver',
    maxQuantity: 5,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  const handleQuantityChange = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'save10') {
      setCouponApplied(true);
    }
  };

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            <Typography color="text.primary">Cart</Typography>
          </Breadcrumbs>
          <EmptyState
            type="cart"
            action={{
              label: 'Continue Shopping',
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
          <Typography color="text.primary">Cart</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <ShoppingCartIcon sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight={700}>
            Shopping Cart
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid size={{ xs: 12, md: 8 }}>
            <AnimatePresence mode="popLayout">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    {...item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                    onMoveToWishlist={(id) => console.log('Move to wishlist:', id)}
                  />
                ))}
              </Box>
            </AnimatePresence>

            {/* Continue Shopping */}
            <Box sx={{ mt: 3 }}>
              <Link href="/products">
                <GlassButton>Continue Shopping</GlassButton>
              </Link>
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <GlassCard sx={{ position: 'sticky', top: 100 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Order Summary
              </Typography>

              <Box sx={{ my: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight={500}>${subtotal.toFixed(2)}</Typography>
                </Box>

                {couponApplied && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="success.main">Discount (10%)</Typography>
                    <Typography color="success.main" fontWeight={500}>
                      -${discount.toFixed(2)}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography fontWeight={500}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Tax (8%)</Typography>
                  <Typography fontWeight={500}>${tax.toFixed(2)}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight={600}>Total</Typography>
                  <PriceDisplay price={total} size="large" />
                </Box>
              </Box>

              {/* Coupon Code */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Have a coupon?
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <GlassInput
                    placeholder="Enter code"
                    size="small"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  <GlassButton
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                  >
                    Apply
                  </GlassButton>
                </Box>
                {couponApplied && (
                  <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                    Coupon applied successfully!
                  </Typography>
                )}
              </Box>

              <Link href="/checkout" style={{ textDecoration: 'none' }}>
                <GlassButton
                  variant="contained"
                  fullWidth
                  size="large"
                >
                  Proceed to Checkout
                </GlassButton>
              </Link>

              {/* Trust Badges */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Secure checkout powered by Stripe
                </Typography>
              </Box>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}
