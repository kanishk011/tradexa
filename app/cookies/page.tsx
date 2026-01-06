'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import CookieIcon from '@mui/icons-material/Cookie';
import { MainLayout } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';
import { appConfig } from '@/config';

const cookieTypes = [
  {
    name: 'Essential Cookies',
    description: 'Required for the website to function properly. Cannot be disabled.',
    required: true,
    cookies: [
      { name: 'session_id', purpose: 'User authentication', duration: 'Session' },
      { name: 'csrf_token', purpose: 'Security protection', duration: 'Session' },
      { name: 'cart_id', purpose: 'Shopping cart functionality', duration: '30 days' },
      { name: 'country', purpose: 'Localization', duration: '1 year' },
    ],
  },
  {
    name: 'Functional Cookies',
    description: 'Enable enhanced functionality and personalization.',
    required: false,
    cookies: [
      { name: 'preferences', purpose: 'User preferences', duration: '1 year' },
      { name: 'recently_viewed', purpose: 'Recently viewed products', duration: '30 days' },
      { name: 'language', purpose: 'Language preference', duration: '1 year' },
      { name: 'currency', purpose: 'Currency preference', duration: '1 year' },
    ],
  },
  {
    name: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website.',
    required: false,
    cookies: [
      { name: '_ga', purpose: 'Google Analytics', duration: '2 years' },
      { name: '_gid', purpose: 'Google Analytics', duration: '24 hours' },
      { name: 'mp_*', purpose: 'Mixpanel analytics', duration: '1 year' },
      { name: 'hotjar', purpose: 'User behavior analytics', duration: '1 year' },
    ],
  },
  {
    name: 'Marketing Cookies',
    description: 'Used to deliver personalized advertisements.',
    required: false,
    cookies: [
      { name: '_fbp', purpose: 'Facebook advertising', duration: '3 months' },
      { name: 'IDE', purpose: 'Google DoubleClick', duration: '1 year' },
      { name: 'NID', purpose: 'Google advertising', duration: '6 months' },
      { name: '_gcl_*', purpose: 'Google Ads conversion', duration: '90 days' },
    ],
  },
];

export default function CookiePolicyPage() {
  const isDark = useIsDarkMode();
  const [preferences, setPreferences] = useState({
    functional: true,
    analytics: true,
    marketing: false,
  });

  const handlePreferenceChange = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({ ...preferences, [type]: event.target.checked });
  };

  const savePreferences = () => {
    console.log('Saving cookie preferences:', preferences);
    // In production, this would save to cookies/localStorage
  };

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
              py: 6,
              px: 4,
              mb: 4,
              background: isDark
                ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 87, 34, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 87, 34, 0.1) 100%)',
            }}
          >
            <CookieIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
              Cookie Policy
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Last updated: December 1, 2024
            </Typography>
          </GlassCard>
        </motion.div>

        {/* Cookie Preferences Card */}
        <GlassCard sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Manage Cookie Preferences
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose which types of cookies you'd like to allow. Your preferences will be saved for future visits.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={<Switch checked disabled />}
              label={
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Essential Cookies
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Always active - required for basic functionality
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start', mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.functional}
                  onChange={handlePreferenceChange('functional')}
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Functional Cookies
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enhanced features and personalization
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start', mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.analytics}
                  onChange={handlePreferenceChange('analytics')}
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Analytics Cookies
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Help us improve our website
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start', mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.marketing}
                  onChange={handlePreferenceChange('marketing')}
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Marketing Cookies
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Personalized advertisements
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start' }}
            />
          </Box>

          <GlassButton variant="contained" onClick={savePreferences}>
            Save Preferences
          </GlassButton>
        </GlassCard>

        {/* Main Content */}
        <GlassCard sx={{ p: { xs: 3, md: 6 } }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            This Cookie Policy explains how {appConfig.name} uses cookies and similar technologies when you visit our website or use our services. By using our services, you consent to the use of cookies as described in this policy.
          </Typography>

          {/* What Are Cookies */}
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            What Are Cookies?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. Cookies can be "persistent" (remain on your device for a set period) or "session" (deleted when you close your browser).
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* Cookie Categories */}
          {cookieTypes.map((type, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h5" fontWeight={700}>
                  {type.name}
                </Typography>
                {type.required && (
                  <Chip label="Required" size="small" color="primary" />
                )}
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {type.description}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Cookie Name</strong></TableCell>
                      <TableCell><strong>Purpose</strong></TableCell>
                      <TableCell><strong>Duration</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {type.cookies.map((cookie) => (
                      <TableRow key={cookie.name}>
                        <TableCell>
                          <code>{cookie.name}</code>
                        </TableCell>
                        <TableCell>{cookie.purpose}</TableCell>
                        <TableCell>{cookie.duration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {index < cookieTypes.length - 1 && <Divider sx={{ my: 4 }} />}
            </Box>
          ))}

          <Divider sx={{ my: 4 }} />

          {/* How to Control Cookies */}
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            How to Control Cookies
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You can control cookies in several ways:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 4 }}>
            <Typography component="li" variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Cookie Preferences:</strong> Use the preference panel above to manage your choices
            </Typography>
            <Typography component="li" variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies through their settings menu
            </Typography>
            <Typography component="li" variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Opt-Out Tools:</strong> Use industry opt-out tools like the NAI Consumer Opt-Out or DAA opt-out page
            </Typography>
            <Typography component="li" variant="body1" color="text.secondary">
              <strong>Do Not Track:</strong> Some browsers support "Do Not Track" signals. We honor these signals where technically feasible
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Note: Disabling certain cookies may affect the functionality of our website. Essential cookies cannot be disabled as they are necessary for the website to function.
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* Browser Instructions */}
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            Managing Cookies in Your Browser
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Here's how to manage cookies in popular browsers:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 4 }}>
            <Typography component="li" variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data
            </Typography>
            <Typography component="li" variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
            </Typography>
            <Typography component="li" variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
            </Typography>
            <Typography component="li" variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Updates */}
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            Updates to This Policy
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will post any changes on this page with an updated "Last Modified" date.
          </Typography>

          {/* Contact */}
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary">
            If you have questions about our use of cookies, please contact us at:
            <br /><br />
            Email: privacy@{appConfig.name.toLowerCase()}.com
            <br />
            Address: 123 Commerce Street, San Francisco, CA 94105
          </Typography>
        </GlassCard>
      </Container>
    </MainLayout>
  );
}
