'use client';

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIsDarkMode } from '@/lib/theme';
import { glassSidebarStyles, createGlassStyles } from '@/lib/theme/glass';

interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: SidebarItem[];
  badge?: string | number;
}

interface SidebarProps {
  items: SidebarItem[];
  open?: boolean;
  onClose?: () => void;
  width?: number;
  variant?: 'permanent' | 'temporary';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Sidebar({
  items,
  open = true,
  onClose,
  width = 280,
  variant = 'permanent',
  header,
  footer,
}: SidebarProps) {
  const isDark = useIsDarkMode();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);

  const effectiveVariant = isMobile ? 'temporary' : variant;
  const effectiveWidth = collapsed ? 72 : width;

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const renderItem = (item: SidebarItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isItemExpanded = expanded[item.id];
    const active = isActive(item.href);

    const itemContent = (
      <ListItemButton
        onClick={() => hasChildren && toggleExpanded(item.id)}
        sx={{
          pl: 2 + depth * 2,
          pr: 2,
          py: 1.5,
          borderRadius: '12px',
          mx: 1,
          my: 0.5,
          minHeight: 48,
          justifyContent: collapsed ? 'center' : 'flex-start',
          backgroundColor: active
            ? isDark
              ? 'rgba(100, 181, 246, 0.15)'
              : 'rgba(33, 150, 243, 0.1)'
            : 'transparent',
          '&:hover': {
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.04)',
          },
        }}
      >
        {item.icon && (
          <ListItemIcon
            sx={{
              minWidth: collapsed ? 0 : 40,
              color: active ? 'primary.main' : 'text.secondary',
            }}
          >
            {item.icon}
          </ListItemIcon>
        )}
        {!collapsed && (
          <>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: active ? 600 : 400,
                color: active ? 'primary.main' : 'text.primary',
              }}
            />
            {item.badge && (
              <Box
                component={motion.span}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                sx={{
                  backgroundColor: 'error.main',
                  color: '#fff',
                  borderRadius: '10px',
                  px: 1,
                  py: 0.25,
                  fontSize: 12,
                  fontWeight: 600,
                  minWidth: 20,
                  textAlign: 'center',
                }}
              >
                {item.badge}
              </Box>
            )}
            {hasChildren && (isItemExpanded ? <ExpandLess /> : <ExpandMore />)}
          </>
        )}
      </ListItemButton>
    );

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          {item.href && !hasChildren ? (
            <Link href={item.href} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
              {itemContent}
            </Link>
          ) : (
            itemContent
          )}
        </ListItem>
        {hasChildren && !collapsed && (
          <Collapse in={isItemExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      {(header || !isMobile) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            p: 2,
            minHeight: 64,
          }}
        >
          {!collapsed && header}
          {!isMobile && effectiveVariant === 'permanent' && (
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              size="small"
              sx={{
                ...createGlassStyles('clear', isDark),
                borderRadius: '8px',
              }}
            >
              <MenuOpenIcon
                sx={{
                  transform: collapsed ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.3s ease',
                }}
              />
            </IconButton>
          )}
        </Box>
      )}

      <Divider sx={{ opacity: 0.5 }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List component="nav">
          {items.map((item) => renderItem(item))}
        </List>
      </Box>

      {/* Footer */}
      {footer && !collapsed && (
        <>
          <Divider sx={{ opacity: 0.5 }} />
          <Box sx={{ p: 2 }}>{footer}</Box>
        </>
      )}
    </Box>
  );

  return (
    <Drawer
      variant={effectiveVariant}
      open={effectiveVariant === 'temporary' ? open : true}
      onClose={onClose}
      sx={{
        width: effectiveWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          transition: 'width 0.3s ease',
          width: effectiveWidth,
          boxSizing: 'border-box',
          ...(glassSidebarStyles(isDark) as Record<string, unknown>),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export default Sidebar;
