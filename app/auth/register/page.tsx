'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  IconButton,
  FormControlLabel,
  Checkbox,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassInput, GlassButton, GlassSelect } from '@/components/ui';

const steps = ['Account', 'Profile', 'Verify'];

const accountTypes = [
  { value: 'buyer', label: 'Buyer - I want to shop' },
  { value: 'seller', label: 'Seller - I want to sell products' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'buyer',
    agreeToTerms: false,
    subscribeNewsletter: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleCheckboxChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.checked,
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // In production, this would call the GraphQL mutation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful registration
      router.push('/auth/login?registered=true');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.email && formData.password && formData.password === formData.confirmPassword;
      case 1:
        return formData.firstName && formData.lastName && formData.agreeToTerms;
      case 2:
        return true;
      default:
        return false;
    }
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
            <GlassInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
              fullWidth
              sx={{ mb: 2 }}
              startIcon={<EmailIcon color="action" />}
            />

            <GlassInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              required
              fullWidth
              sx={{ mb: 2 }}
              startIcon={<LockIcon color="action" />}
              endIcon={
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              }
              helperText="At least 8 characters with uppercase, lowercase, and numbers"
            />

            <GlassInput
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              required
              fullWidth
              sx={{ mb: 2 }}
              startIcon={<LockIcon color="action" />}
              error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
              helperText={
                formData.confirmPassword !== '' && formData.password !== formData.confirmPassword
                  ? 'Passwords do not match'
                  : ''
              }
            />
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <GlassInput
                label="First Name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                required
                fullWidth
                startIcon={<PersonIcon color="action" />}
              />
              <GlassInput
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                required
                fullWidth
              />
            </Box>

            <GlassInput
              label="Phone (optional)"
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              fullWidth
              sx={{ mb: 2 }}
              startIcon={<PhoneIcon color="action" />}
            />

            <GlassSelect
              label="Account Type"
              value={formData.accountType}
              onChange={(e) => setFormData((prev) => ({ ...prev, accountType: e.target.value as string }))}
              options={accountTypes}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeToTerms}
                  onChange={handleCheckboxChange('agreeToTerms')}
                  required
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link href="/terms" style={{ color: 'inherit' }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" style={{ color: 'inherit' }}>
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mb: 1 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.subscribeNewsletter}
                  onChange={handleCheckboxChange('subscribeNewsletter')}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  Subscribe to newsletter for exclusive offers
                </Typography>
              }
            />
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h6" gutterBottom>
                Verify Your Email
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                We&apos;ll send a verification link to <strong>{formData.email}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click the button below to complete registration and receive your verification email.
              </Typography>
            </Box>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Join us and start shopping today
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {renderStepContent()}
      </AnimatePresence>

      {/* Navigation Buttons */}
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
          disabled={!isStepValid()}
          loading={loading}
        >
          {activeStep === steps.length - 1 ? 'Complete Registration' : 'Continue'}
        </GlassButton>
      </Box>

      {activeStep === 0 && (
        <>
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              or sign up with
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <GlassButton fullWidth startIcon={<GoogleIcon />}>
              Google
            </GlassButton>
            <GlassButton fullWidth startIcon={<GitHubIcon />}>
              GitHub
            </GlassButton>
          </Box>
        </>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link href="/auth/login" style={{ textDecoration: 'none' }}>
            <Typography component="span" variant="body2" color="primary" fontWeight={600}>
              Sign in
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
