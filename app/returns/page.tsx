'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import PaidIcon from '@mui/icons-material/Paid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { MainLayout } from '@/components/layout';
import { GlassCard, GlassButton } from '@/components/ui';
import { useIsDarkMode } from '@/lib/theme';
import { appConfig } from '@/config';

const returnSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  email: z.string().email('Please enter a valid email'),
});

type ReturnFormData = z.infer<typeof returnSchema>;

const returnSteps = [
  {
    icon: <SearchIcon />,
    title: 'Find Your Order',
    description: 'Enter your order number and email to locate your purchase.',
  },
  {
    icon: <InventoryIcon />,
    title: 'Select Items',
    description: 'Choose which items you want to return and provide a reason.',
  },
  {
    icon: <LocalShippingIcon />,
    title: 'Ship It Back',
    description: 'Print your prepaid label and drop off the package.',
  },
  {
    icon: <PaidIcon />,
    title: 'Get Refunded',
    description: 'Receive your refund within 5-7 business days of return receipt.',
  },
];

const returnReasons = [
  'Item doesn\'t fit',
  'Changed my mind',
  'Item not as described',
  'Received wrong item',
  'Item arrived damaged',
  'Quality not as expected',
  'Better price found elsewhere',
  'Other',
];

const returnPolicies = [
  {
    category: 'Standard Items',
    period: '30 days',
    condition: 'Unused, original packaging',
    icon: <CheckCircleIcon color="success" />,
  },
  {
    category: 'Electronics',
    period: '14 days',
    condition: 'Unopened or defective',
    icon: <CheckCircleIcon color="success" />,
  },
  {
    category: 'Clothing & Shoes',
    period: '30 days',
    condition: 'Unworn, tags attached',
    icon: <CheckCircleIcon color="success" />,
  },
  {
    category: 'Intimate Apparel',
    period: 'Non-returnable',
    condition: 'Final sale for hygiene',
    icon: <WarningIcon color="warning" />,
  },
  {
    category: 'Customized Items',
    period: 'Non-returnable',
    condition: 'Made to order',
    icon: <WarningIcon color="warning" />,
  },
  {
    category: 'Clearance Items',
    period: '14 days',
    condition: 'Store credit only',
    icon: <InfoIcon color="info" />,
  },
];

export default function ReturnsPage() {
  const isDark = useIsDarkMode();
  const [activeStep, setActiveStep] = useState(0);
  const [orderFound, setOrderFound] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReturnFormData>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      orderNumber: '',
      email: '',
    },
  });

  const onSubmit = async (data: ReturnFormData) => {
    console.log('Looking up order:', data);
    // Simulate order lookup
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOrderFound(true);
    setActiveStep(1);
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
                ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.15) 0%, rgba(255, 152, 0, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%)',
            }}
          >
            <AssignmentReturnIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
              Returns & Refunds
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Easy returns within 30 days. Start your return in just a few clicks.
            </Typography>
          </GlassCard>
        </motion.div>

        {/* How It Works */}
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4, textAlign: 'center' }}>
          How Returns Work
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {returnSteps.map((step, index) => (
            <Grid key={index} size={{ xs: 6, md: 3 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography variant="overline" color="primary">
                    Step {index + 1}
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Start Return Form */}
          <Grid size={{ xs: 12, md: 6 }}>
            <GlassCard sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Start a Return
              </Typography>
              <Stepper activeStep={activeStep} orientation="vertical">
                <Step>
                  <StepLabel>Find Your Order</StepLabel>
                  <StepContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Controller
                        name="orderNumber"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Order Number"
                            placeholder="e.g., ORD-123456"
                            error={!!errors.orderNumber}
                            helperText={errors.orderNumber?.message}
                            sx={{ mb: 2 }}
                          />
                        )}
                      />
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Email Address"
                            type="email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            sx={{ mb: 2 }}
                          />
                        )}
                      />
                      <GlassButton type="submit" variant="contained">
                        Find Order
                      </GlassButton>
                    </form>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Select Items to Return</StepLabel>
                  <StepContent>
                    {orderFound && (
                      <Box>
                        <Alert severity="success" sx={{ mb: 2 }}>
                          Order found! Select items to return below.
                        </Alert>
                        <Box
                          sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: 2,
                            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Premium Wireless Headphones
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Qty: 1 • $199.99
                          </Typography>
                        </Box>
                        <TextField
                          select
                          fullWidth
                          label="Reason for Return"
                          defaultValue=""
                          sx={{ mb: 2 }}
                        >
                          {returnReasons.map((reason) => (
                            <MenuItem key={reason} value={reason}>
                              {reason}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          fullWidth
                          label="Additional Comments (Optional)"
                          multiline
                          rows={3}
                          sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <GlassButton
                            variant="outlined"
                            onClick={() => setActiveStep(0)}
                          >
                            Back
                          </GlassButton>
                          <GlassButton
                            variant="contained"
                            onClick={() => setActiveStep(2)}
                          >
                            Continue
                          </GlassButton>
                        </Box>
                      </Box>
                    )}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Review & Submit</StepLabel>
                  <StepContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Please review your return request before submitting.
                    </Alert>
                    <Box
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      }}
                    >
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Item:</strong> Premium Wireless Headphones
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Refund Amount:</strong> $199.99
                      </Typography>
                      <Typography variant="body2">
                        <strong>Refund Method:</strong> Original payment method
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <GlassButton
                        variant="outlined"
                        onClick={() => setActiveStep(1)}
                      >
                        Back
                      </GlassButton>
                      <GlassButton variant="contained">
                        Submit Return Request
                      </GlassButton>
                    </Box>
                  </StepContent>
                </Step>
              </Stepper>
            </GlassCard>
          </Grid>

          {/* Return Policy */}
          <Grid size={{ xs: 12, md: 6 }}>
            <GlassCard sx={{ p: 4, mb: 3 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Return Policy by Category
              </Typography>
              {returnPolicies.map((policy, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 2,
                    borderBottom: index < returnPolicies.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ mr: 2 }}>{policy.icon}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {policy.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {policy.condition}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={policy.period === 'Non-returnable' ? 'error.main' : 'primary.main'}
                  >
                    {policy.period}
                  </Typography>
                </Box>
              ))}
            </GlassCard>

            <GlassCard sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Important Information
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Return shipping is free for defective or incorrect items.
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Items must be in original condition with all tags attached.
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Refunds are processed within 5-7 business days of receipt.
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Original shipping costs are non-refundable (unless our error).
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Sale items may have different return windows.
                </Typography>
              </Box>
            </GlassCard>
          </Grid>
        </Grid>

        {/* Contact for Help */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard sx={{ mt: 6, p: 4, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              Need Help with Your Return?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Our customer support team is here to assist you with any questions.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <GlassButton variant="contained" href="/contact">
                Contact Support
              </GlassButton>
              <GlassButton variant="outlined" href="/faq">
                View FAQs
              </GlassButton>
            </Box>
          </GlassCard>
        </motion.div>
      </Container>
    </MainLayout>
  );
}
