'use client';

import React, { useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Skeleton,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PaymentIcon from '@mui/icons-material/Payment';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import {
  Banner,
  ProductCard,
  CategoryCard,
  GlassCard,
  GlassButton,
  QuickViewModal,
  ProductCardSkeleton,
} from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';

// Redux hooks
import {
  useAppSelector,
  useAppDispatch,
  useReduxCart,
  useReduxWishlist,
  useQuickView,
  useNotifications,
} from '@/lib/store/hooks';
import {
  selectFeaturedProducts,
  selectFeaturedLoading,
  selectCategories,
  selectCategoriesLoading,
  fetchProducts,
} from '@/lib/store/slices/productsSlice';
import { useHeroBanners, Banner as BannerType } from '@/lib/hooks/useBanners';
import { transformProductForCard, Product } from '@/lib/hooks/useProducts';

const features = [
  { icon: <LocalShippingIcon sx={{ fontSize: 40 }} />, title: 'Free Shipping', description: 'On orders over $50' },
  { icon: <SecurityIcon sx={{ fontSize: 40 }} />, title: 'Secure Payment', description: '100% secure checkout' },
  { icon: <SupportAgentIcon sx={{ fontSize: 40 }} />, title: '24/7 Support', description: 'Dedicated support team' },
  { icon: <PaymentIcon sx={{ fontSize: 40 }} />, title: 'Easy Returns', description: '30-day return policy' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

function transformBannersToSlides(banners: BannerType[]) {
  if (banners.length === 0) {
    return [
      {
        id: '1',
        title: 'Discover Premium Quality',
        subtitle: 'New Collection 2025',
        description: 'Shop the latest trends with exclusive deals up to 50% off',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        alignment: 'left' as const,
      },
    ];
  }

  return banners.map((banner) => ({
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle || '',
    description: banner.description || '',
    image: banner.imageUrl,
    buttonText: banner.linkText || 'Shop Now',
    buttonLink: banner.linkUrl || '/products',
    alignment: 'left' as const,
  }));
}

function CategorySkeleton() {
  return (
    <GlassCard sx={{ p: 2, height: 180 }}>
      <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, mb: 2 }} />
      <Skeleton width="60%" />
      <Skeleton width="40%" />
    </GlassCard>
  );
}

export default function HomePage() {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Redux state
  const featuredProducts = useAppSelector(selectFeaturedProducts);
  const featuredLoading = useAppSelector(selectFeaturedLoading);
  const categories = useAppSelector(selectCategories);
  const categoriesLoading = useAppSelector(selectCategoriesLoading);

  // Redux hooks
  const { add: addToCart, isUpdating: addToCartLoading } = useReduxCart();
  const { toggle: toggleWishlist, isInWishlist, productIds: wishlistProductIds } = useReduxWishlist();
  const { isOpen: quickViewOpen, productId: quickViewProductId, open: openQuickView, close: closeQuickView } = useQuickView();
  const { latestNotification, hide: hideNotification } = useNotifications();

  // Banner data (still using Apollo hook as banners are content-specific)
  const { banners, loading: bannersLoading } = useHeroBanners();
  const bannerSlides = transformBannersToSlides(banners);

  // New arrivals (using separate query for newest products)
  const [newProducts, setNewProducts] = React.useState<Product[]>([]);
  const [newLoading, setNewLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch new arrivals
    dispatch(fetchProducts({ sortBy: 'NEWEST', limit: 4 }))
      .then((result) => {
        if (result.meta.requestStatus === 'fulfilled' && result.payload) {
          setNewProducts((result.payload as any).products || []);
        }
      })
      .finally(() => setNewLoading(false));
  }, [dispatch]);

  // Get quick view product
  const quickViewProduct = React.useMemo(() => {
    if (!quickViewProductId) return null;
    return [...featuredProducts, ...newProducts].find((p) => p.id === quickViewProductId) || null;
  }, [quickViewProductId, featuredProducts, newProducts]);

  const handleAddToCart = useCallback(async (productId: string) => {
    await addToCart(productId, 1);
  }, [addToCart]);

  const handleAddToWishlist = useCallback(async (productId: string) => {
    await toggleWishlist(productId);
  }, [toggleWishlist]);

  const handleQuickView = useCallback((productId: string) => {
    openQuickView(productId);
  }, [openQuickView]);

  const handleProductClick = useCallback((slug: string) => {
    router.push(`/products/${slug}`);
  }, [router]);

  const handleQuickViewAddToCart = useCallback(async (productId: string, quantity: number) => {
    await addToCart(productId, quantity);
  }, [addToCart]);

  // Filter for root categories only
  const rootCategories = categories.filter((cat) => !cat.slug?.includes('/'));

  return (
    <MainLayout disableContainer>
      {/* Hero Banner */}
      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        {bannersLoading ? (
          <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 3 }} />
        ) : (
          <Banner slides={bannerSlides} height={500} />
        )}
      </Container>

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid key={index} size={{ xs: 6, md: 3 }}>
              <GlassCard
                animate={false}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  py: 3,
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Categories */}
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Shop by Category
          </Typography>
          <GlassButton
            endIcon={<ArrowForwardIcon />}
            href="/categories"
          >
            View All
          </GlassButton>
        </Box>
        <Grid container spacing={3}>
          {categoriesLoading
            ? [1, 2, 3, 4].map((i) => (
                <Grid key={i} size={{ xs: 6, sm: 6, md: 3 }}>
                  <CategorySkeleton />
                </Grid>
              ))
            : rootCategories.slice(0, 4).map((category) => (
                <Grid key={category.id} size={{ xs: 6, sm: 6, md: 3 }}>
                  <CategoryCard
                    id={category.id}
                    name={category.name}
                    slug={category.slug}
                    image={category.image || undefined}
                    productCount={category.productCount}
                    variant="default"
                    onClick={() => router.push(`/products?category=${category.slug}`)}
                  />
                </Grid>
              ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Featured Products
          </Typography>
          <GlassButton
            endIcon={<ArrowForwardIcon />}
            href="/products"
          >
            View All
          </GlassButton>
        </Box>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={3}>
            {featuredLoading
              ? [1, 2, 3, 4].map((i) => (
                  <Grid key={i} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
                    <ProductCardSkeleton />
                  </Grid>
                ))
              : featuredProducts.slice(0, 4).map((product) => (
                  <Grid key={product.id} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
                    <motion.div variants={itemVariants}>
                      <ProductCard
                        {...transformProductForCard(product)}
                        isInWishlist={isInWishlist(product.id)}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleAddToWishlist}
                        onQuickView={handleQuickView}
                        onClick={() => handleProductClick(product.slug)}
                      />
                    </motion.div>
                  </Grid>
                ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Promotional Banner */}
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <GlassCard
          variant="elevated"
          sx={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.2) 0%, rgba(186, 104, 200, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(156, 39, 176, 0.15) 100%)',
            py: 6,
            px: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="overline" color="primary" sx={{ letterSpacing: 2 }}>
            Limited Time Offer
          </Typography>
          <Typography variant="h3" fontWeight={700} sx={{ my: 2 }}>
            Get 20% Off Your First Order
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Sign up for our newsletter and receive an exclusive discount code for your first purchase.
          </Typography>
          <GlassButton variant="contained" size="large" sx={{ px: 4 }}>
            Subscribe Now
          </GlassButton>
        </GlassCard>
      </Container>

      {/* New Arrivals */}
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            New Arrivals
          </Typography>
          <GlassButton
            endIcon={<ArrowForwardIcon />}
            href="/new-arrivals"
          >
            View All
          </GlassButton>
        </Box>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={3}>
            {newLoading
              ? [1, 2, 3, 4].map((i) => (
                  <Grid key={i} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
                    <ProductCardSkeleton />
                  </Grid>
                ))
              : newProducts.slice(0, 4).map((product) => (
                  <Grid key={product.id} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
                    <motion.div variants={itemVariants}>
                      <ProductCard
                        {...transformProductForCard(product)}
                        isNew
                        isInWishlist={isInWishlist(product.id)}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleAddToWishlist}
                        onQuickView={handleQuickView}
                        onClick={() => handleProductClick(product.slug)}
                      />
                    </motion.div>
                  </Grid>
                ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Quick View Modal */}
      <QuickViewModal
        open={quickViewOpen}
        onClose={closeQuickView}
        product={quickViewProduct}
        onAddToCart={handleQuickViewAddToCart}
        onAddToWishlist={handleAddToWishlist}
        isInWishlist={quickViewProduct ? isInWishlist(quickViewProduct.id) : false}
        addToCartLoading={addToCartLoading}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!latestNotification}
        autoHideDuration={latestNotification?.autoHideDuration ?? 3000}
        onClose={() => latestNotification && hideNotification(latestNotification.id)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => latestNotification && hideNotification(latestNotification.id)}
          severity={latestNotification?.severity ?? 'success'}
          variant="filled"
        >
          {latestNotification?.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}
