'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useRequireAuth, usePermissions } from '@/lib/store/hooks';
import { useIsDarkMode } from '@/lib/theme';
import { createGlassStyles } from '@/lib/theme/glass';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  roles,
  permissions,
  redirectTo = '/login',
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter();
  const isDark = useIsDarkMode();
  const { isAuthenticated, isInitialized, isAuthorized, isLoading } = useRequireAuth({
    roles,
    permissions,
    redirectTo,
  });
  const { hasRole, hasAnyPermission } = usePermissions();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  // Check role access
  useEffect(() => {
    if (!isLoading && isAuthenticated && roles && roles.length > 0) {
      const hasRequiredRole = roles.some(hasRole);
      if (!hasRequiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [isLoading, isAuthenticated, roles, hasRole, router]);

  // Check permission access
  useEffect(() => {
    if (!isLoading && isAuthenticated && permissions && permissions.length > 0) {
      if (!hasAnyPermission(permissions)) {
        router.push('/unauthorized');
      }
    }
  }, [isLoading, isAuthenticated, permissions, hasAnyPermission, router]);

  // Loading state
  if (isLoading) {
    return fallback || (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Box
            sx={{
              ...createGlassStyles('elevated', isDark),
              p: 4,
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <CircularProgress size={48} />
            <Typography color="text.secondary">
              Loading...
            </Typography>
          </Box>
        </motion.div>
      </Box>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check roles
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.some(hasRole);
    if (!hasRequiredRole) {
      return null;
    }
  }

  // Check permissions
  if (permissions && permissions.length > 0) {
    if (!hasAnyPermission(permissions)) {
      return null;
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute;
