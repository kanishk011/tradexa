'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Container,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { motion } from 'framer-motion';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import {
  GlassCard,
  GlassButton,
  EmptyState,
} from '@/components/ui';

// Sample orders data
const orders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 549.97,
    items: [
      { name: 'Premium Wireless Headphones', quantity: 1, price: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' },
      { name: 'Smart Watch Pro', quantity: 1, price: 349.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100' },
    ],
  },
  {
    id: 'ORD-002',
    date: '2024-01-20',
    status: 'shipped',
    total: 129.99,
    items: [
      { name: 'Designer Leather Bag', quantity: 1, price: 129.99, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100' },
    ],
  },
  {
    id: 'ORD-003',
    date: '2024-01-22',
    status: 'processing',
    total: 159.99,
    items: [
      { name: 'Running Shoes Elite', quantity: 1, price: 159.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100' },
    ],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'success';
    case 'shipped':
      return 'info';
    case 'processing':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered':
      return <CheckCircleIcon fontSize="small" />;
    case 'shipped':
      return <LocalShippingIcon fontSize="small" />;
    case 'cancelled':
      return <CancelIcon fontSize="small" />;
    default:
      return <ReceiptIcon fontSize="small" />;
  }
};

export default function OrdersPage() {
  const [tabValue, setTabValue] = useState(0);

  const filteredOrders = tabValue === 0
    ? orders
    : orders.filter(order => {
        if (tabValue === 1) return order.status === 'processing' || order.status === 'shipped';
        if (tabValue === 2) return order.status === 'delivered';
        if (tabValue === 3) return order.status === 'cancelled';
        return true;
      });

  if (orders.length === 0) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Breadcrumbs sx={{ mb: 3 }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
              <Typography color="text.primary">Orders</Typography>
            </Breadcrumbs>
            <EmptyState
              type="orders"
              action={{
                label: 'Start Shopping',
                href: '/products',
              }}
            />
          </Container>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            <Typography color="text.primary">Orders</Typography>
          </Breadcrumbs>

          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <ReceiptIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight={700}>
              My Orders
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="All Orders" />
            <Tab label="In Progress" />
            <Tab label="Delivered" />
            <Tab label="Cancelled" />
          </Tabs>

          {/* Orders List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard>
                  {/* Order Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Order {order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placed on {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      color={getStatusColor(order.status) as 'success' | 'info' | 'warning' | 'error' | 'default'}
                      size="small"
                    />
                  </Box>

                  {/* Order Items */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    {order.items.map((item, itemIndex) => (
                      <Box key={itemIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            objectFit: 'cover',
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={500}>{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Qty: {item.quantity}
                          </Typography>
                        </Box>
                        <Typography fontWeight={600}>
                          ${item.price.toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Order Footer */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" fontWeight={600}>
                      Total: ${order.total.toFixed(2)}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Link href={`/orders/${order.id}`}>
                        <GlassButton size="small">
                          View Details
                        </GlassButton>
                      </Link>
                      {order.status === 'delivered' && (
                        <GlassButton size="small" variant="contained">
                          Buy Again
                        </GlassButton>
                      )}
                    </Box>
                  </Box>
                </GlassCard>
              </motion.div>
            ))}
          </Box>
        </Container>
      </MainLayout>
    </ProtectedRoute>
  );
}
