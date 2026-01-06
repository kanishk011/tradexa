'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Container,
  Drawer,
  List,
  ListItem,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Link from 'next/link';
import { useTheme, useIsDarkMode } from '@/lib/theme';
import { glassNavbarStyles, createGlassStyles } from '@/lib/theme/glass';
import { GlassIconButton } from '@/components/ui/GlassIconButton';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassAvatar } from '@/components/ui/GlassAvatar';
import { SearchBar } from '@/components/ui/SearchBar';
import { appConfig } from '@/config';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: string[];
}

interface HeaderProps {
  user?: User | null;
  cartItemCount?: number;
  wishlistCount?: number;
  onLogout?: () => void;
}

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
  { label: 'Deals', href: '/deals' },
];

export function Header({
  user,
  cartItemCount = 0,
  wishlistCount = 0,
  onLogout,
}: HeaderProps) {
  const { toggleTheme, isDark } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    onLogout?.();
  };

  const isAdmin = user?.roles?.includes('ADMIN');
  const isSeller = user?.roles?.includes('SELLER');

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          ...glassNavbarStyles(isDark),
          backgroundColor: 'transparent',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0 }, gap: 2 }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <GlassIconButton onClick={() => setMobileMenuOpen(true)}>
                <MenuIcon />
              </GlassIconButton>
            )}

            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Typography
                  variant="h5"
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
              </Box>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, ml: 4 }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{ textDecoration: 'none' }}
                  >
                    <GlassButton
                      glassEffect={false}
                      sx={{
                        color: 'text.primary',
                        '&:hover': {
                          backgroundColor: isDark
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.03)',
                        },
                      }}
                    >
                      {link.label}
                    </GlassButton>
                  </Link>
                ))}
              </Box>
            )}

            {/* Search Bar */}
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <SearchBar placeholder="Search products, categories, brands..." />
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Theme Toggle */}
              <GlassIconButton onClick={toggleTheme} tooltip={isDark ? 'Light mode' : 'Dark mode'}>
                {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
              </GlassIconButton>

              {/* Wishlist */}
              <Link href="/wishlist">
                <GlassIconButton tooltip="Wishlist">
                  <Badge badgeContent={wishlistCount} color="error">
                    <FavoriteIcon />
                  </Badge>
                </GlassIconButton>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <GlassIconButton tooltip="Cart">
                  <Badge badgeContent={cartItemCount} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </GlassIconButton>
              </Link>

              {/* User Menu */}
              {user ? (
                <>
                  <GlassIconButton onClick={handleUserMenuOpen}>
                    <GlassAvatar
                      src={user.avatar}
                      alt={user.name}
                      size="small"
                      sx={{ width: 32, height: 32 }}
                    >
                      {user.name.charAt(0)}
                    </GlassAvatar>
                  </GlassIconButton>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        ...createGlassStyles('elevated', isDark),
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleUserMenuClose} component={Link} href="/profile">
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Profile</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleUserMenuClose} component={Link} href="/orders">
                      <ListItemIcon>
                        <StorefrontIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>My Orders</ListItemText>
                    </MenuItem>
                    {(isSeller || isAdmin) && (
                      <MenuItem onClick={handleUserMenuClose} component={Link} href="/seller/dashboard">
                        <ListItemIcon>
                          <DashboardIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Seller Dashboard</ListItemText>
                      </MenuItem>
                    )}
                    {isAdmin && (
                      <MenuItem onClick={handleUserMenuClose} component={Link} href="/admin">
                        <ListItemIcon>
                          <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Admin Panel</ListItemText>
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Link href="/auth/login">
                  <GlassButton startIcon={<LoginIcon />}>Login</GlassButton>
                </Link>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            ...createGlassStyles('frosted', isDark),
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            {appConfig.name}
          </Typography>
        </Box>
        <Divider />
        <List>
          {navLinks.map((link) => (
            <ListItem
              key={link.href}
              component={Link}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.03)',
                },
              }}
            >
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <SearchBar />
        </Box>
      </Drawer>
    </>
  );
}

export default Header;
