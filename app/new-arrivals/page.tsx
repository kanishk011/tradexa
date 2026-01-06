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
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedIcon from '@mui/icons-material/Verified';
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

export default function NewArrivalsPage() {
  const isDark = useIsDarkMode();
  const [sortBy, setSortBy] = useState<ProductSortBy>('NEWEST');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const limit = 12;

  const { products, pageInfo, loading, error } = useProducts({
    sortBy,
    page,
    limit,
  });

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
                ? 'linear-gradient(135deg, rgba(0, 188, 212, 0.2) 0%, rgba(103, 58, 183, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(0, 188, 212, 0.15) 0%, rgba(103, 58, 183, 0.15) 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative elements */}
            <Box
              component={motion.div}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              sx={{
                position: 'absolute',
                top: 20,
                right: '10%',
                fontSize: 60,
                opacity: 0.2,
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 'inherit' }} />
            </Box>
            <Box
              component={motion.div}
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              sx={{
                position: 'absolute',
                bottom: 20,
                left: '10%',
                fontSize: 40,
                opacity: 0.2,
              }}
            >
              <NewReleasesIcon sx={{ fontSize: 'inherit' }} />
            </Box>

            <Box sx={{ position: 'relative' }}>
              <Chip
                icon={<NewReleasesIcon />}
                label="Just Landed"
                color="secondary"
                sx={{ mb: 2 }}
              />
              <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
                New Arrivals
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: 'auto' }}
              >
                Be the first to discover our latest products. Fresh styles and cutting-edge tech just for you.
              </Typography>
            </Box>
          </GlassCard>
        </motion.div>

        {/* Features */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              icon: <NewReleasesIcon />,
              title: 'Latest Products',
              subtitle: 'Updated daily',
              color: 'secondary.main',
            },
            {
              icon: <TrendingUpIcon />,
              title: 'Trending Now',
              subtitle: 'Popular picks',
              color: 'primary.main',
            },
            {
              icon: <VerifiedIcon />,
              title: 'Quality Assured',
              subtitle: 'Premium selection',
              color: 'success.main',
            },
          ].map((feature, index) => (
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
                      bgcolor: feature.color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.subtitle}
                    </Typography>
                  </Box>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Filters & View Toggle */}
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
              {loading
                ? 'Loading...'
                : `${pageInfo?.total || products.length} new products`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as ProductSortBy)}
                >
                  <MenuItem value="NEWEST">Newest First</MenuItem>
                  <MenuItem value="POPULAR">Most Popular</MenuItem>
                  <MenuItem value="PRICE_ASC">Price: Low to High</MenuItem>
                  <MenuItem value="PRICE_DESC">Price: High to Low</MenuItem>
                  <MenuItem value="RATING">Best Rated</MenuItem>
                </Select>
              </FormControl>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, value) => value && setViewMode(value)}
                size="small"
              >
                <ToggleButton value="grid">
                  <ViewModuleIcon />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </GlassCard>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Failed to load products. Please try again later.
          </Alert>
        )}

        {/* Products Grid */}
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Grid
                  key={index}
                  size={{
                    xs: 12,
                    sm: viewMode === 'list' ? 12 : 6,
                    md: viewMode === 'list' ? 12 : 4,
                    lg: viewMode === 'list' ? 12 : 3,
                  }}
                >
                  <ProductSkeleton />
                </Grid>
              ))
            : products.map((product, index) => (
                <Grid
                  key={product.id}
                  size={{
                    xs: 12,
                    sm: viewMode === 'list' ? 12 : 6,
                    md: viewMode === 'list' ? 12 : 4,
                    lg: viewMode === 'list' ? 12 : 3,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {viewMode === 'list' ? (
                      <GlassCard
                        sx={{
                          p: 2,
                          display: 'flex',
                          gap: 3,
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            width: 150,
                            height: 150,
                            borderRadius: 2,
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <Box
                            component="img"
                            src={
                              product.images?.[0]?.url ||
                              '/images/placeholder-product.jpg'
                            }
                            alt={product.name}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Chip
                            label="New"
                            size="small"
                            color="secondary"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="h6" fontWeight={600}>
                            {product.name}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mt: 1,
                            }}
                          >
                            <Typography variant="h6" color="primary.main" fontWeight={700}>
                              ${product.price.toFixed(2)}
                            </Typography>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textDecoration: 'line-through' }}
                              >
                                ${product.compareAtPrice.toFixed(2)}
                              </Typography>
                            )}
                          </Box>
                          {product.averageRating > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {'★'.repeat(Math.round(product.averageRating))} ({product.reviewCount} reviews)
                            </Typography>
                          )}
                        </Box>
                      </GlassCard>
                    ) : (
                      <ProductCard
                        {...transformProductForCard(product)}
                        isNew={true}
                      />
                    )}
                  </motion.div>
                </Grid>
              ))}
        </Grid>

        {/* Empty State */}
        {!loading && products.length === 0 && !error && (
          <GlassCard sx={{ p: 6, textAlign: 'center' }}>
            <NewReleasesIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
              No New Products Yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Check back soon for exciting new arrivals!
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

        {/* CTA Section */}
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
                ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.1) 0%, rgba(0, 188, 212, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(103, 58, 183, 0.05) 0%, rgba(0, 188, 212, 0.05) 100%)',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              Stay Ahead of the Trends
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              Follow us on social media to be the first to know about new arrivals, exclusive launches, and special promotions.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                <Box
                  key={social}
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    px: 3,
                    py: 1,
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {social}
                </Box>
              ))}
            </Box>
          </GlassCard>
        </motion.div>
      </Container>
    </MainLayout>
  );
}
