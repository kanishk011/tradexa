'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  Avatar,
  Pagination,
  Skeleton,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { MainLayout } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';
import { appConfig } from '@/config';
import { useBlogPosts, useFeaturedBlogPosts, useBlogCategories, BlogPost } from '@/lib/hooks/useContent';

function PostSkeleton() {
  return (
    <GlassCard sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={180} />
      <Box sx={{ p: 2.5 }}>
        <Skeleton width="30%" sx={{ mb: 1.5 }} />
        <Skeleton width="90%" />
        <Skeleton width="70%" />
        <Skeleton width="80%" sx={{ mt: 1 }} />
      </Box>
    </GlassCard>
  );
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function BlogPostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const isDark = useIsDarkMode();

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <GlassCard
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.3s',
          '&:hover': { transform: 'translateY(-4px)' },
          '&:hover img': { transform: 'scale(1.05)' },
        }}
      >
        <Box sx={{ overflow: 'hidden', height: featured ? 250 : 180 }}>
          <Box
            component="img"
            src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600'}
            alt={post.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s',
            }}
          />
        </Box>
        <Box sx={{ p: featured ? 3 : 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 1, mb: featured ? 2 : 1.5 }}>
            <Chip
              label={post.category?.name || 'General'}
              size="small"
              color="primary"
            />
            {post.isFeatured && (
              <Chip
                label="Featured"
                size="small"
                sx={{ bgcolor: 'warning.main', color: 'white' }}
              />
            )}
          </Box>
          <Typography
            variant={featured ? 'h5' : 'subtitle1'}
            fontWeight={600}
            sx={{ mb: featured ? 2 : 1 }}
          >
            {post.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flex: 1,
              lineHeight: 1.7,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: featured ? 3 : 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {post.excerpt}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: featured ? 3 : 2,
              pt: featured ? 0 : 2,
              borderTop: featured ? 0 : 1,
              borderColor: 'divider',
            }}
          >
            {featured ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={post.authorAvatar}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography variant="body2">{post.author}</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(post.publishedAt)}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption" color="text.secondary">
                {post.readTime || 5} min read
              </Typography>
            </Box>
          </Box>
        </Box>
      </GlassCard>
    </Link>
  );
}

export default function BlogPage() {
  const isDark = useIsDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);

  const { categories } = useBlogCategories();
  const { posts: featuredPosts, loading: featuredLoading } = useFeaturedBlogPosts(2);
  const { posts, pageInfo, loading, error } = useBlogPosts({
    filter: {
      search: searchQuery || undefined,
      categorySlug: selectedCategory || undefined,
    },
    page,
    limit: 9,
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
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" color="primary" sx={{ letterSpacing: 2 }}>
              {appConfig.name} Blog
            </Typography>
            <Typography variant="h2" fontWeight={700} sx={{ mt: 1, mb: 2 }}>
              Insights & Resources
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Expert tips, industry trends, and success stories to help you thrive in eCommerce.
            </Typography>
          </Box>
        </motion.div>

        {/* Featured Posts */}
        {(featuredLoading || featuredPosts.length > 0) && (
          <>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
              Featured Articles
            </Typography>
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {featuredLoading
                ? [1, 2].map((i) => (
                    <Grid key={i} size={{ xs: 12, md: 6 }}>
                      <PostSkeleton />
                    </Grid>
                  ))
                : featuredPosts.map((post, index) => (
                    <Grid key={post.id} size={{ xs: 12, md: 6 }}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <BlogPostCard post={post} featured />
                      </motion.div>
                    </Grid>
                  ))}
            </Grid>
          </>
        )}

        {/* Filters */}
        <GlassCard sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                fullWidth
                label="Category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </GlassCard>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Failed to load blog posts. Please try again later.
          </Alert>
        )}

        {/* All Posts */}
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          All Articles {pageInfo && `(${pageInfo.total})`}
        </Typography>
        <Grid container spacing={3}>
          {loading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <PostSkeleton />
                </Grid>
              ))
            : posts.map((post, index) => (
                <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BlogPostCard post={post} />
                  </motion.div>
                </Grid>
              ))}
        </Grid>

        {/* Empty State */}
        {!loading && posts.length === 0 && !error && (
          <GlassCard sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
              No Articles Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filter criteria.
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

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard
            variant="elevated"
            sx={{
              mt: 6,
              p: 6,
              textAlign: 'center',
              background: isDark
                ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(186, 104, 200, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)',
            }}
          >
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              Subscribe to Our Newsletter
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              Get the latest articles, tips, and insights delivered straight to your inbox.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                maxWidth: 500,
                mx: 'auto',
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <TextField
                fullWidth
                placeholder="Enter your email"
                variant="outlined"
              />
              <GlassButton variant="contained" sx={{ minWidth: 150 }}>
                Subscribe
              </GlassButton>
            </Box>
          </GlassCard>
        </motion.div>
      </Container>
    </MainLayout>
  );
}
