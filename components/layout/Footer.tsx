'use client';

import React from 'react';
import {
  Box,
  Container,
  Grid2 as Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  TextField,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SendIcon from '@mui/icons-material/Send';
import Link from 'next/link';
import { useIsDarkMode } from '@/lib/theme';
import { createGlassStyles } from '@/lib/theme/glass';
import { GlassButton } from '@/components/ui/GlassButton';
import { appConfig } from '@/config';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Returns', href: '/returns' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Licenses', href: '/licenses' },
  ],
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Categories', href: '/categories' },
    { label: 'Deals', href: '/deals' },
    { label: 'New Arrivals', href: '/new' },
  ],
};

const socialLinks = [
  { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
  { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
  { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
  { icon: LinkedInIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: YouTubeIcon, href: 'https://youtube.com', label: 'YouTube' },
];

export function Footer() {
  const isDark = useIsDarkMode();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
  };

  return (
    <Box
      component="footer"
      sx={{
        ...createGlassStyles('frosted', isDark),
        borderRadius: 0,
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Brand & Newsletter */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                background: isDark
                  ? 'linear-gradient(135deg, #64B5F6 0%, #BA68C8 100%)'
                  : 'linear-gradient(135deg, #1976D2 0%, #9C27B0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              {appConfig.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {appConfig.seo.description}
            </Typography>

            {/* Newsletter */}
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Subscribe to our newsletter
            </Typography>
            <Box
              component="form"
              onSubmit={handleNewsletterSubmit}
              sx={{ display: 'flex', gap: 1 }}
            >
              <TextField
                size="small"
                placeholder="Your email"
                type="email"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.02)',
                  },
                }}
              />
              <GlassButton type="submit" variant="contained" sx={{ minWidth: 'auto', px: 2 }}>
                <SendIcon />
              </GlassButton>
            </Box>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component={motion.a}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <social.icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Company
            </Typography>
            <Box component="nav">
              {footerLinks.company.map((link) => (
                <MuiLink
                  key={link.href}
                  component={Link}
                  href={link.href}
                  underline="none"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    py: 0.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Support
            </Typography>
            <Box component="nav">
              {footerLinks.support.map((link) => (
                <MuiLink
                  key={link.href}
                  component={Link}
                  href={link.href}
                  underline="none"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    py: 0.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Legal
            </Typography>
            <Box component="nav">
              {footerLinks.legal.map((link) => (
                <MuiLink
                  key={link.href}
                  component={Link}
                  href={link.href}
                  underline="none"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    py: 0.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Shop
            </Typography>
            <Box component="nav">
              {footerLinks.shop.map((link) => (
                <MuiLink
                  key={link.href}
                  component={Link}
                  href={link.href}
                  underline="none"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    py: 0.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} {appConfig.name}. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Made with ❤️
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
