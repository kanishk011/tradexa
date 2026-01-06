'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Skeleton,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
} from '@mui/material';
import { motion } from 'framer-motion';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { MainLayout } from '@/components/layout';
import { GlassCard, ProductCard } from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';
import { useProducts, transformProductForCard, ProductSortBy } from '@/lib/hooks/useProducts';

function ProductSkeleton() {
  return (
    <GlassCard sx={{ p: 2 }}>
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </GlassCard>
  );
}

function CountdownTimer() {
  const [time] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
      {Object.entries(time).map(([unit, value]) => (
        <Box key={unit} sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2,
              px: 2,
              py: 1,
              minWidth: 60,
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              {value.toString().padStart(2, '0')}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {unit.charAt(0).toUpperCase() + unit.slice(1)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default function DealsPage() {
  const isDark = useIsDarkMode();
  const [sortBy, setSortBy] = useState<ProductSortBy>('POPULAR');
  const [page, setPage] = useState(1);
  const limit = 12;

  // Filter for products with discount (compareAtPrice > price)
  const { products, pageInfo, loading, error } = useProducts({
    sortBy,
    page,
    limit,
  });

  // Filter products that have discounts
  const dealsProducts = products.filter(
    (p) => p.compareAtPrice && p.compareAtPrice > p.price
  );

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard
            variant="elevated"
            sx={{
              textAlign: 'center',
              py: 8,
              px: 4,
              mb: 4,
              background: isDark
                ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(255, 152, 0, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(244, 67, 54, 0.15) 0%, rgba(255, 152, 0, 0.15) 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Animated background shapes */}
            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(244, 67, 54, 0.2) 100%)',
              }}
            />

            <Box sx={{ position: 'relative' }}>
              <Chip
                icon={<WhatshotIcon />}
                label="Hot Deals"
                color="error"
                sx={{ mb: 2 }}
              />
              <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
                Today&apos;s Best Deals
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
              >
                Save big on top products. Limited time offers you won&apos;t want to miss!
              </Typography>

              {/* Countdown Timer */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                  <AccessTimeIcon color="error" />
                  <Typography variant="subtitle1" fontWeight={600} color="error.main">
                    Deal ends in:
                  </Typography>
                </Box>
                <CountdownTimer />
              </Box>
            </Box>
          </GlassCard>
        </motion.div>

        {/* Deal Highlights */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { icon: <LocalOfferIcon />, title: 'Up to 70% Off', subtitle: 'On selected items' },
            { icon: <WhatshotIcon />, title: 'Flash Sales', subtitle: 'New deals every hour' },
            { icon: <AccessTimeIcon />, title: 'Limited Time', subtitle: 'While stocks last' },
          ].map((highlight, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '12px',
                      bgcolor: 'error.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {highlight.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {highlight.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {highlight.subtitle}
                    </Typography>
                  </Box>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Filters */}
        <GlassCard sx={{ p: 3, mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {loading ? 'Loading...' : `${dealsProducts.length} deals found`}
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value as ProductSortBy)}
              >
                <MenuItem value="POPULAR">Most Popular</MenuItem>
                <MenuItem value="PRICE_ASC">Price: Low to High</MenuItem>
                <MenuItem value="PRICE_DESC">Price: High to Low</MenuItem>
                <MenuItem value="RATING">Best Rated</MenuItem>
                <MenuItem value="NEWEST">Newest First</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </GlassCard>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Failed to load deals. Please try again later.
          </Alert>
        )}

        {/* Products Grid */}
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <ProductSkeleton />
                </Grid>
              ))
            : dealsProducts.map((product, index) => (
                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard
                      {...transformProductForCard(product)}
                      discount={product.discountPercentage}
                    />
                  </motion.div>
                </Grid>
              ))}
        </Grid>

        {/* Empty State */}
        {!loading && dealsProducts.length === 0 && !error && (
          <GlassCard sx={{ p: 6, textAlign: 'center' }}>
            <LocalOfferIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
              No Deals Available Right Now
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Check back soon for exciting new deals and discounts!
            </Typography>
          </GlassCard>
        )}

        {/* Pagination */}
        {pageInfo && pageInfo.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={pageInfo.totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="large"
            />
          </Box>
        )}

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard
            sx={{
              mt: 6,
              p: 4,
              textAlign: 'center',
              background: isDark
                ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(244, 67, 54, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(244, 67, 54, 0.05) 100%)',
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              Never Miss a Deal!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Subscribe to our newsletter and get exclusive deals delivered to your inbox.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                maxWidth: 500,
                mx: 'auto',
              }}
            >
              <Box
                component="input"
                placeholder="Enter your email"
                sx={{
                  flex: 1,
                  px: 3,
                  py: 1.5,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                  color: 'text.primary',
                  fontSize: '1rem',
                  outline: 'none',
                  '&:focus': {
                    borderColor: 'primary.main',
                  },
                }}
              />
              <Box
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  px: 4,
                  py: 1.5,
                  bgcolor: 'error.main',
                  color: 'white',
                  border: 'none',
                  borderRadius: 2,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                Subscribe
              </Box>
            </Box>
          </GlassCard>
        </motion.div>
      </Container>
    </MainLayout>
  );
}
