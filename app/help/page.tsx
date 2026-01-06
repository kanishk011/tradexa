'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { MainLayout } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';
import { appConfig } from '@/config';

const helpCategories = [
  {
    icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
    title: 'Orders & Shipping',
    description: 'Track orders, shipping info, and delivery status',
    articles: 24,
    color: '#2196F3',
  },
  {
    icon: <PaymentIcon sx={{ fontSize: 40 }} />,
    title: 'Payments & Billing',
    description: 'Payment methods, refunds, and invoices',
    articles: 18,
    color: '#4CAF50',
  },
  {
    icon: <AccountCircleIcon sx={{ fontSize: 40 }} />,
    title: 'Account & Settings',
    description: 'Profile, password, and preferences',
    articles: 15,
    color: '#FF9800',
  },
  {
    icon: <StorefrontIcon sx={{ fontSize: 40 }} />,
    title: 'Selling on ' + appConfig.name,
    description: 'Seller tools, listings, and policies',
    articles: 32,
    color: '#9C27B0',
  },
  {
    icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
    title: 'Returns & Refunds',
    description: 'Return policy, process, and status',
    articles: 12,
    color: '#F44336',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Security & Privacy',
    description: 'Account security and data protection',
    articles: 10,
    color: '#607D8B',
  },
];

const popularArticles = [
  { title: 'How to track my order?', category: 'Orders & Shipping', views: '15.2K' },
  { title: 'How do I return an item?', category: 'Returns & Refunds', views: '12.8K' },
  { title: 'Payment methods accepted', category: 'Payments & Billing', views: '10.5K' },
  { title: 'How to become a seller?', category: 'Selling', views: '9.3K' },
  { title: 'Reset my password', category: 'Account & Settings', views: '8.1K' },
  { title: 'Shipping times and costs', category: 'Orders & Shipping', views: '7.6K' },
];

const quickFaqs = [
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 day delivery. International orders may take 10-14 business days.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some categories like electronics have a 14-day return window.',
  },
  {
    question: 'How do I contact a seller?',
    answer: 'You can contact sellers directly through the product page by clicking "Contact Seller" or from your order details page after making a purchase.',
  },
  {
    question: 'Are my payment details secure?',
    answer: 'Yes, we use industry-standard SSL encryption and never store your full payment details. All transactions are processed through secure payment gateways.',
  },
  {
    question: 'How do I leave a review?',
    answer: 'After your order is delivered, you\'ll receive an email invitation to leave a review. You can also go to your order history and click "Write a Review" for any delivered item.',
  },
];

export default function HelpCenterPage() {
  const isDark = useIsDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);

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
                ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(76, 175, 80, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(76, 175, 80, 0.15) 100%)',
            }}
          >
            <SupportAgentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
              How can we help?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
            >
              Search our knowledge base or browse categories below
            </Typography>
            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
              <TextField
                fullWidth
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                  },
                }}
              />
            </Box>
          </GlassCard>
        </motion.div>

        {/* Help Categories */}
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
          Browse by Category
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {helpCategories.map((category, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    height: '100%',
                    '&:hover': { transform: 'translateY(-4px)' },
                    transition: 'transform 0.3s',
                  }}
                >
                  <Box sx={{ color: category.color, mb: 2 }}>{category.icon}</Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>
                  <Typography variant="caption" color="primary">
                    {category.articles} articles
                  </Typography>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Two Column Layout */}
        <Grid container spacing={4}>
          {/* Popular Articles */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
              Popular Articles
            </Typography>
            <GlassCard sx={{ p: 0 }}>
              {popularArticles.map((article, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2.5,
                    borderBottom: index < popularArticles.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {article.title}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {article.category}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {article.views} views
                    </Typography>
                  </Box>
                </Box>
              ))}
            </GlassCard>
          </Grid>

          {/* Quick FAQs */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
              Quick Answers
            </Typography>
            {quickFaqs.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expandedFaq === `faq-${index}`}
                onChange={(_, expanded) =>
                  setExpandedFaq(expanded ? `faq-${index}` : false)
                }
                sx={{
                  mb: 1,
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    borderRadius: 2,
                    mb: 0.5,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard sx={{ mt: 6, p: 6 }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2, textAlign: 'center' }}>
              Still Need Help?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, textAlign: 'center', maxWidth: 600, mx: 'auto' }}
            >
              Our support team is available 24/7 to assist you with any questions or issues.
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <GlassCard
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                    transition: 'transform 0.3s',
                  }}
                >
                  <ChatIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Live Chat
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Get instant help from our support team
                  </Typography>
                  <GlassButton variant="contained" size="small">
                    Start Chat
                  </GlassButton>
                </GlassCard>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <GlassCard
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                    transition: 'transform 0.3s',
                  }}
                >
                  <EmailIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Email Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    support@{appConfig.name.toLowerCase()}.com
                  </Typography>
                  <GlassButton variant="outlined" size="small">
                    Send Email
                  </GlassButton>
                </GlassCard>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <GlassCard
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                    transition: 'transform 0.3s',
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Phone Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    1-800-{appConfig.name.toUpperCase().substring(0, 4)}
                  </Typography>
                  <GlassButton variant="outlined" size="small">
                    Call Now
                  </GlassButton>
                </GlassCard>
              </Grid>
            </Grid>
          </GlassCard>
        </motion.div>
      </Container>
    </MainLayout>
  );
}
