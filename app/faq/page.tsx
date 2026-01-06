'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Chip,
  Skeleton,
  Alert,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { MainLayout } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';
import { useFAQCategories, useFAQs, useFeaturedFAQs, useFAQHelpful } from '@/lib/hooks/useContent';

const categoryIcons: Record<string, React.ReactElement> = {
  orders: <ShoppingCartIcon />,
  payments: <PaymentIcon />,
  shipping: <LocalShippingIcon />,
  returns: <AssignmentReturnIcon />,
  account: <AccountCircleIcon />,
  selling: <StorefrontIcon />,
};

function FAQSkeleton() {
  return (
    <Box sx={{ mb: 1 }}>
      <Skeleton variant="rounded" height={60} />
    </Box>
  );
}

export default function FAQPage() {
  const isDark = useIsDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);

  const { categories, loading: categoriesLoading } = useFAQCategories();
  const { faqs: featuredFaqs } = useFeaturedFAQs(10);
  const { faqs, loading, error } = useFAQs({
    filter: {
      search: searchQuery || undefined,
      categorySlug: selectedCategory !== 'all' ? selectedCategory : undefined,
    },
    limit: 50,
  });
  const { markHelpful, loading: helpfulLoading } = useFAQHelpful();

  const categoryTabs: { label: string; icon: React.ReactElement; value: string }[] = [
    { label: 'All', icon: <HelpOutlineIcon />, value: 'all' },
    ...categories.map((cat) => ({
      label: cat.name,
      icon: categoryIcons[cat.slug] || <HelpOutlineIcon />,
      value: cat.slug,
    })),
  ];

  const handleHelpful = async (faqId: string, helpful: boolean) => {
    if (!helpfulLoading) {
      await markHelpful(faqId, helpful);
    }
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
              py: 8,
              px: 4,
              mb: 6,
              background: isDark
                ? 'linear-gradient(135deg, rgba(156, 39, 176, 0.15) 0%, rgba(33, 150, 243, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)',
            }}
          >
            <HelpOutlineIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
              Frequently Asked Questions
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
            >
              Find answers to common questions about shopping, selling, and more.
            </Typography>
            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
              <TextField
                fullWidth
                placeholder="Search for answers..."
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

        {/* Popular Questions */}
        {searchQuery === '' && selectedCategory === 'all' && featuredFaqs.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
              Popular Questions
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {featuredFaqs.map((faq) => (
                <Chip
                  key={faq.id}
                  label={faq.question}
                  onClick={() => setExpandedFaq(faq.id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'primary.main', color: 'white' },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Category Tabs */}
        {!categoriesLoading && categories.length > 0 && (
          <GlassCard sx={{ mb: 4 }}>
            <Tabs
              value={selectedCategory}
              onChange={(_, value) => setSelectedCategory(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2 }}
            >
              {categoryTabs.map((cat) => (
                <Tab
                  key={cat.value}
                  value={cat.value}
                  label={cat.label}
                  icon={cat.icon}
                  iconPosition="start"
                  sx={{ minHeight: 64 }}
                />
              ))}
            </Tabs>
          </GlassCard>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Failed to load FAQs. Please try again later.
          </Alert>
        )}

        {/* FAQ List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {loading ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <FAQSkeleton key={i} />
                ))}
              </>
            ) : faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Accordion
                    expanded={expandedFaq === faq.id}
                    onChange={(_, expanded) => setExpandedFaq(expanded ? faq.id : false)}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      overflow: 'hidden',
                      '&:before': { display: 'none' },
                      bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ py: 1 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {faq.category && (
                          <Chip
                            label={faq.category.name}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        <Typography variant="subtitle1" fontWeight={600}>
                          {faq.question}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0, pb: 3 }}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.8 }}
                      >
                        {faq.answer}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Was this helpful?
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <GlassButton
                            size="small"
                            variant="outlined"
                            startIcon={<ThumbUpIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHelpful(faq.id, true);
                            }}
                            disabled={helpfulLoading}
                          >
                            Yes {faq.helpfulYes ? `(${faq.helpfulYes})` : ''}
                          </GlassButton>
                          <GlassButton
                            size="small"
                            variant="outlined"
                            startIcon={<ThumbDownIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHelpful(faq.id, false);
                            }}
                            disabled={helpfulLoading}
                          >
                            No {faq.helpfulNo ? `(${faq.helpfulNo})` : ''}
                          </GlassButton>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              ))
            ) : (
              <GlassCard sx={{ p: 6, textAlign: 'center' }}>
                <HelpOutlineIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No questions found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your search or browse a different category
                </Typography>
                <GlassButton
                  variant="contained"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear Filters
                </GlassButton>
              </GlassCard>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard
            sx={{
              mt: 6,
              p: 6,
              textAlign: 'center',
              background: isDark
                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(33, 150, 243, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)',
            }}
          >
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              Still have questions?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Can't find what you're looking for? Our support team is here to help.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <GlassButton variant="contained" href="/contact">
                Contact Support
              </GlassButton>
              <GlassButton variant="outlined" href="/help">
                Visit Help Center
              </GlassButton>
            </Box>
          </GlassCard>
        </motion.div>
      </Container>
    </MainLayout>
  );
}
