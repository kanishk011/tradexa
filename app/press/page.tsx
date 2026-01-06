'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Chip,
  Avatar,
  Skeleton,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { MainLayout } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';
import { appConfig } from '@/config';
import { usePressReleases, useFeaturedPressReleases, PressRelease } from '@/lib/hooks/useContent';

const mediaKitAssets = [
  { name: 'Logo Package (All Formats)', size: '2.5 MB', type: 'ZIP' },
  { name: 'Brand Guidelines', size: '5.2 MB', type: 'PDF' },
  { name: 'Executive Photos', size: '15 MB', type: 'ZIP' },
  { name: 'Product Screenshots', size: '8.3 MB', type: 'ZIP' },
  { name: 'Company Fact Sheet', size: '1.1 MB', type: 'PDF' },
];

const featuredIn = [
  { name: 'TechCrunch', logo: 'https://logo.clearbit.com/techcrunch.com' },
  { name: 'Forbes', logo: 'https://logo.clearbit.com/forbes.com' },
  { name: 'Bloomberg', logo: 'https://logo.clearbit.com/bloomberg.com' },
  { name: 'The Verge', logo: 'https://logo.clearbit.com/theverge.com' },
  { name: 'Wired', logo: 'https://logo.clearbit.com/wired.com' },
  { name: 'Business Insider', logo: 'https://logo.clearbit.com/businessinsider.com' },
];

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function PressReleaseSkeleton() {
  return (
    <GlassCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Skeleton variant="rectangular" height={200} />
      <Box sx={{ p: 3, flex: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton width={80} height={24} />
          <Skeleton width={100} height={24} />
        </Box>
        <Skeleton width="90%" height={28} />
        <Skeleton width="70%" height={28} sx={{ mb: 2 }} />
        <Skeleton width="100%" />
        <Skeleton width="80%" />
      </Box>
    </GlassCard>
  );
}

function PressReleaseCard({ release, index }: { release: PressRelease; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/press/${release.slug}`} style={{ textDecoration: 'none' }}>
        <GlassCard
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            cursor: 'pointer',
            '&:hover': { transform: 'translateY(-4px)' },
            transition: 'transform 0.3s',
          }}
        >
          <Box
            sx={{
              height: 200,
              backgroundImage: `url(${release.coverImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {release.source && (
                <Chip label={release.source} size="small" color="primary" />
              )}
              <Chip
                icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />}
                label={formatDate(release.publishedAt)}
                size="small"
                variant="outlined"
              />
              {release.isFeatured && (
                <Chip label="Featured" size="small" sx={{ bgcolor: 'warning.main', color: 'white' }} />
              )}
            </Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              {release.title}
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
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {release.excerpt}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <GlassButton size="small">Read More</GlassButton>
            </Box>
          </Box>
        </GlassCard>
      </Link>
    </motion.div>
  );
}

export default function PressPage() {
  const isDark = useIsDarkMode();
  const { releases: featuredReleases, loading: featuredLoading } = useFeaturedPressReleases(4);
  const { releases, loading, error } = usePressReleases({ limit: 20 });

  const displayReleases = featuredLoading ? [] : (featuredReleases.length > 0 ? featuredReleases : releases.slice(0, 4));

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
                ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(244, 67, 54, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(244, 67, 54, 0.1) 100%)',
            }}
          >
            <NewspaperIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
              Press & Media
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
            >
              Get the latest news, press releases, and media resources about {appConfig.name}.
            </Typography>
            <GlassButton
              variant="contained"
              startIcon={<EmailIcon />}
              size="large"
            >
              Contact Press Team
            </GlassButton>
          </GlassCard>
        </motion.div>

        {/* Featured In */}
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, textAlign: 'center' }}>
          As Featured In
        </Typography>
        <GlassCard sx={{ p: 4, mb: 6 }}>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {featuredIn.map((media, index) => (
              <Grid key={index} size={{ xs: 4, sm: 2 }}>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      opacity: 0.7,
                      filter: isDark ? 'brightness(0) invert(1)' : 'none',
                      '&:hover': { opacity: 1 },
                      transition: 'opacity 0.3s',
                    }}
                  >
                    <Avatar
                      src={media.logo}
                      alt={media.name}
                      sx={{ width: 60, height: 60 }}
                      variant="square"
                    />
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </GlassCard>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Failed to load press releases. Please try again later.
          </Alert>
        )}

        {/* Press Releases */}
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
          Latest Press Releases
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {loading || featuredLoading ? (
            [1, 2, 3, 4].map((i) => (
              <Grid key={i} size={{ xs: 12, md: 6 }}>
                <PressReleaseSkeleton />
              </Grid>
            ))
          ) : displayReleases.length > 0 ? (
            displayReleases.map((release, index) => (
              <Grid key={release.id} size={{ xs: 12, md: 6 }}>
                <PressReleaseCard release={release} index={index} />
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <GlassCard sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No press releases available
                </Typography>
              </GlassCard>
            </Grid>
          )}
        </Grid>

        {/* Media Kit */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
              Media Kit
            </Typography>
            <GlassCard sx={{ p: 3 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Download official {appConfig.name} logos, brand guidelines, and other assets
                for press and media use.
              </Typography>
              {mediaKitAssets.map((asset, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 2,
                    borderBottom: index < mediaKitAssets.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {asset.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {asset.type} • {asset.size}
                    </Typography>
                  </Box>
                  <GlassButton size="small" startIcon={<DownloadIcon />}>
                    Download
                  </GlassButton>
                </Box>
              ))}
            </GlassCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
              Press Contact
            </Typography>
            <GlassCard sx={{ p: 4 }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                For press inquiries, interview requests, or additional information,
                please contact our media relations team.
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Media Relations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  press@{appConfig.name.toLowerCase()}.com
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Response Time
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We typically respond within 24 hours
                </Typography>
              </Box>
              <GlassButton
                variant="contained"
                fullWidth
                startIcon={<EmailIcon />}
              >
                Send Press Inquiry
              </GlassButton>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}
