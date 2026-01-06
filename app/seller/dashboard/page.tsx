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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useIsDarkMode } from '@/lib/theme';
import { GlassCard, GlassButton } from '@/components/ui';

// Seller stats
const stats = [
  {
    title: 'Total Earnings',
    value: '$12,429',
    change: '+18.5%',
    trend: 'up',
    icon: <AttachMoneyIcon />,
    color: '#4CAF50',
  },
  {
    title: 'Orders',
    value: '342',
    change: '+12.2%',
    trend: 'up',
    icon: <ShoppingCartIcon />,
    color: '#2196F3',
  },
  {
    title: 'Products',
    value: '48',
    change: '+5',
    trend: 'up',
    icon: <InventoryIcon />,
    color: '#9C27B0',
  },
  {
    title: 'Views',
    value: '8,429',
    change: '+22.1%',
    trend: 'up',
    icon: <VisibilityIcon />,
    color: '#FF9800',
  },
];

// Recent orders for seller
const recentOrders = [
  { id: 'ORD-001', product: 'Wireless Headphones', buyer: 'John Doe', date: '2025-01-15', total: 199.99, status: 'shipped' },
  { id: 'ORD-002', product: 'Smart Watch Pro', buyer: 'Jane Smith', date: '2025-01-15', total: 349.99, status: 'processing' },
  { id: 'ORD-003', product: 'Designer Bag', buyer: 'Bob Wilson', date: '2025-01-14', total: 129.99, status: 'pending' },
];

// My products
const myProducts = [
  { name: 'Wireless Headphones', stock: 45, sales: 156, rating: 4.8, status: 'active' },
  { name: 'Smart Watch Pro', stock: 23, sales: 89, rating: 4.6, status: 'active' },
  { name: 'Designer Bag', stock: 0, sales: 234, rating: 4.9, status: 'out_of_stock' },
  { name: 'Running Shoes', stock: 67, sales: 78, rating: 4.5, status: 'active' },
];

const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  active: 'success',
  out_of_stock: 'error',
  inactive: 'default',
};

export default function SellerDashboardPage() {
  const isDark = useIsDarkMode();

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Seller Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your store performance
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <GlassCard animate={false} sx={{ height: '100%' }}>
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
        <Grid size={{ xs: 12, lg: 7 }}>
          <GlassCard animate={false}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Recent Orders
              </Typography>
              <GlassButton size="small" href="/seller/orders">
                View All
              </GlassButton>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Buyer</TableCell>
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
                      <TableCell>{order.product}</TableCell>
                      <TableCell>{order.buyer}</TableCell>
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

        {/* My Products */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <GlassCard animate={false}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                My Products
              </Typography>
              <GlassButton size="small" href="/seller/products">
                Manage
              </GlassButton>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {myProducts.map((product, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: '12px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Stock: {product.stock} | Sales: {product.sales}
                    </Typography>
                  </Box>
                  <Chip
                    label={product.status.replace('_', ' ')}
                    color={statusColors[product.status]}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
              ))}
            </Box>
            <GlassButton
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              href="/seller/products/new"
            >
              Add New Product
            </GlassButton>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
