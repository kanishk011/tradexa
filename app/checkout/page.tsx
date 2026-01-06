'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Breadcrumbs,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  PriceDisplay,
} from '@/components/ui';

const steps = ['Shipping', 'Payment', 'Review'];

// Sample cart data
const cartItems = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    price: 349.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
  },
];

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    // Redirect to order confirmation
    window.location.href = '/orders/confirmation';
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Shipping Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <GlassInput
                  label="First Name"
                  value={shippingData.firstName}
                  onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <GlassInput
                  label="Last Name"
                  value={shippingData.lastName}
                  onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <GlassInput
                  label="Email"
                  type="email"
                  value={shippingData.email}
                  onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <GlassInput
                  label="Phone"
                  type="tel"
                  value={shippingData.phone}
                  onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <GlassInput
                  label="Address"
                  value={shippingData.address}
                  onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <GlassInput
                  label="City"
                  value={shippingData.city}
                  onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <GlassInput
                  label="State"
                  value={shippingData.state}
                  onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <GlassInput
                  label="ZIP Code"
                  value={shippingData.zipCode}
                  onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Payment Method
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <GlassCard sx={{ mb: 2, p: 2 }}>
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CreditCardIcon />
                      <Typography>Credit/Debit Card</Typography>
                    </Box>
                  }
                />
              </GlassCard>
              <GlassCard sx={{ mb: 2, p: 2 }}>
                <FormControlLabel
                  value="paypal"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PaymentIcon />
                      <Typography>PayPal</Typography>
                    </Box>
                  }
                />
              </GlassCard>
            </RadioGroup>

            {paymentMethod === 'card' && (
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <GlassInput
                      label="Card Number"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <GlassInput
                      label="Name on Card"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <GlassInput
                      label="Expiry Date"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      placeholder="MM/YY"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <GlassInput
                      label="CVV"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      placeholder="123"
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Review Your Order
            </Typography>

            {/* Shipping Address */}
            <GlassCard sx={{ mb: 3, p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocalShippingIcon color="primary" />
                <Typography fontWeight={600}>Shipping Address</Typography>
              </Box>
              <Typography>
                {shippingData.firstName} {shippingData.lastName}
              </Typography>
              <Typography color="text.secondary">
                {shippingData.address}
              </Typography>
              <Typography color="text.secondary">
                {shippingData.city}, {shippingData.state} {shippingData.zipCode}
              </Typography>
            </GlassCard>

            {/* Payment Method */}
            <GlassCard sx={{ mb: 3, p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PaymentIcon color="primary" />
                <Typography fontWeight={600}>Payment Method</Typography>
              </Box>
              <Typography>
                {paymentMethod === 'card' ? `Card ending in ${cardData.number.slice(-4) || '****'}` : 'PayPal'}
              </Typography>
            </GlassCard>

            {/* Order Items */}
            <GlassCard sx={{ p: 2 }}>
              <Typography fontWeight={600} gutterBottom>Order Items</Typography>
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover' }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography fontWeight={500}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </GlassCard>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
          <Link href="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>Cart</Link>
          <Typography color="text.primary">Checkout</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
          Checkout
        </Typography>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: activeStep >= index ? 'primary.main' : 'action.disabledBackground',
                      color: activeStep >= index ? 'white' : 'text.disabled',
                    }}
                  >
                    {activeStep > index ? <CheckCircleIcon fontSize="small" /> : index + 1}
                  </Box>
                )}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <GlassCard>
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>

              {/* Navigation */}
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                {activeStep > 0 && (
                  <GlassButton onClick={handleBack} disabled={loading}>
                    Back
                  </GlassButton>
                )}
                <GlassButton
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleNext}
                  loading={loading}
                >
                  {activeStep === steps.length - 1 ? 'Place Order' : 'Continue'}
                </GlassButton>
              </Box>
            </GlassCard>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <GlassCard sx={{ position: 'sticky', top: 100 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Order Summary
              </Typography>

              <Box sx={{ my: 2 }}>
                {cartItems.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.name} × {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography color="success.main">Free</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Tax</Typography>
                <Typography>${tax.toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={600}>Total</Typography>
                <PriceDisplay price={total} size="large" />
              </Box>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}
