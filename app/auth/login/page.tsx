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
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassInput, GlassButton } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In production, this would call the GraphQL mutation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful login
      router.push('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log('Login with:', provider);
    // Implement OAuth login
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sign in to continue shopping
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Social Login */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <GlassButton
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={() => handleSocialLogin('google')}
        >
          Google
        </GlassButton>
        <GlassButton
          fullWidth
          startIcon={<GitHubIcon />}
          onClick={() => handleSocialLogin('github')}
        >
          GitHub
        </GlassButton>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          or continue with email
        </Typography>
      </Divider>

      {/* Login Form */}
      <Box component="form" onSubmit={handleSubmit}>
        <GlassInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
          startIcon={<EmailIcon color="action" />}
        />

        <GlassInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                size="small"
              />
            }
            label={<Typography variant="body2">Remember me</Typography>}
          />
          <Link href="/auth/forgot-password" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="primary">
              Forgot password?
            </Typography>
          </Link>
        </Box>

        <GlassButton
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          loading={loading}
        >
          Sign In
        </GlassButton>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" style={{ textDecoration: 'none' }}>
            <Typography component="span" variant="body2" color="primary" fontWeight={600}>
              Sign up
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
