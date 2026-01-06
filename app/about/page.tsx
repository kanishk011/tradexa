'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Avatar,
  Chip,
  Skeleton,
  Alert,
  Rating,
} from '@mui/material';
import { motion } from 'framer-motion';
import StorefrontIcon from '@mui/icons-material/Storefront';
import GroupsIcon from '@mui/icons-material/Groups';
import PublicIcon from '@mui/icons-material/Public';
import VerifiedIcon from '@mui/icons-material/Verified';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import HandshakeIcon from '@mui/icons-material/Handshake';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { MainLayout } from '@/components/layout';
import { GlassCard } from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';
import { appConfig } from '@/config';
import {
  useTeamMembers,
  useCompanyStats,
  useTestimonials,
  TeamMember,
  CompanyStat,
  Testimonial,
} from '@/lib/hooks/useContent';

const statIcons: Record<string, React.ReactNode> = {
  products: <StorefrontIcon />,
  customers: <GroupsIcon />,
  countries: <PublicIcon />,
  sellers: <VerifiedIcon />,
};

const values = [
  {
    icon: <RocketLaunchIcon sx={{ fontSize: 40 }} />,
    title: 'Innovation',
    description: 'We constantly push boundaries to deliver cutting-edge eCommerce experiences.',
  },
  {
    icon: <HandshakeIcon sx={{ fontSize: 40 }} />,
    title: 'Trust',
    description: 'Building lasting relationships through transparency and reliability.',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 40 }} />,
    title: 'Community',
    description: 'Empowering sellers and connecting buyers with quality products.',
  },
  {
    icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
    title: 'Quality',
    description: 'Ensuring every product meets our high standards of excellence.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function StatSkeleton() {
  return (
    <GlassCard sx={{ textAlign: 'center', py: 4 }}>
      <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 2 }} />
      <Skeleton width="60%" height={48} sx={{ mx: 'auto' }} />
      <Skeleton width="40%" sx={{ mx: 'auto' }} />
    </GlassCard>
  );
}

function TeamMemberSkeleton() {
  return (
    <GlassCard sx={{ textAlign: 'center', py: 4, px: 2 }}>
      <Skeleton variant="circular" width={100} height={100} sx={{ mx: 'auto', mb: 2 }} />
      <Skeleton width="70%" sx={{ mx: 'auto' }} />
      <Skeleton width="50%" sx={{ mx: 'auto', mt: 1 }} />
    </GlassCard>
  );
}

function TestimonialSkeleton() {
  return (
    <GlassCard sx={{ p: 4, height: '100%' }}>
      <Skeleton variant="rectangular" height={80} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="60%" />
          <Skeleton width="40%" />
        </Box>
      </Box>
    </GlassCard>
  );
}

