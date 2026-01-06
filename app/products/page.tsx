'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Drawer,
  IconButton,
  Divider,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  useTheme as useMuiTheme,
  Breadcrumbs,
  Pagination,
  Container,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useIsDarkMode } from '@/lib/theme';
import { createGlassStyles } from '@/lib/theme/glass';
import { MainLayout } from '@/components/layout';
import {
  ProductCard,
  GlassCard,
  GlassButton,
  GlassSelect,
  GlassInput,
  GlassTabs,
  ProductCardSkeleton,
} from '@/components/ui';
import { useProducts, transformProductForCard, type ProductSortBy } from '@/lib/hooks/useProducts';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Fashion' },
  { value: 'home-garden', label: 'Home & Living' },
  { value: 'sports-outdoors', label: 'Sports' },
];

const sortOptions = [
  { value: 'NEWEST', label: 'Newest' },
  { value: 'POPULAR', label: 'Popular' },
  { value: 'PRICE_ASC', label: 'Price: Low to High' },
  { value: 'PRICE_DESC', label: 'Price: High to Low' },
  { value: 'RATING', label: 'Top Rated' },
];

const brands = ['Apple', 'Samsung', 'Nike', 'Sony', 'Adidas', 'Bose'];

export default function ProductsPage() {
  const isDark = useIsDarkMode();
  const muiTheme = useMuiTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<ProductSortBy>('NEWEST');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState(0);

  // Build filter object
  const filter = useMemo(() => {
    const f: Record<string, unknown> = {};
    if (searchQuery) f.search = searchQuery;
    if (selectedCategory !== 'all') {
      // Would need to map category slug to ID
    }
    if (priceRange[0] > 0) f.minPrice = priceRange[0];
    if (priceRange[1] < 1000) f.maxPrice = priceRange[1];
    if (minRating > 0) f.minRating = minRating;
    return f;
  }, [searchQuery, selectedCategory, priceRange, minRating]);

  // Fetch products from API
  const { products, pageInfo, loading, error } = useProducts({
    filter,
    sortBy,
    page,
    limit: 12,
  });

  // Transform products for ProductCard component
  const displayProducts = useMemo(() => {
    return products.map((product) => {
      const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.compareAtPrice,
        images: primaryImage ? [primaryImage.url] : ['https://via.placeholder.com/400'],
        rating: product.averageRating,
        reviewCount: product.reviewCount,
        isFeatured: product.isFeatured,
      };
    });
  }, [products]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  const FilterContent = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Filters
      </Typography>

      {/* Price Range */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            ${priceRange[0]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${priceRange[1]}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Category */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Category
        </Typography>
        <GlassSelect
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as string)}
          options={categories}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Brands */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Brands
        </Typography>
        <FormGroup>
          {brands.map((brand) => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  size="small"
                />
              }
              label={brand}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Rating */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Minimum Rating
        </Typography>
        <GlassTabs
          tabs={[
            { label: 'Any', value: 0 },
            { label: '3+', value: 3 },
            { label: '4+', value: 4 },
          ]}
          value={minRating}
          onChange={(val) => setMinRating(val as number)}
        />
      </Box>

      <GlassButton
        variant="contained"
        fullWidth
        onClick={() => {
          setPage(1);
          setFilterDrawerOpen(false);
        }}
      >
        Apply Filters
      </GlassButton>
    </Box>
  );

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Home
          </Link>
          <Typography color="text.primary">Products</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>
            All Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pageInfo?.total || displayProducts.length} products found
          </Typography>
        </Box>

        {/* Toolbar */}
        <GlassCard animate={false} sx={{ mb: 4, p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            {isMobile && (
              <GlassButton
                startIcon={<FilterListIcon />}
                onClick={() => setFilterDrawerOpen(true)}
              >
                Filters
              </GlassButton>
            )}

            <Box sx={{ flex: 1, minWidth: 200 }}>
              <GlassInput
                placeholder="Search products..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SortIcon color="action" />
              <GlassSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as ProductSortBy)}
                options={sortOptions}
                sx={{ minWidth: 180 }}
              />
            </Box>
          </Box>
        </GlassCard>

        <Grid container spacing={3}>
          {/* Sidebar Filters (Desktop) */}
          {!isMobile && (
            <Grid size={{ md: 3 }}>
              <GlassCard animate={false} sx={{ position: 'sticky', top: 100 }}>
                <FilterContent />
              </GlassCard>
            </Grid>
          )}

          {/* Products Grid */}
          <Grid size={{ xs: 12, md: isMobile ? 12 : 9 }}>
            <AnimatePresence mode="wait">
              {loading ? (
                <Grid container spacing={3}>
                  {[...Array(8)].map((_, i) => (
                    <Grid key={i} size={{ xs: 6, sm: 4, lg: 3 }}>
                      <ProductCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="error">
                    Failed to load products. Please try again.
                  </Typography>
                  <GlassButton sx={{ mt: 2 }} onClick={() => window.location.reload()}>
                    Retry
                  </GlassButton>
                </Box>
              ) : displayProducts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="text.secondary">
                    No products found matching your criteria.
                  </Typography>
                </Box>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Grid container spacing={3}>
                    {displayProducts.map((product) => (
                      <Grid key={product.id} size={{ xs: 6, sm: 4, lg: isMobile ? 4 : 4 }}>
                        <ProductCard
                          {...product}
                          onAddToCart={(id) => console.log('Add to cart:', id)}
                          onAddToWishlist={(id) => console.log('Add to wishlist:', id)}
                          onQuickView={(id) => console.log('Quick view:', id)}
                          onClick={() => handleProductClick(product.slug)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {pageInfo && pageInfo.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={pageInfo.totalPages}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="left"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: 300,
              ...createGlassStyles('frosted', isDark),
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Filters
            </Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <FilterContent />
        </Drawer>
      </Container>
    </MainLayout>
  );
}
