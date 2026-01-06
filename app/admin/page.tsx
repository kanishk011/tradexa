'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid2 as Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useIsDarkMode } from '@/lib/theme';
import { GlassCard, GlassButton } from '@/components/ui';
import { appConfig } from '@/config';

// Stats data
const stats = [
  {
    title: 'Total Revenue',
    value: '$54,239',
    change: '+12.5%',
    trend: 'up',
    icon: <AttachMoneyIcon />,
    color: '#4CAF50',
  },
  {
    title: 'Total Orders',
    value: '1,429',
    change: '+8.2%',
    trend: 'up',
    icon: <ShoppingCartIcon />,
    color: '#2196F3',
  },
  {
    title: 'Total Customers',
    value: '3,842',
    change: '+15.3%',
    trend: 'up',
    icon: <PeopleIcon />,
    color: '#9C27B0',
  },
  {
    title: 'Total Products',
    value: '892',
    change: '-2.1%',
    trend: 'down',
    icon: <InventoryIcon />,
    color: '#FF9800',
  },
];

// Recent orders
const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', date: '2025-01-15', total: 234.99, status: 'delivered' },
  { id: 'ORD-002', customer: 'Jane Smith', date: '2025-01-15', total: 129.50, status: 'shipped' },
  { id: 'ORD-003', customer: 'Bob Wilson', date: '2025-01-14', total: 89.99, status: 'processing' },
  { id: 'ORD-004', customer: 'Alice Brown', date: '2025-01-14', total: 459.00, status: 'pending' },
  { id: 'ORD-005', customer: 'Charlie Davis', date: '2025-01-13', total: 175.25, status: 'delivered' },
];

// Top products
const topProducts = [
  { name: 'Wireless Headphones', sales: 234, revenue: 46723, progress: 85 },
  { name: 'Smart Watch Pro', sales: 189, revenue: 66061, progress: 72 },
  { name: 'Designer Bag', sales: 156, revenue: 20274, progress: 60 },
  { name: 'Running Shoes', sales: 134, revenue: 21434, progress: 52 },
];

const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

export default function AdminDashboardPage() {
  const isDark = useIsDarkMode();

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome back, Admin
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with {appConfig.name} today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <GlassCard
              animate={false}
              sx={{ height: '100%' }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {stat.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {stat.trend === 'up' ? (
                      <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                    )}
                    <Typography
                      variant="body2"
                      color={stat.trend === 'up' ? 'success.main' : 'error.main'}
                      fontWeight={500}
                    >
                      {stat.change}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      vs last month
                    </Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    backgroundColor: `${stat.color}20`,
                    color: stat.color,
                    width: 48,
                    height: 48,
                  }}
                >
                  {stat.icon}
                </Avatar>
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <GlassCard animate={false}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Recent Orders
              </Typography>
              <GlassButton size="small" href="/admin/orders">
                View All
              </GlassButton>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {order.id}
                        </Typography>
                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={statusColors[order.status]}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>
        </Grid>

        {/* Top Products */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <GlassCard animate={false}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Top Products
              </Typography>
              <GlassButton size="small" href="/admin/products">
                View All
              </GlassButton>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {topProducts.map((product, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.sales} sales
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={product.progress}
                      sx={{
                        flex: 1,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      }}
                    />
                    <Typography variant="body2" fontWeight={600} sx={{ minWidth: 60 }}>
                      ${(product.revenue / 1000).toFixed(1)}k
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