export default function AboutPage() {
  const isDark = useIsDarkMode();
  const { stats, loading: statsLoading, error: statsError } = useCompanyStats();
  const { members, loading: teamLoading, error: teamError } = useTeamMembers({ isFeatured: true });
  const { testimonials, loading: testimonialsLoading } = useTestimonials({ isFeatured: true, limit: 3 });

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
                ? 'linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(186, 104, 200, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)',
            }}
          >
            <Typography variant="overline" color="primary" sx={{ letterSpacing: 2 }}>
              About Us
            </Typography>
            <Typography variant="h2" fontWeight={700} sx={{ mt: 2, mb: 3 }}>
              Welcome to {appConfig.name}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.8 }}
            >
              We're on a mission to revolutionize online shopping by connecting quality sellers
              with discerning buyers. Our platform combines cutting-edge technology with
              exceptional user experience to create the ultimate marketplace.
            </Typography>
          </GlassCard>
        </motion.div>

        {/* Stats Section */}
        {statsError && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Failed to load company stats.
          </Alert>
        )}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {statsLoading
              ? [1, 2, 3, 4].map((i) => (
                  <Grid key={i} size={{ xs: 6, md: 3 }}>
                    <StatSkeleton />
                  </Grid>
                ))
              : stats.map((stat, index) => (
                  <Grid key={stat.id} size={{ xs: 6, md: 3 }}>
                    <motion.div variants={itemVariants}>
                      <GlassCard sx={{ textAlign: 'center', py: 4 }}>
                        <Box sx={{ color: 'primary.main', mb: 2 }}>
                          {statIcons[stat.icon || ''] || <StorefrontIcon />}
                        </Box>
                        <Typography variant="h3" fontWeight={700} color="primary">
                          {stat.value}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </GlassCard>
                    </motion.div>
                  </Grid>
                ))}
          </Grid>
        </motion.div>

        {/* Our Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard sx={{ p: 6, mb: 6 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Our Story
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
              Founded in 2020, {appConfig.name} started with a simple idea: make quality products
              accessible to everyone. What began as a small startup has grown into a thriving
              marketplace serving hundreds of thousands of customers worldwide.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Today, we partner with over 1,000 verified sellers across 50+ countries, offering
              an extensive catalog of products ranging from electronics to fashion, home goods
              to sports equipment. Our commitment to quality, security, and customer satisfaction
              remains at the heart of everything we do.
            </Typography>
          </GlassCard>
        </motion.div>

        {/* Values Section */}
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4, textAlign: 'center' }}>
          Our Values
        </Typography>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {values.map((value, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div variants={itemVariants}>
                  <GlassCard sx={{ textAlign: 'center', py: 4, px: 3, height: '100%' }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>{value.icon}</Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </GlassCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Team Section */}
        {teamError && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Failed to load team members.
          </Alert>
        )}
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4, textAlign: 'center' }}>
          Leadership Team
        </Typography>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {teamLoading
              ? [1, 2, 3, 4].map((i) => (
                  <Grid key={i} size={{ xs: 6, md: 3 }}>
                    <TeamMemberSkeleton />
                  </Grid>
                ))
              : members.map((member, index) => (
                  <Grid key={member.id} size={{ xs: 6, md: 3 }}>
                    <motion.div variants={itemVariants}>
                      <GlassCard sx={{ textAlign: 'center', py: 4, px: 2 }}>
                        <Avatar
                          src={member.avatar}
                          sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                        />
                        <Typography variant="h6" fontWeight={600}>
                          {member.name}
                        </Typography>
                        <Chip
                          label={member.role}
                          size="small"
                          sx={{ mt: 1 }}
                          color="primary"
                          variant="outlined"
                        />
                        {member.department && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                            {member.department}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                          {member.linkedIn && (
                            <Box
                              component="a"
                              href={member.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                            >
                              <LinkedInIcon fontSize="small" />
                            </Box>
                          )}
                          {member.twitter && (
                            <Box
                              component="a"
                              href={member.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                            >
                              <TwitterIcon fontSize="small" />
                            </Box>
                          )}
                        </Box>
                      </GlassCard>
                    </motion.div>
                  </Grid>
                ))}
          </Grid>
        </motion.div>

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 4, textAlign: 'center' }}>
              What People Say
            </Typography>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Grid container spacing={3}>
                {testimonialsLoading
                  ? [1, 2, 3].map((i) => (
                      <Grid key={i} size={{ xs: 12, md: 4 }}>
                        <TestimonialSkeleton />
                      </Grid>
                    ))
                  : testimonials.map((testimonial, index) => (
                      <Grid key={testimonial.id} size={{ xs: 12, md: 4 }}>
                        <motion.div variants={itemVariants}>
                          <GlassCard sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <FormatQuoteIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{ flex: 1, lineHeight: 1.8, mb: 3 }}
                            >
                              "{testimonial.content}"
                            </Typography>
                            {testimonial.rating && (
                              <Rating value={testimonial.rating} readOnly size="small" sx={{ mb: 2 }} />
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar src={testimonial.avatar} sx={{ width: 48, height: 48 }} />
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {testimonial.author}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {testimonial.role}
                                  {testimonial.company && ` at ${testimonial.company}`}
                                </Typography>
                              </Box>
                            </Box>
                          </GlassCard>
                        </motion.div>
                      </Grid>
                    ))}
              </Grid>
            </motion.div>
          </>
        )}
      </Container>
    </MainLayout>
  );
}
