'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Skeleton,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { MainLayout } from '@/components/layout';
import { GlassCard } from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';
import { useRootCategories, Category } from '@/lib/hooks/useProducts';

const categoryGradients = [
  'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
  'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)',
  'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)',
  'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  'linear-gradient(135deg, #11998E 0%, #38EF7D 100%)',
  'linear-gradient(135deg, #FC466B 0%, #3F5EFB 100%)',
  'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
  'linear-gradient(135deg, #4481EB 0%, #04BEFE 100%)',
];

function CategorySkeleton() {
  return (
    <GlassCard sx={{ p: 3, height: 200 }}>
      <Skeleton variant="circular" width={60} height={60} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" />
    </GlassCard>
  );
}

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const isDark = useIsDarkMode();
  const gradient = categoryGradients[index % categoryGradients.length];

  return (
    <Link href={`/products?category=${category.slug}`} style={{ textDecoration: 'none' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <GlassCard
          sx={{
            p: 3,
            height: 200,
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: isDark
                ? '0 20px 40px rgba(0, 0, 0, 0.3)'
                : '0 20px 40px rgba(0, 0, 0, 0.1)',
            },
            '&:hover .arrow-icon': {
              transform: 'translateX(4px)',
              opacity: 1,
            },
          }}
        >
          {/* Background gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: gradient,
              opacity: isDark ? 0.15 : 0.1,
              transition: 'opacity 0.3s ease',
              '&:hover': { opacity: isDark ? 0.25 : 0.15 },
            }}
          />

          {/* Icon */}
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '16px',
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              position: 'relative',
            }}
          >
            {category.image ? (
              <Box
                component="img"
                src={category.image}
                alt={category.name}
                sx={{
                  width: 36,
                  height: 36,
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            ) : (
              <CategoryIcon sx={{ fontSize: 28, color: 'white' }} />
            )}
          </Box>

          {/* Content */}
          <Box sx={{ position: 'relative', flex: 1 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
              {category.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
            </Typography>

            {category.description && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mt: 1,
                }}
              >
                {category.description}
              </Typography>
            )}
          </Box>

          {/* Arrow indicator */}
          <Box
            className="arrow-icon"
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              opacity: 0.5,
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowForwardIcon color="primary" />
          </Box>

          {/* Subcategories indicator */}
          {category.children && category.children.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '12px',
                px: 1.5,
                py: 0.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {category.children.length} subcategories
              </Typography>
            </Box>
          )}
        </GlassCard>
      </motion.div>
    </Link>
  );
}

export default function CategoriesPage() {
  const isDark = useIsDarkMode();
  const { categories, loading, error } = useRootCategories();

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
              mb: 6,
              background: isDark
                ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.15) 0%, rgba(233, 30, 99, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(103, 58, 183, 0.1) 0%, rgba(233, 30, 99, 0.1) 100%)',
            }}
          >
            <CategoryIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
              Shop by Category
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Browse our wide selection of products organized by category
            </Typography>
          </GlassCard>
        </motion.div>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Failed to load categories. Please try again later.
          </Alert>
        )}

        {/* Categories Grid */}
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <CategorySkeleton />
                </Grid>
              ))
            : categories.map((category, index) => (
                <Grid key={category.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <CategoryCard category={category} index={index} />
                </Grid>
              ))}
        </Grid>

        {/* Empty State */}
        {!loading && categories.length === 0 && !error && (
          <GlassCard sx={{ p: 6, textAlign: 'center' }}>
            <CategoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
              No Categories Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Check back soon for new product categories.
            </Typography>
          </GlassCard>
        )}

        {/* Browse All Products CTA */}
        {!loading && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard sx={{ mt: 6, p: 4, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                Can&apos;t Find What You&apos;re Looking For?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Browse our complete product catalog to discover more items.
              </Typography>
              <Link href="/products" style={{ textDecoration: 'none' }}>
                <Box
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    px: 4,
                    py: 1.5,
                    bgcolor: 'primary.main',
                    color: 'white',
                    border: 'none',
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  Browse All Products
                  <ArrowForwardIcon fontSize="small" />
                </Box>
              </Link>
            </GlassCard>
          </motion.div>
        )}
      </Container>
    </MainLayout>
  );
}
