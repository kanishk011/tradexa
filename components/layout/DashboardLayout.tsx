'use client';

import React, { useState } from 'react';
import { Box, IconButton, Typography, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ImageIcon from '@mui/icons-material/Image';
import RateReviewIcon from '@mui/icons-material/RateReview';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Sidebar } from './Sidebar';
import { useIsDarkMode, useTheme } from '@/lib/theme';
import { glassNavbarStyles, createGlassStyles } from '@/lib/theme/glass';
import { GlassIconButton } from '@/components/ui/GlassIconButton';
import { GlassAvatar } from '@/components/ui/GlassAvatar';
import { appConfig } from '@/config';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    roles: string[];
  } | null;
  type?: 'admin' | 'seller';
}

const adminMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, href: '/admin' },
  { id: 'users', label: 'Users', icon: <PeopleIcon />, href: '/admin/users' },
  {
    id: 'products',
    label: 'Products',
    icon: <InventoryIcon />,
    children: [
      { id: 'all-products', label: 'All Products', href: '/admin/products' },
      { id: 'add-product', label: 'Add Product', href: '/admin/products/new' },
      { id: 'pending-products', label: 'Pending Approval', href: '/admin/products/pending', badge: 5 },
    ],
  },
  { id: 'categories', label: 'Categories', icon: <CategoryIcon />, href: '/admin/categories' },
  { id: 'orders', label: 'Orders', icon: <ShoppingCartIcon />, href: '/admin/orders', badge: 12 },
  { id: 'reviews', label: 'Reviews', icon: <RateReviewIcon />, href: '/admin/reviews' },
  { id: 'coupons', label: 'Coupons', icon: <LocalOfferIcon />, href: '/admin/coupons' },
  { id: 'banners', label: 'Banners', icon: <ImageIcon />, href: '/admin/banners' },
  { id: 'analytics', label: 'Analytics', icon: <BarChartIcon />, href: '/admin/analytics' },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon />, href: '/admin/settings' },
];

const sellerMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, href: '/seller/dashboard' },
  {
    id: 'products',
    label: 'Products',
    icon: <InventoryIcon />,
    children: [
      { id: 'my-products', label: 'My Products', href: '/seller/products' },
      { id: 'add-product', label: 'Add Product', href: '/seller/products/new' },
    ],
  },
  { id: 'orders', label: 'Orders', icon: <ShoppingCartIcon />, href: '/seller/orders', badge: 3 },
  { id: 'reviews', label: 'Reviews', icon: <RateReviewIcon />, href: '/seller/reviews' },
  { id: 'analytics', label: 'Analytics', icon: <BarChartIcon />, href: '/seller/analytics' },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon />, href: '/seller/settings' },
];

export function DashboardLayout({
  children,
  user,
  type = 'admin',
}: DashboardLayoutProps) {
  const isDark = useIsDarkMode();
  const { toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = type === 'admin' ? adminMenuItems : sellerMenuItems;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Sidebar */}
      <Sidebar
        items={menuItems}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        variant={isMobile ? 'temporary' : 'permanent'}
        header={
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                background: isDark
                  ? 'linear-gradient(135deg, #64B5F6 0%, #BA68C8 100%)'
                  : 'linear-gradient(135deg, #1976D2 0%, #9C27B0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {appConfig.name}
            </Typography>
          </Link>
        }
        footer={
          user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <GlassAvatar src={user.avatar} alt={user.name} size="small">
                {user.name.charAt(0)}
              </GlassAvatar>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="subtitle2" fontWeight={600} noWrap>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {type === 'admin' ? 'Administrator' : 'Seller'}
                </Typography>
              </Box>
            </Box>
          )
        }
      />

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Bar */}
        <Box
          sx={{
            ...glassNavbarStyles(isDark),
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <GlassIconButton onClick={() => setSidebarOpen(true)}>
                <MenuIcon />
              </GlassIconButton>
            )}
            <Typography variant="h6" fontWeight={600}>
              {type === 'admin' ? 'Admin Panel' : 'Seller Dashboard'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GlassIconButton onClick={toggleTheme} tooltip={isDark ? 'Light mode' : 'Dark mode'}>
              {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </GlassIconButton>
            <GlassIconButton tooltip="Notifications">
              <NotificationsIcon />
            </GlassIconButton>
          </Box>
        </Box>

        {/* Page Content */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{
            flex: 1,
            p: 3,
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;
